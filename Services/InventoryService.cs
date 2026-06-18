using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Models;

namespace WarehouseAPI.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly WarehouseDbContext _context;

        public InventoryService(WarehouseDbContext context)
        {
            _context = context;
        }

        public async Task<StockLedger> AddStockAsync(
            Guid warehouseId,
            Guid binId,
            Guid itemId,
            decimal qty,
            string? lotNumber,
            string? serialNumber,
            Guid? projectId,
            string? stageCode,
            string movementType,
            string referenceType,
            Guid referenceId,
            Guid? userId,
            decimal cost,
            string? remarks = null)
        {
            var stock = await _context.StockLedger
                .FirstOrDefaultAsync(s => s.WarehouseId == warehouseId &&
                                         s.BinId == binId &&
                                         s.ItemId == itemId &&
                                         s.LotNumber == lotNumber &&
                                         s.SerialNumber == serialNumber &&
                                         s.ProjectId == projectId);

            if (stock == null)
            {
                stock = new StockLedger
                {
                    StockId = Guid.NewGuid(),
                    WarehouseId = warehouseId,
                    BinId = binId,
                    ItemId = itemId,
                    LotNumber = lotNumber,
                    SerialNumber = serialNumber,
                    ProjectId = projectId,
                    StageCode = stageCode,
                    OnHandQty = qty,
                    ReservedQty = 0,
                    DamagedQty = 0,
                    BlockedQty = 0,
                    InTransitQty = 0,
                    LastMovementAt = DateTime.UtcNow,
                    LastMovementType = movementType,
                    ValuationCost = cost
                };
                await _context.StockLedger.AddAsync(stock);
            }
            else
            {
                stock.OnHandQty += qty;
                stock.LastMovementAt = DateTime.UtcNow;
                stock.LastMovementType = movementType;
                if (cost > 0)
                {
                    stock.ValuationCost = cost;
                }
            }

            // Log stock movement
            var movement = new StockMovement
            {
                MovementId = Guid.NewGuid(),
                TransactionNumber = $"TXN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}",
                MovementType = movementType,
                ReferenceType = referenceType,
                ReferenceId = referenceId,
                ItemId = itemId,
                LotNumber = lotNumber,
                SerialNumber = serialNumber,
                ProjectId = projectId,
                StageCode = stageCode,
                SourceBinId = null,
                DestinationBinId = binId,
                Qty = qty,
                PerformedById = userId,
                PerformedAt = DateTime.UtcNow,
                Remarks = remarks
            };
            await _context.StockMovements.AddAsync(movement);
            await _context.SaveChangesAsync();

            return stock;
        }

        public async Task<StockLedger?> MoveStockAsync(
            Guid warehouseId,
            Guid sourceBinId,
            Guid destBinId,
            Guid itemId,
            decimal qty,
            string? lotNumber,
            string? serialNumber,
            Guid? projectId,
            string? stageCode,
            string movementType,
            string referenceType,
            Guid referenceId,
            Guid? userId,
            string? remarks = null)
        {
            // Deduct from source bin
            var sourceStock = await _context.StockLedger
                .FirstOrDefaultAsync(s => s.WarehouseId == warehouseId &&
                                         s.BinId == sourceBinId &&
                                         s.ItemId == itemId &&
                                         s.LotNumber == lotNumber &&
                                         s.SerialNumber == serialNumber &&
                                         s.ProjectId == projectId);

            if (sourceStock == null || sourceStock.OnHandQty < qty)
            {
                return null; // Insufficient stock at source
            }

            sourceStock.OnHandQty -= qty;
            sourceStock.LastMovementAt = DateTime.UtcNow;
            sourceStock.LastMovementType = movementType;

            // Remove stock ledger record if on hand qty is 0 to keep the ledger clean
            if (sourceStock.OnHandQty <= 0 && sourceStock.ReservedQty <= 0 && sourceStock.DamagedQty <= 0)
            {
                _context.StockLedger.Remove(sourceStock);
            }

            // Add to destination bin
            var destStock = await _context.StockLedger
                .FirstOrDefaultAsync(s => s.WarehouseId == warehouseId &&
                                         s.BinId == destBinId &&
                                         s.ItemId == itemId &&
                                         s.LotNumber == lotNumber &&
                                         s.SerialNumber == serialNumber &&
                                         s.ProjectId == projectId);

            if (destStock == null)
            {
                destStock = new StockLedger
                {
                    StockId = Guid.NewGuid(),
                    WarehouseId = warehouseId,
                    BinId = destBinId,
                    ItemId = itemId,
                    LotNumber = lotNumber,
                    SerialNumber = serialNumber,
                    ProjectId = projectId,
                    StageCode = stageCode,
                    OnHandQty = qty,
                    ReservedQty = 0,
                    DamagedQty = 0,
                    BlockedQty = 0,
                    InTransitQty = 0,
                    LastMovementAt = DateTime.UtcNow,
                    LastMovementType = movementType,
                    ValuationCost = sourceStock.ValuationCost
                };
                await _context.StockLedger.AddAsync(destStock);
            }
            else
            {
                destStock.OnHandQty += qty;
                destStock.LastMovementAt = DateTime.UtcNow;
                destStock.LastMovementType = movementType;
            }

            // Log stock movement
            var movement = new StockMovement
            {
                MovementId = Guid.NewGuid(),
                TransactionNumber = $"TXN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}",
                MovementType = movementType,
                ReferenceType = referenceType,
                ReferenceId = referenceId,
                ItemId = itemId,
                LotNumber = lotNumber,
                SerialNumber = serialNumber,
                ProjectId = projectId,
                StageCode = stageCode,
                SourceBinId = sourceBinId,
                DestinationBinId = destBinId,
                Qty = qty,
                PerformedById = userId,
                PerformedAt = DateTime.UtcNow,
                Remarks = remarks
            };
            await _context.StockMovements.AddAsync(movement);
            await _context.SaveChangesAsync();

            return destStock;
        }

        public async Task<StockLedger?> AdjustStockAsync(
            Guid warehouseId,
            Guid binId,
            Guid itemId,
            decimal qty,
            string? lotNumber,
            string? serialNumber,
            Guid? projectId,
            string? stageCode,
            string movementType,
            string referenceType,
            Guid referenceId,
            Guid? userId,
            string? remarks = null)
        {
            var stock = await _context.StockLedger
                .FirstOrDefaultAsync(s => s.WarehouseId == warehouseId &&
                                         s.BinId == binId &&
                                         s.ItemId == itemId &&
                                         s.LotNumber == lotNumber &&
                                         s.SerialNumber == serialNumber &&
                                         s.ProjectId == projectId);

            if (stock == null)
            {
                if (qty < 0) return null; // Cannot adjust negative stock if it doesn't exist

                stock = new StockLedger
                {
                    StockId = Guid.NewGuid(),
                    WarehouseId = warehouseId,
                    BinId = binId,
                    ItemId = itemId,
                    LotNumber = lotNumber,
                    SerialNumber = serialNumber,
                    ProjectId = projectId,
                    StageCode = stageCode,
                    OnHandQty = qty,
                    ReservedQty = 0,
                    DamagedQty = 0,
                    BlockedQty = 0,
                    InTransitQty = 0,
                    LastMovementAt = DateTime.UtcNow,
                    LastMovementType = movementType,
                    ValuationCost = 0
                };
                await _context.StockLedger.AddAsync(stock);
            }
            else
            {
                stock.OnHandQty += qty; // If qty is negative, it will subtract properly
                stock.LastMovementAt = DateTime.UtcNow;
                stock.LastMovementType = movementType;

                if (stock.OnHandQty < 0)
                {
                    stock.OnHandQty = 0; // Prevent negative stock
                }

                if (stock.OnHandQty <= 0 && stock.ReservedQty <= 0 && stock.DamagedQty <= 0)
                {
                    _context.StockLedger.Remove(stock);
                }
            }

            // Log stock movement
            var movement = new StockMovement
            {
                MovementId = Guid.NewGuid(),
                TransactionNumber = $"TXN-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8].ToUpper()}",
                MovementType = movementType,
                ReferenceType = referenceType,
                ReferenceId = referenceId,
                ItemId = itemId,
                LotNumber = lotNumber,
                SerialNumber = serialNumber,
                ProjectId = projectId,
                StageCode = stageCode,
                SourceBinId = qty < 0 ? binId : null,
                DestinationBinId = qty > 0 ? binId : null,
                Qty = Math.Abs(qty),
                PerformedById = userId,
                PerformedAt = DateTime.UtcNow,
                Remarks = remarks
            };
            await _context.StockMovements.AddAsync(movement);
            await _context.SaveChangesAsync();

            return stock;
        }
    }
}
