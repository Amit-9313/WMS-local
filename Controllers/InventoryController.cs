using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Models;
using WarehouseAPI.Services;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly WarehouseDbContext _context;
        private readonly IInventoryService _inventoryService;

        public InventoryController(WarehouseDbContext context, IInventoryService inventoryService)
        {
            _context = context;
            _inventoryService = inventoryService;
        }

        // Search stock with filters
        [HttpGet]
        public async Task<IActionResult> GetStock(
            [FromQuery] Guid? warehouseId,
            [FromQuery] Guid? zoneId,
            [FromQuery] Guid? binId,
            [FromQuery] Guid? itemId,
            [FromQuery] string? lotNumber,
            [FromQuery] Guid? projectId)
        {
            var query = _context.StockLedger
                .Include(s => s.Warehouse)
                .Include(s => s.Bin)
                .Include(s => s.Item)
                .Include(s => s.Project)
                .AsQueryable();

            if (warehouseId.HasValue) query = query.Where(s => s.WarehouseId == warehouseId);
            if (zoneId.HasValue) query = query.Where(s => s.Bin!.Shelf!.Rack!.ZoneId == zoneId);
            if (binId.HasValue) query = query.Where(s => s.BinId == binId);
            if (itemId.HasValue) query = query.Where(s => s.ItemId == itemId);
            if (!string.IsNullOrEmpty(lotNumber)) query = query.Where(s => s.LotNumber == lotNumber);
            if (projectId.HasValue) query = query.Where(s => s.ProjectId == projectId);

            var stock = await query.ToListAsync();
            return Ok(stock);
        }

        // Bin-to-bin movement
        [HttpPost("move")]
        public async Task<IActionResult> MoveStock(
            [FromQuery] Guid warehouseId,
            [FromQuery] Guid sourceBinId,
            [FromQuery] Guid destBinId,
            [FromQuery] Guid itemId,
            [FromQuery] decimal qty,
            [FromQuery] string? lotNumber,
            [FromQuery] Guid? projectId,
            [FromQuery] string? remarks)
        {
            var result = await _inventoryService.MoveStockAsync(
                warehouseId: warehouseId,
                sourceBinId: sourceBinId,
                destBinId: destBinId,
                itemId: itemId,
                qty: qty,
                lotNumber: lotNumber,
                serialNumber: null,
                projectId: projectId,
                stageCode: null,
                movementType: "Transfer",
                referenceType: "Manual",
                referenceId: Guid.NewGuid(),
                userId: null,
                remarks: remarks ?? "Manual bin to bin movement"
            );

            if (result == null)
            {
                return BadRequest("Movement failed. Check stock availability or parameters.");
            }

            return Ok(result);
        }

        // Manual adjustment
        [HttpPost("adjust")]
        public async Task<IActionResult> AdjustStock(
            [FromQuery] Guid warehouseId,
            [FromQuery] Guid binId,
            [FromQuery] Guid itemId,
            [FromQuery] decimal qty,
            [FromQuery] string? lotNumber,
            [FromQuery] Guid? projectId,
            [FromQuery] string? remarks)
        {
            var result = await _inventoryService.AdjustStockAsync(
                warehouseId: warehouseId,
                binId: binId,
                itemId: itemId,
                qty: qty,
                lotNumber: lotNumber,
                serialNumber: null,
                projectId: projectId,
                stageCode: null,
                movementType: "Adjustment",
                referenceType: "Manual",
                referenceId: Guid.NewGuid(),
                userId: null,
                remarks: remarks ?? "Manual adjustment"
            );

            if (result == null)
            {
                return BadRequest("Adjustment failed.");
            }

            return Ok(result);
        }

        // Movements log
        [HttpGet("movements")]
        public async Task<IActionResult> GetMovements([FromQuery] Guid? itemId, [FromQuery] string? movementType)
        {
            var query = _context.StockMovements
                .Include(m => m.Item)
                .Include(m => m.SourceBin)
                .Include(m => m.DestinationBin)
                .AsQueryable();

            if (itemId.HasValue) query = query.Where(m => m.ItemId == itemId);
            if (!string.IsNullOrEmpty(movementType)) query = query.Where(m => m.MovementType == movementType);

            var movements = await query.OrderByDescending(m => m.PerformedAt).ToListAsync();
            return Ok(movements);
        }
    }
}
