using System;
using System.Threading.Tasks;
using WarehouseAPI.Models;

namespace WarehouseAPI.Services
{
    public interface IInventoryService
    {
        Task<StockLedger> AddStockAsync(
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
            string? remarks = null);

        Task<StockLedger?> MoveStockAsync(
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
            string? remarks = null);

        Task<StockLedger?> AdjustStockAsync(
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
            string? remarks = null);
    }
}
