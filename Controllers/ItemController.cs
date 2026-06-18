using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Models;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly WarehouseDbContext _context;

        public ItemController(WarehouseDbContext context)
        {
            _context = context;
        }

        // Items CRUD
        [HttpGet]
        public async Task<IActionResult> GetItems()
        {
            var items = await _context.Items
                .Include(i => i.Category)
                .Include(i => i.Uom)
                .ToListAsync();
            return Ok(items);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetItem(Guid id)
        {
            var item = await _context.Items
                .Include(i => i.Category)
                .Include(i => i.SubCategory)
                .Include(i => i.Manufacturer)
                .Include(i => i.Uom)
                .FirstOrDefaultAsync(i => i.ItemId == id);

            if (item == null) return NotFound();
            return Ok(item);
        }

        [HttpPost]
        public async Task<IActionResult> CreateItem([FromBody] Item item)
        {
            item.ItemId = Guid.NewGuid();
            item.CreatedAt = DateTime.UtcNow;
            await _context.Items.AddAsync(item);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetItem), new { id = item.ItemId }, item);
        }

        // Categories CRUD
        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories.ToListAsync();
            return Ok(categories);
        }

        [HttpPost("categories")]
        public async Task<IActionResult> CreateCategory([FromBody] Category category)
        {
            category.CategoryId = Guid.NewGuid();
            category.CreatedAt = DateTime.UtcNow;
            await _context.Categories.AddAsync(category);
            await _context.SaveChangesAsync();
            return Ok(category);
        }

        // UOMs CRUD
        [HttpGet("uoms")]
        public async Task<IActionResult> GetUoms()
        {
            var uoms = await _context.Uoms.ToListAsync();
            return Ok(uoms);
        }

        [HttpPost("uoms")]
        public async Task<IActionResult> CreateUom([FromBody] Uom uom)
        {
            uom.UomId = Guid.NewGuid();
            await _context.Uoms.AddAsync(uom);
            await _context.SaveChangesAsync();
            return Ok(uom);
        }

        // Vendors CRUD
        [HttpGet("vendors")]
        public async Task<IActionResult> GetVendors()
        {
            var vendors = await _context.Vendors.ToListAsync();
            return Ok(vendors);
        }

        [HttpGet("vendors/{id}")]
        public async Task<IActionResult> GetVendor(Guid id)
        {
            var vendor = await _context.Vendors.FindAsync(id);
            if (vendor == null) return NotFound();
            return Ok(vendor);
        }

        [HttpPost("vendors")]
        public async Task<IActionResult> CreateVendor([FromBody] Vendor vendor)
        {
            vendor.VendorId = Guid.NewGuid();
            vendor.CreatedAt = DateTime.UtcNow;
            await _context.Vendors.AddAsync(vendor);
            await _context.SaveChangesAsync();
            return Ok(vendor);
        }

        // Customers CRUD
        [HttpGet("customers")]
        public async Task<IActionResult> GetCustomers()
        {
            var customers = await _context.Customers.ToListAsync();
            return Ok(customers);
        }

        [HttpGet("customers/{id}")]
        public async Task<IActionResult> GetCustomer(Guid id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null) return NotFound();
            return Ok(customer);
        }

        [HttpPost("customers")]
        public async Task<IActionResult> CreateCustomer([FromBody] Customer customer)
        {
            customer.CustomerId = Guid.NewGuid();
            customer.CreatedAt = DateTime.UtcNow;
            await _context.Customers.AddAsync(customer);
            await _context.SaveChangesAsync();
            return Ok(customer);
        }
    }
}
