using System;
using System.Threading.Tasks;
using WarehouseAPI.Models;

namespace WarehouseAPI.Services
{
    public interface IPickingService
    {
        Task<PickWave?> CreateWaveAsync(string waveType, Guid? projectId, string? stageCode, Guid? userId);
        Task<bool> ConfirmPickAsync(Guid pickTaskId, decimal pickedQty, string? serialNumber, string? lotNumber, Guid? stagingBinId, Guid? userId);
    }
}
