using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Data;
using WarehouseAPI.Models;

namespace WarehouseAPI.Services
{
    public class PutawayService : IPutawayService
    {
        private readonly WarehouseDbContext _context;

        public PutawayService(WarehouseDbContext context)
        {
            _context = context;
        }

        public async Task<Guid?> FindBestBinAsync(Guid warehouseId, Guid itemId, decimal qty, Guid? projectId, string? stageCode)
        {
            // Get item info
            var item = await _context.Items.FindAsync(itemId);
            if (item == null) return null;

            // Calculate item requirements
            decimal itemWeight = (item.WeightKg ?? 0) * qty;
            decimal itemVolume = 0; // in Liters
            if (item.LengthMm.HasValue && item.WidthMm.HasValue && item.HeightMm.HasValue)
            {
                // mm^3 to Liters: divide by 1,000,000
                itemVolume = (item.LengthMm.Value * item.WidthMm.Value * item.HeightMm.Value) / 1000000.0m * qty;
            }

            // Retrieve all bins in the warehouse (filtering for active and 'Storage' zones)
            var bins = await _context.Bins
                .Include(b => b.Shelf)
                .ThenInclude(s => s.Rack)
                .ThenInclude(r => r.Zone)
                .Where(b => b.IsActive && !b.IsFrozen &&
                            b.Shelf!.Rack!.Zone!.WarehouseId == warehouseId &&
                            b.Shelf!.Rack!.Zone!.ZoneType == "Storage")
                .ToListAsync();

            foreach (var bin in bins)
            {
                // Get current stock ledger contents for this bin
                var stockInBin = await _context.StockLedger
                    .Include(s => s.Item)
                    .Where(s => s.BinId == bin.BinId)
                    .ToListAsync();

                // 1. Calculate current weight and volume of the bin
                decimal currentWeight = 0;
                decimal currentVolume = 0;

                foreach (var stock in stockInBin)
                {
                    currentWeight += stock.OnHandQty * (stock.Item?.WeightKg ?? 0);
                    if (stock.Item?.LengthMm != null && stock.Item.WidthMm != null && stock.Item.HeightMm != null)
                    {
                        var vol = (stock.Item.LengthMm.Value * stock.Item.WidthMm.Value * stock.Item.HeightMm.Value) / 1000000.0m;
                        currentVolume += stock.OnHandQty * vol;
                    }
                }

                // Check physical capacity
                if (currentWeight + itemWeight > bin.CapacityWeightKg) continue;
                if (currentVolume + itemVolume > bin.CapacityVolumeL) continue;

                // 2. Validate MixRule constraints
                if (bin.MixRule == "Single")
                {
                    // Only same SKU allowed
                    if (stockInBin.Count > 0 && stockInBin.Any(s => s.ItemId != itemId))
                    {
                        continue;
                    }
                }
                else if (bin.MixRule == "ProjectStage")
                {
                    // Only same Project & Stage allowed
                    if (stockInBin.Count > 0 && stockInBin.Any(s => s.ProjectId != projectId || s.StageCode != stageCode))
                    {
                        continue;
                    }
                }

                // If it passes all checks, it's a suitable bin!
                return bin.BinId;
            }

            // Fallback: If no strict Storage bin is found, try to find any staging dock bin or return null
            return null;
        }
    }
}
