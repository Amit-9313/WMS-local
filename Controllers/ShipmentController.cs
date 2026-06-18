using System;
using System.Linq;
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
    public class ShipmentController : ControllerBase
    {
        private readonly WarehouseDbContext _context;
        private readonly IInventoryService _inventoryService;

        public ShipmentController(WarehouseDbContext context, IInventoryService inventoryService)
        {
            _context = context;
            _inventoryService = inventoryService;
        }

        // Get shipments
        [HttpGet]
        public async Task<IActionResult> GetShipments()
        {
            var shipments = await _context.Shipments
                .Include(s => s.Project)
                .Include(s => s.Customer)
                .Include(s => s.SourceWarehouse)
                .ToListAsync();
            return Ok(shipments);
        }

        // Create Shipment
        [HttpPost]
        public async Task<IActionResult> CreateShipment([FromBody] ShipmentCreateDto dto)
        {
            var shipment = new Shipment
            {
                ShipmentId = Guid.NewGuid(),
                ShipmentNumber = $"SHP-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
                ShipmentType = dto.ShipmentType,
                ProjectId = dto.ProjectId,
                CustomerId = dto.CustomerId,
                SourceWarehouseId = dto.SourceWarehouseId,
                DeliveryAddress = dto.DeliveryAddress,
                ShipmentDate = DateTime.UtcNow,
                VehicleNumber = dto.VehicleNumber,
                DriverName = dto.DriverName,
                DriverMobile = dto.DriverMobile,
                TransportMode = dto.TransportMode,
                CourierName = dto.CourierName,
                LRNumber = dto.LRNumber,
                EWayBillNumber = dto.EWayBillNumber,
                EWayBillExpiry = dto.EWayBillExpiry,
                Status = "Draft",
                CreatedAt = DateTime.UtcNow
            };

            await _context.Shipments.AddAsync(shipment);

            decimal totalWeight = 0;
            foreach (var packageId in dto.PackageIds)
            {
                var package = await _context.Packages.FindAsync(packageId);
                if (package != null)
                {
                    totalWeight += package.WeightKg ?? 0;

                    var shpPkg = new ShipmentPackage
                    {
                        ShipmentPackageId = Guid.NewGuid(),
                        ShipmentId = shipment.ShipmentId,
                        PackageId = packageId
                    };
                    await _context.ShipmentPackages.AddAsync(shpPkg);
                }
            }

            shipment.TotalPackages = dto.PackageIds.Count;
            shipment.TotalWeightKg = totalWeight;
            shipment.Status = "Ready";

            await _context.SaveChangesAsync();
            return Ok(shipment);
        }

        // Confirm Dispatch
        [HttpPost("{id}/dispatch")]
        public async Task<IActionResult> ConfirmDispatch(Guid id)
        {
            var shipment = await _context.Shipments
                .Include(s => s.ShipmentPackages)
                .ThenInclude(sp => sp.Package)
                .ThenInclude(p => p!.Lines)
                .FirstOrDefaultAsync(s => s.ShipmentId == id);

            if (shipment == null) return NotFound("Shipment not found");
            if (shipment.Status == "Dispatched") return BadRequest("Shipment already dispatched");

            // Dispatch packages and deduct inventory
            foreach (var shpPkg in shipment.ShipmentPackages)
            {
                var pkg = shpPkg.Package;
                if (pkg != null)
                {
                    pkg.Status = "Dispatched";

                    foreach (var line in pkg.Lines)
                    {
                        // Deduct stock from the Staging Bin (which is where the pick task moved it)
                        // Locate the pick task staging bin
                        Guid? stagingBinId = null;
                        if (line.PickTaskId.HasValue)
                        {
                            var pickTask = await _context.PickTasks.FindAsync(line.PickTaskId.Value);
                            stagingBinId = pickTask?.StagingBinId;
                        }

                        // Fallback staging bin if pick task not linked or staging bin empty
                        if (!stagingBinId.HasValue)
                        {
                            var fallbackStaging = await _context.Bins
                                .Include(b => b.Shelf).ThenInclude(s => s.Rack).ThenInclude(r => r.Zone)
                                .FirstOrDefaultAsync(b => b.IsActive && b.Shelf!.Rack!.Zone!.ZoneType == "Staging");
                            stagingBinId = fallbackStaging?.BinId;
                        }

                        if (stagingBinId.HasValue)
                        {
                            // Reduce stock from Staging Bin (outbound movement)
                            // We pass a negative quantity to AdjustStock to decrease stock
                            await _inventoryService.AdjustStockAsync(
                                warehouseId: shipment.SourceWarehouseId,
                                binId: stagingBinId.Value,
                                itemId: line.ItemId,
                                qty: -line.PackedQty,
                                lotNumber: line.LotNumber,
                                serialNumber: line.SerialNumber,
                                projectId: shipment.ProjectId,
                                stageCode: pkg.StageCode,
                                movementType: "Shipping",
                                referenceType: "Shipment",
                                referenceId: shipment.ShipmentId,
                                userId: null,
                                remarks: $"Shipped via Shipment {shipment.ShipmentNumber}"
                            );
                        }
                    }
                }
            }

            shipment.Status = "Dispatched";
            shipment.DispatchedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Shipment dispatched and stock levels decremented successfully" });
        }
    }
}
