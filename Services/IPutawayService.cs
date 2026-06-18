using System;
using System.Threading.Tasks;

namespace WarehouseAPI.Services
{
    public interface IPutawayService
    {
        Task<Guid?> FindBestBinAsync(Guid warehouseId, Guid itemId, decimal qty, Guid? projectId, string? stageCode);
    }
}
