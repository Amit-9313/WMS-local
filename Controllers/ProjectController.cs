using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Models;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProjectController : ControllerBase
    {
        private readonly WarehouseDbContext _context;

        public ProjectController(WarehouseDbContext context)
        {
            _context = context;
        }

        // Projects CRUD
        [HttpGet]
        public async Task<IActionResult> GetProjects()
        {
            var projects = await _context.Projects
                .Include(p => p.Customer)
                .Include(p => p.Warehouse)
                .ToListAsync();
            return Ok(projects);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProject(Guid id)
        {
            var project = await _context.Projects
                .Include(p => p.Customer)
                .Include(p => p.Warehouse)
                .Include(p => p.Stages)
                .FirstOrDefaultAsync(p => p.ProjectId == id);

            if (project == null) return NotFound();
            return Ok(project);
        }

        [HttpPost]
        public async Task<IActionResult> CreateProject([FromBody] Project project)
        {
            project.ProjectId = Guid.NewGuid();
            project.CreatedAt = DateTime.UtcNow;
            await _context.Projects.AddAsync(project);

            // Generate default stages: 1 (Mechanical), 2T (Electrical), 3 (Cabin Fitting), 4 (Integrated Test)
            var stages = new List<ProjectStage>
            {
                new ProjectStage { StageId = Guid.NewGuid(), ProjectId = project.ProjectId, StageCode = "1", StageName = "Mechanical", Status = "Not Started", CompletionPct = 0 },
                new ProjectStage { StageId = Guid.NewGuid(), ProjectId = project.ProjectId, StageCode = "2T", StageName = "Electrical", Status = "Not Started", CompletionPct = 0 },
                new ProjectStage { StageId = Guid.NewGuid(), ProjectId = project.ProjectId, StageCode = "3", StageName = "Cabin Fitting", Status = "Not Started", CompletionPct = 0 },
                new ProjectStage { StageId = Guid.NewGuid(), ProjectId = project.ProjectId, StageCode = "4", StageName = "Integrated Test", Status = "Not Started", CompletionPct = 0 }
            };

            await _context.ProjectStages.AddRangeAsync(stages);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProject), new { id = project.ProjectId }, project);
        }

        // BOM Import
        [HttpPost("{id}/bom/import")]
        public async Task<IActionResult> ImportBom(Guid id, IFormFile file)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound("Project not found");

            if (file == null || file.Length == 0) return BadRequest("File is empty");

            // Deactivate previous active BOMs for this project
            var oldBoms = await _context.Boms.Where(b => b.ProjectId == id && b.Status == "Active").ToListAsync();
            foreach (var oldBom in oldBoms)
            {
                oldBom.Status = "Superseded";
            }

            var bomHeader = new Bom
            {
                BOMId = Guid.NewGuid(),
                ProjectId = id,
                ImportedAt = DateTime.UtcNow,
                Version = (short)(oldBoms.Count + 1),
                FileName = file.FileName,
                Status = "Active"
            };

            await _context.Boms.AddAsync(bomHeader);

            using (var reader = new StreamReader(file.OpenReadStream()))
            {
                // Read header line
                var headerLine = await reader.ReadLineAsync();

                // Expected format: SKUCode,StageCode,RequiredQty,Remarks
                while (!reader.EndOfStream)
                {
                    var line = await reader.ReadLineAsync();
                    if (string.IsNullOrWhiteSpace(line)) continue;

                    var parts = line.Split(',');
                    if (parts.Length < 3) continue;

                    var skuCode = parts[0].Trim();
                    var stageCode = parts[1].Trim();
                    if (!decimal.TryParse(parts[2].Trim(), out decimal requiredQty)) continue;

                    var remarks = parts.Length > 3 ? parts[3].Trim() : null;

                    // Match item in master data
                    var item = await _context.Items.FirstOrDefaultAsync(i => i.SKUCode == skuCode);
                    if (item == null)
                    {
                        // Skip if item doesn't exist
                        continue;
                    }

                    var bomLine = new BomLine
                    {
                        BOMLineId = Guid.NewGuid(),
                        BOMId = bomHeader.BOMId,
                        ItemId = item.ItemId,
                        StageCode = stageCode,
                        RequiredQty = requiredQty,
                        AllocatedQty = 0,
                        PickedQty = 0,
                        PackedQty = 0,
                        Remarks = remarks
                    };

                    await _context.BomLines.AddAsync(bomLine);
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "BOM imported successfully", bomId = bomHeader.BOMId });
        }
    }
}
