using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Models;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WarehouseController : ControllerBase
    {
        private readonly WarehouseDbContext _context;

        public WarehouseController(WarehouseDbContext context)
        {
            _context = context;
        }

        // Warehouse CRUD
        [HttpGet]
        public async Task<IActionResult> GetWarehouses()
        {
            var warehouses = await _context.Warehouses.ToListAsync();
            return Ok(warehouses);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWarehouse(Guid id)
        {
            var warehouse = await _context.Warehouses
                .Include(w => w.Zones)
                .FirstOrDefaultAsync(w => w.WarehouseId == id);

            if (warehouse == null) return NotFound();
            return Ok(warehouse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateWarehouse([FromBody] Warehouse warehouse)
        {
            warehouse.WarehouseId = Guid.NewGuid();
            warehouse.CreatedAt = DateTime.UtcNow;
            await _context.Warehouses.AddAsync(warehouse);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetWarehouse), new { id = warehouse.WarehouseId }, warehouse);
        }

        // Zones
        [HttpGet("{warehouseId}/zones")]
        public async Task<IActionResult> GetZones(Guid warehouseId)
        {
            var zones = await _context.Zones.Where(z => z.WarehouseId == warehouseId).ToListAsync();
            return Ok(zones);
        }

        [HttpPost("{warehouseId}/zones")]
        public async Task<IActionResult> CreateZone(Guid warehouseId, [FromBody] Zone zone)
        {
            zone.ZoneId = Guid.NewGuid();
            zone.WarehouseId = warehouseId;
            zone.CreatedAt = DateTime.UtcNow;
            await _context.Zones.AddAsync(zone);
            await _context.SaveChangesAsync();
            return Ok(zone);
        }

        // Racks
        [HttpGet("zones/{zoneId}/racks")]
        public async Task<IActionResult> GetRacks(Guid zoneId)
        {
            var racks = await _context.Racks.Where(r => r.ZoneId == zoneId).ToListAsync();
            return Ok(racks);
        }

        [HttpPost("zones/{zoneId}/racks")]
        public async Task<IActionResult> CreateRack(Guid zoneId, [FromBody] Rack rack)
        {
            rack.RackId = Guid.NewGuid();
            rack.ZoneId = zoneId;
            rack.CreatedAt = DateTime.UtcNow;
            await _context.Racks.AddAsync(rack);
            await _context.SaveChangesAsync();
            return Ok(rack);
        }

        // Shelves
        [HttpGet("racks/{rackId}/shelves")]
        public async Task<IActionResult> GetShelves(Guid rackId)
        {
            var shelves = await _context.Shelves.Where(s => s.RackId == rackId).ToListAsync();
            return Ok(shelves);
        }

        [HttpPost("racks/{rackId}/shelves")]
        public async Task<IActionResult> CreateShelf(Guid rackId, [FromBody] Shelf shelf)
        {
            shelf.ShelfId = Guid.NewGuid();
            shelf.RackId = rackId;
            shelf.CreatedAt = DateTime.UtcNow;
            await _context.Shelves.AddAsync(shelf);
            await _context.SaveChangesAsync();
            return Ok(shelf);
        }

        // Bins
        [HttpGet("shelves/{shelfId}/bins")]
        public async Task<IActionResult> GetBins(Guid shelfId)
        {
            var bins = await _context.Bins.Where(b => b.ShelfId == shelfId).ToListAsync();
            return Ok(bins);
        }

        [HttpPost("shelves/{shelfId}/bins")]
        public async Task<IActionResult> CreateBin(Guid shelfId, [FromBody] Bin bin)
        {
            bin.BinId = Guid.NewGuid();
            bin.ShelfId = shelfId;
            bin.CreatedAt = DateTime.UtcNow;
            await _context.Bins.AddAsync(bin);
            await _context.SaveChangesAsync();
            return Ok(bin);
        }
    }
}
