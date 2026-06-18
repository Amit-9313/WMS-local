using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.DTOs;
using WarehouseAPI.Models;
using WarehouseAPI.Services;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseController : ControllerBase
    {
        private readonly WarehouseDbContext _context;
        private readonly IInventoryService _inventoryService;
        private readonly IPutawayService _putawayService;

        public PurchaseController(WarehouseDbContext context, IInventoryService inventoryService, IPutawayService putawayService)
        {
            _context = context;
            _inventoryService = inventoryService;
            _putawayService = putawayService;
        }

        // Purchase Requisitions
        [HttpPost("pr")]
        public async Task<IActionResult> CreatePR([FromBody] PRCreateDto dto)
        {
            var pr = new PurchaseRequisition
            {
                PRId = Guid.NewGuid(),
                PRNumber = $"PR-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
                ProjectId = dto.ProjectId,
                Priority = dto.Priority,
                RequiredByDate = dto.RequiredByDate,
                Remarks = dto.Remarks,
                Status = "Pending Approval",
                CreatedAt = DateTime.UtcNow
            };

            await _context.PurchaseRequisitions.AddAsync(pr);

            foreach (var line in dto.Lines)
            {
                var prLine = new PrLine
                {
                    PRLineId = Guid.NewGuid(),
                    PRId = pr.PRId,
                    ItemId = line.ItemId,
                    RequiredQty = line.RequiredQty,
                    ApprovedQty = line.RequiredQty, // Auto-approve for MVP
                    EstimatedUnitPrice = line.EstimatedUnitPrice,
                    Justification = line.Justification
                };
                await _context.PrLines.AddAsync(prLine);
            }

            await _context.SaveChangesAsync();
            return Ok(pr);
        }

        // Purchase Orders
        [HttpPost("po")]
        public async Task<IActionResult> CreatePO([FromBody] POCreateDto dto)
        {
            var po = new PurchaseOrder
            {
                POId = Guid.NewGuid(),
                PONumber = $"PO-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
                PRId = dto.PRId,
                VendorId = dto.VendorId,
                WarehouseId = dto.WarehouseId,
                PODate = DateTime.UtcNow,
                ExpectedDeliveryDate = dto.ExpectedDeliveryDate,
                PaymentTerms = dto.PaymentTerms,
                CurrencyCode = dto.CurrencyCode,
                Status = "Draft",
                CreatedAt = DateTime.UtcNow
            };

            decimal subTotal = 0;
            decimal taxAmount = 0;

            foreach (var line in dto.Lines)
            {
                decimal itemTotal = line.OrderedQty * line.UnitPrice;
                decimal itemTax = itemTotal * (line.TaxPct / 100.0m);

                var poLine = new PoLine
                {
                    POLineId = Guid.NewGuid(),
                    POId = po.POId,
                    ItemId = line.ItemId,
                    OrderedQty = line.OrderedQty,
                    ReceivedQty = 0,
                    UnitPrice = line.UnitPrice,
                    DiscountPct = line.DiscountPct,
                    TaxPct = line.TaxPct,
                    LineTotal = itemTotal + itemTax - (itemTotal * (line.DiscountPct / 100.0m)),
                    CreatedAt = DateTime.UtcNow
                };

                subTotal += itemTotal;
                taxAmount += itemTax;
                await _context.PoLines.AddAsync(poLine);
            }

            po.SubTotal = subTotal;
            po.TaxAmount = taxAmount;
            po.TotalAmount = subTotal + taxAmount;
            po.Status = "Confirmed"; // Skip draft step for simplicity

            await _context.PurchaseOrders.AddAsync(po);
            await _context.SaveChangesAsync();
            return Ok(po);
        }

        // Goods Receipt Note (GRN)
        [HttpPost("grn")]
        public async Task<IActionResult> CreateGRN([FromBody] GRNCreateDto dto)
        {
            var grn = new Grn
            {
                GRNId = Guid.NewGuid(),
                GRNNumber = $"GRN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
                POId = dto.POId,
                VendorId = dto.VendorId,
                ReceiptType = dto.ReceiptType,
                InvoiceNumber = dto.InvoiceNumber,
                InvoiceDate = dto.InvoiceDate,
                VehicleNumber = dto.VehicleNumber,
                DockZoneId = dto.DockZoneId,
                Status = "Draft",
                ReceivedAt = DateTime.UtcNow
            };

            // If dock zone is not set, find default for warehouse
            if (!dto.DockZoneId.HasValue && dto.POId.HasValue)
            {
                var po = await _context.PurchaseOrders.Include(p => p.Warehouse).FirstOrDefaultAsync(p => p.POId == dto.POId);
                grn.DockZoneId = po?.Warehouse?.DefaultDockZoneId;
            }

            await _context.Grns.AddAsync(grn);

            foreach (var line in dto.Lines)
            {
                var grnLine = new GrnLine
                {
                    GRNLineId = Guid.NewGuid(),
                    GRNId = grn.GRNId,
                    POLineId = line.POLineId,
                    ItemId = line.ItemId,
                    LotNumber = line.LotNumber,
                    ExpiryDate = line.ExpiryDate,
                    ReceivedQty = line.ReceivedQty,
                    AcceptedQty = 0,
                    RejectedQty = 0,
                    InspectionStatus = "Pending"
                };

                await _context.GrnLines.AddAsync(grnLine);

                // Update PO line received quantity
                if (line.POLineId.HasValue)
                {
                    var poLine = await _context.PoLines.FindAsync(line.POLineId.Value);
                    if (poLine != null)
                    {
                        poLine.ReceivedQty += line.ReceivedQty;
                    }
                }
            }

            grn.Status = "Received";
            await _context.SaveChangesAsync();

            // Receive items into the DOCK zone
            var warehouseId = Guid.Empty;
            if (dto.POId.HasValue)
            {
                var po = await _context.PurchaseOrders.FindAsync(dto.POId.Value);
                if (po != null) warehouseId = po.WarehouseId;
            }

            // Find a bin in the Dock Zone
            var dockBin = await _context.Bins
                .FirstOrDefaultAsync(b => b.IsActive && b.Shelf!.Rack!.ZoneId == grn.DockZoneId);

            if (dockBin != null && warehouseId != Guid.Empty)
            {
                foreach (var line in grn.Lines)
                {
                    var item = await _context.Items.FindAsync(line.ItemId);
                    decimal cost = item?.StandardCost ?? 0;

                    await _inventoryService.AddStockAsync(
                        warehouseId: warehouseId,
                        binId: dockBin.BinId,
                        itemId: line.ItemId,
                        qty: line.ReceivedQty,
                        lotNumber: line.LotNumber,
                        serialNumber: null,
                        projectId: null,
                        stageCode: null,
                        movementType: "Receiving",
                        referenceType: "GRN",
                        referenceId: grn.GRNId,
                        userId: null,
                        cost: cost,
                        remarks: $"Received on dock {dockBin.BinCode} via GRN {grn.GRNNumber}"
                    );
                }
            }

            return Ok(grn);
        }

        // Quality Inspection
        [HttpPost("quality-inspection")]
        public async Task<IActionResult> Inspect([FromBody] InspectionCreateDto dto)
        {
            var inspection = new QualityInspection
            {
                InspectionId = Guid.NewGuid(),
                InspectionNumber = $"QC-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
                GRNId = dto.GRNId,
                GRNLineId = dto.GRNLineId,
                ItemId = dto.ItemId,
                LotNumber = dto.LotNumber,
                SerialNumber = dto.SerialNumber,
                InspectedAt = DateTime.UtcNow,
                InspectionType = dto.InspectionType,
                SampleQty = dto.SampleQty,
                PassQty = dto.PassQty,
                FailQty = dto.FailQty,
                HoldQty = dto.HoldQty,
                Result = dto.Result,
                FailureReason = dto.FailureReason,
                InspectionNotes = dto.InspectionNotes,
                AttachmentUrl = dto.AttachmentUrl
            };

            await _context.QualityInspections.AddAsync(inspection);

            var grnLine = await _context.GrnLines.FindAsync(dto.GRNLineId);
            if (grnLine != null)
            {
                grnLine.AcceptedQty = dto.PassQty;
                grnLine.RejectedQty = dto.FailQty;
                grnLine.InspectionStatus = dto.Result; // Passed, Failed, Hold
            }

            await _context.SaveChangesAsync();
            return Ok(inspection);
        }

        // Confirm GRN and trigger putaway slotting
        [HttpPost("grn/{id}/confirm")]
        public async Task<IActionResult> ConfirmGRN(Guid id)
        {
            var grn = await _context.Grns
                .Include(g => g.Lines)
                .Include(g => g.PurchaseOrder)
                .FirstOrDefaultAsync(g => g.GRNId == id);

            if (grn == null) return NotFound("GRN not found");
            if (grn.Status == "Closed") return BadRequest("GRN already closed and put away");

            // Locate source warehouse
            Guid warehouseId = grn.PurchaseOrder?.WarehouseId ?? Guid.Empty;
            if (warehouseId == Guid.Empty)
            {
                return BadRequest("Warehouse mapping not found for GRN");
            }

            // Find current dock bin where stock was received
            var dockBin = await _context.Bins
                .FirstOrDefaultAsync(b => b.IsActive && b.Shelf!.Rack!.ZoneId == grn.DockZoneId);

            if (dockBin == null)
            {
                return BadRequest("Dock bin not configured");
            }

            foreach (var line in grn.Lines)
            {
                // Run putaway slotting algorithm to find best destination bin
                var bestBinId = await _putawayService.FindBestBinAsync(
                    warehouseId: warehouseId,
                    itemId: line.ItemId,
                    qty: line.AcceptedQty > 0 ? line.AcceptedQty : line.ReceivedQty,
                    projectId: grn.PurchaseOrder?.PRId.HasValue == true ? _context.PurchaseRequisitions.Find(grn.PurchaseOrder.PRId.Value)?.ProjectId : null,
                    stageCode: null
                );

                if (bestBinId.HasValue)
                {
                    // Move the accepted stock from Dock to Storage Bin
                    await _inventoryService.MoveStockAsync(
                        warehouseId: warehouseId,
                        sourceBinId: dockBin.BinId,
                        destBinId: bestBinId.Value,
                        itemId: line.ItemId,
                        qty: line.AcceptedQty > 0 ? line.AcceptedQty : line.ReceivedQty,
                        lotNumber: line.LotNumber,
                        serialNumber: null,
                        projectId: null,
                        stageCode: null,
                        movementType: "Putaway",
                        referenceType: "GRNLine",
                        referenceId: line.GRNLineId,
                        userId: null,
                        remarks: $"Putaway auto-slotted from dock to bin"
                    );
                }

                // If rejected quantity exists, move to quarantine zone bin if configured
                if (line.RejectedQty > 0)
                {
                    var quarantineBin = await _context.Bins
                        .FirstOrDefaultAsync(b => b.IsActive && b.Shelf!.Rack!.Zone!.ZoneType == "Quarantine" && b.Shelf.Rack.Zone.WarehouseId == warehouseId);

                    if (quarantineBin != null)
                    {
                        await _inventoryService.MoveStockAsync(
                            warehouseId: warehouseId,
                            sourceBinId: dockBin.BinId,
                            destBinId: quarantineBin.BinId,
                            itemId: line.ItemId,
                            qty: line.RejectedQty,
                            lotNumber: line.LotNumber,
                            serialNumber: null,
                            projectId: null,
                            stageCode: null,
                            movementType: "Putaway",
                            referenceType: "GRNLine",
                            referenceId: line.GRNLineId,
                            userId: null,
                            remarks: $"Moved rejected stock to quarantine bin {quarantineBin.BinCode}"
                        );
                    }
                }
            }

            grn.Status = "Closed";
            await _context.SaveChangesAsync();

            return Ok(new { message = "GRN confirmed, putaway tasks executed successfully" });
        }
    }
}
