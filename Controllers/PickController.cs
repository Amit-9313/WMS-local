using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.DTOs;
using WarehouseAPI.Services;

namespace WarehouseAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PickController : ControllerBase
    {
        private readonly WarehouseDbContext _context;
        private readonly IPickingService _pickingService;

        public PickController(WarehouseDbContext context, IPickingService pickingService)
        {
            _context = context;
            _pickingService = pickingService;
        }

        // Get waves list
        [HttpGet("waves")]
        public async Task<IActionResult> GetWaves()
        {
            var waves = await _context.PickWaves
                .Include(w => w.Project)
                .Include(w => w.CreatedBy)
                .ToListAsync();
            return Ok(waves);
        }

        // Create Pick Wave
        [HttpPost("waves")]
        public async Task<IActionResult> CreateWave([FromBody] PickWaveCreateDto dto)
        {
            var wave = await _pickingService.CreateWaveAsync(
                waveType: dto.WaveType,
                projectId: dto.ProjectId,
                stageCode: dto.StageCode,
                userId: null // Set to current logged user in production JWT context
            );

            if (wave == null)
            {
                return BadRequest("No pick tasks could be created. Stock might be unavailable or BOM stage is already picked.");
            }

            return Ok(wave);
        }

        // Get pick tasks
        [HttpGet("tasks")]
        public async Task<IActionResult> GetTasks([FromQuery] Guid? waveId, [FromQuery] string? status)
        {
            var query = _context.PickTasks
                .Include(t => t.Item)
                .Include(t => t.SourceBin)
                .Include(t => t.PickWave)
                .AsQueryable();

            if (waveId.HasValue) query = query.Where(t => t.WaveId == waveId);
            if (!string.IsNullOrEmpty(status)) query = query.Where(t => t.Status == status);

            var tasks = await query.OrderBy(t => t.SequenceNo).ToListAsync();
            return Ok(tasks);
        }

        // Confirm pick task
        [HttpPost("tasks/{id}/confirm")]
        public async Task<IActionResult> ConfirmPick(Guid id, [FromBody] PickConfirmDto dto)
        {
            var success = await _pickingService.ConfirmPickAsync(
                pickTaskId: id,
                pickedQty: dto.PickedQty,
                serialNumber: dto.SerialNumber,
                lotNumber: dto.LotNumber,
                stagingBinId: dto.StagingBinId,
                userId: null // set from JWT Context
            );

            if (!success)
            {
                return BadRequest("Pick confirmation failed. Ensure parameters and stock are valid.");
            }

            return Ok(new { message = "Pick task confirmed successfully" });
        }
    }
}
