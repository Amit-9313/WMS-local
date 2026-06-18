using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.DTOs;
using WarehouseAPI.Models;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackController : ControllerBase
    {
        private readonly WarehouseDbContext _context;

        public PackController(WarehouseDbContext context)
        {
            _context = context;
        }

        // Get packages
        [HttpGet]
        public async Task<IActionResult> GetPackages([FromQuery] Guid? projectId, [FromQuery] string? status)
        {
            var query = _context.Packages
                .Include(p => p.Project)
                .AsQueryable();

            if (projectId.HasValue) query = query.Where(p => p.ProjectId == projectId);
            if (!string.IsNullOrEmpty(status)) query = query.Where(p => p.Status == status);

            var packages = await query.ToListAsync();
            return Ok(packages);
        }

        // Create Package
        [HttpPost]
        public async Task<IActionResult> CreatePackage([FromBody] PackageCreateDto dto)
        {
            var package = new Package
            {
                PackageId = Guid.NewGuid(),
                PackageNumber = $"PKG-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
                ProjectId = dto.ProjectId,
                StageCode = dto.StageCode,
                PackedAt = DateTime.UtcNow,
                Status = "Open",
                WeightKg = dto.WeightKg,
                LengthCm = dto.LengthCm,
                WidthCm = dto.WidthCm,
                HeightCm = dto.HeightCm,
                LabelTemplate = dto.LabelTemplate
            };

            await _context.Packages.AddAsync(package);

            foreach (var line in dto.Lines)
            {
                var packageLine = new PackageLine
                {
                    PackageLineId = Guid.NewGuid(),
                    PackageId = package.PackageId,
                    PickTaskId = line.PickTaskId,
                    ItemId = line.ItemId,
                    LotNumber = line.LotNumber,
                    SerialNumber = line.SerialNumber,
                    PackedQty = line.PackedQty
                };

                await _context.PackageLines.AddAsync(packageLine);

                // Update BOM Line packed quantity
                if (line.PickTaskId.HasValue)
                {
                    var pickTask = await _context.PickTasks
                        .Include(t => t.BomLine)
                        .FirstOrDefaultAsync(t => t.PickTaskId == line.PickTaskId.Value);

                    if (pickTask != null && pickTask.BomLine != null)
                    {
                        pickTask.BomLine.PackedQty += line.PackedQty;
                    }
                }
            }

            package.Status = "Sealed"; // Seal the package on creation for simplicity
            package.BarcodeUrl = $"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={package.PackageNumber}";

            await _context.SaveChangesAsync();
            return Ok(package);
        }
    }
}
