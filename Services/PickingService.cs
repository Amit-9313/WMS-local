using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Models;

namespace WarehouseAPI.Services
{
    public class PickingService : IPickingService
    {
        private readonly WarehouseDbContext _context;
        private readonly IInventoryService _inventoryService;

        public PickingService(WarehouseDbContext context, IInventoryService inventoryService)
        {
            _context = context;
            _inventoryService = inventoryService;
        }

        public async Task<PickWave?> CreateWaveAsync(string waveType, Guid? projectId, string? stageCode, Guid? userId)
        {
            // Create the Wave Header
            var wave = new PickWave
            {
                WaveId = Guid.NewGuid(),
                WaveNumber = $"WAVE-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..6].ToUpper()}",
                WaveType = waveType,
                ProjectId = projectId,
                StageCode = stageCode,
                CreatedById = userId,
                Status = "Pending",
                CreatedAt = DateTime.UtcNow
            };

            await _context.PickWaves.AddAsync(wave);

            int sequence = 1;
            int totalLines = 0;

            if (waveType == "Project" && projectId.HasValue)
            {
                // Retrieve all BOM lines for this project stage
                var activeBom = await _context.Boms
                    .Include(b => b.Lines)
                    .FirstOrDefaultAsync(b => b.ProjectId == projectId && b.Status == "Active");

                if (activeBom != null)
                {
                    var linesToPick = activeBom.Lines
                        .Where(l => l.StageCode == stageCode && l.RequiredQty > l.PickedQty)
                        .ToList();

                    foreach (var line in linesToPick)
                    {
                        decimal neededQty = line.RequiredQty - line.PickedQty;

                        // Find stock matching ItemId and ProjectId (allocated stock) or unallocated stock
                        var availableStock = await _context.StockLedger
                            .Where(s => s.ItemId == line.ItemId &&
                                        s.OnHandQty - s.ReservedQty > 0 &&
                                        (s.ProjectId == projectId || s.ProjectId == null))
                            .OrderByDescending(s => s.ProjectId) // Prefer project-allocated stock
                            .ThenBy(s => s.LastMovementAt) // FIFO
                            .ToListAsync();

                        foreach (var stock in availableStock)
                        {
                            if (neededQty <= 0) break;

                            decimal availableQty = stock.OnHandQty - stock.ReservedQty;
                            decimal allocatedQty = Math.Min(neededQty, availableQty);

                            // Reserve stock
                            stock.ReservedQty += allocatedQty;
                            neededQty -= allocatedQty;

                            // Create pick task
                            var pickTask = new PickTask
                            {
                                PickTaskId = Guid.NewGuid(),
                                WaveId = wave.WaveId,
                                BOMLineId = line.BOMLineId,
                                ItemId = line.ItemId,
                                SourceBinId = stock.BinId,
                                RequestedQty = allocatedQty,
                                Status = "Pending",
                                SequenceNo = sequence++,
                                LotNumber = stock.LotNumber,
                                SerialNumber = stock.SerialNumber
                            };

                            await _context.PickTasks.AddAsync(pickTask);
                            totalLines++;

                            // Update BOM line allocated quantity
                            line.AllocatedQty += allocatedQty;
                        }
                    }
                }
            }

            if (totalLines == 0)
            {
                // No pick tasks generated
                return null;
            }

            wave.TotalLines = totalLines;
            wave.Status = "Released";
            wave.ReleasedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return wave;
        }

        public async Task<bool> ConfirmPickAsync(Guid pickTaskId, decimal pickedQty, string? serialNumber, string? lotNumber, Guid? stagingBinId, Guid? userId)
        {
            var task = await _context.PickTasks
                .Include(t => t.PickWave)
                .Include(t => t.BomLine)
                .FirstOrDefaultAsync(t => t.PickTaskId == pickTaskId);

            if (task == null || task.Status == "Completed" || task.Status == "Short")
            {
                return false;
            }

            task.PickedQty = pickedQty;
            task.ShortQty = task.RequestedQty - pickedQty;
            task.CompletedAt = DateTime.UtcNow;
            task.AssignedToId = userId;

            // Resolve staging bin
            Guid destBinId;
            if (stagingBinId.HasValue)
            {
                destBinId = stagingBinId.Value;
            }
            else
            {
                // Fallback: Find a bin in Staging zone
                var stagingBin = await _context.Bins
                    .Include(b => b.Shelf).ThenInclude(s => s.Rack).ThenInclude(r => r.Zone)
                    .FirstOrDefaultAsync(b => b.IsActive && b.Shelf!.Rack!.Zone!.ZoneType == "Staging");

                if (stagingBin == null)
                {
                    return false; // Staging bin required
                }
                destBinId = stagingBin.BinId;
            }

            task.StagingBinId = destBinId;

            // Deduct stock reservation
            var sourceStock = await _context.StockLedger
                .FirstOrDefaultAsync(s => s.BinId == task.SourceBinId &&
                                         s.ItemId == task.ItemId &&
                                         s.LotNumber == task.LotNumber &&
                                         s.SerialNumber == task.SerialNumber);

            if (sourceStock != null)
            {
                // Decrease reservation
                sourceStock.ReservedQty -= task.RequestedQty;
                if (sourceStock.ReservedQty < 0) sourceStock.ReservedQty = 0;
            }

            // Move stock from Source Bin to Staging Bin
            var moveResult = await _inventoryService.MoveStockAsync(
                warehouseId: sourceStock?.WarehouseId ?? Guid.Empty,
                sourceBinId: task.SourceBinId,
                destBinId: destBinId,
                itemId: task.ItemId,
                qty: pickedQty,
                lotNumber: lotNumber ?? task.LotNumber,
                serialNumber: serialNumber ?? task.SerialNumber,
                projectId: task.PickWave?.ProjectId,
                stageCode: task.PickWave?.StageCode,
                movementType: "Picking",
                referenceType: "PickTask",
                referenceId: task.PickTaskId,
                userId: userId,
                remarks: $"Picked for Wave {task.PickWave?.WaveNumber}"
            );

            // Update BOM line quantities
            if (task.BomLine != null)
            {
                task.BomLine.AllocatedQty -= task.RequestedQty;
                if (task.BomLine.AllocatedQty < 0) task.BomLine.AllocatedQty = 0;
                task.BomLine.PickedQty += pickedQty;
            }

            // Update Task and Wave Status
            task.Status = task.ShortQty > 0 ? "Short" : "Completed";

            var wave = task.PickWave;
            if (wave != null)
            {
                var waveTasks = await _context.PickTasks.Where(t => t.WaveId == wave.WaveId).ToListAsync();
                if (waveTasks.All(t => t.Status == "Completed" || t.Status == "Short" || t.Status == "Exception"))
                {
                    wave.Status = waveTasks.Any(t => t.Status == "Short") ? "Short" : "Completed";
                    wave.CompletedAt = DateTime.UtcNow;
                    wave.CompletedLines = waveTasks.Count(t => t.Status == "Completed");
                    wave.ShortLines = waveTasks.Count(t => t.Status == "Short");
                }
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}
