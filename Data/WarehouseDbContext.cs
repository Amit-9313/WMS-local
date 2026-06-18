using Microsoft.EntityFrameworkCore;
using WarehouseAPI.Models;

namespace WarehouseAPI.Data
{
    public class WarehouseDbContext : DbContext
    {
        public WarehouseDbContext(DbContextOptions<WarehouseDbContext> options) : base(options)
        {
        }

        // Auth
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<UserRole> UserRoles { get; set; } = null!;

        // Locations
        public DbSet<Company> Companies { get; set; } = null!;
        public DbSet<Branch> Branches { get; set; } = null!;
        public DbSet<Warehouse> Warehouses { get; set; } = null!;
        public DbSet<Zone> Zones { get; set; } = null!;
        public DbSet<Rack> Racks { get; set; } = null!;
        public DbSet<Shelf> Shelves { get; set; } = null!;
        public DbSet<Bin> Bins { get; set; } = null!;

        // Master Data
        public DbSet<Category> Categories { get; set; } = null!;
        public DbSet<SubCategory> SubCategories { get; set; } = null!;
        public DbSet<Manufacturer> Manufacturers { get; set; } = null!;
        public DbSet<Uom> Uoms { get; set; } = null!;
        public DbSet<Item> Items { get; set; } = null!;
        public DbSet<Vendor> Vendors { get; set; } = null!;
        public DbSet<Customer> Customers { get; set; } = null!;

        // Projects
        public DbSet<Project> Projects { get; set; } = null!;
        public DbSet<ProjectStage> ProjectStages { get; set; } = null!;
        public DbSet<Bom> Boms { get; set; } = null!;
        public DbSet<BomLine> BomLines { get; set; } = null!;

        // Purchase & Receiving
        public DbSet<PurchaseRequisition> PurchaseRequisitions { get; set; } = null!;
        public DbSet<PrLine> PrLines { get; set; } = null!;
        public DbSet<PurchaseOrder> PurchaseOrders { get; set; } = null!;
        public DbSet<PoLine> PoLines { get; set; } = null!;
        public DbSet<Grn> Grns { get; set; } = null!;
        public DbSet<GrnLine> GrnLines { get; set; } = null!;
        public DbSet<QualityInspection> QualityInspections { get; set; } = null!;

        // Inventory
        public DbSet<StockLedger> StockLedger { get; set; } = null!;
        public DbSet<StockMovement> StockMovements { get; set; } = null!;

        // Picking & Packing
        public DbSet<PickWave> PickWaves { get; set; } = null!;
        public DbSet<PickTask> PickTasks { get; set; } = null!;
        public DbSet<Package> Packages { get; set; } = null!;
        public DbSet<PackageLine> PackageLines { get; set; } = null!;

        // Shipping
        public DbSet<Shipment> Shipments { get; set; } = null!;
        public DbSet<ShipmentPackage> ShipmentPackages { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Set default schema
            modelBuilder.HasDefaultSchema("wms");

            // Configure Composite / Unique Keys
            modelBuilder.Entity<UserRole>()
                .HasIndex(ur => new { ur.UserId, ur.RoleId })
                .IsUnique();

            modelBuilder.Entity<Zone>()
                .HasIndex(z => new { z.WarehouseId, z.ZoneCode })
                .IsUnique();

            modelBuilder.Entity<ProjectStage>()
                .HasIndex(ps => new { ps.ProjectId, ps.StageCode })
                .IsUnique();

            modelBuilder.Entity<StockLedger>()
                .HasIndex(s => new { s.WarehouseId, s.BinId, s.ItemId, s.LotNumber, s.SerialNumber, s.ProjectId })
                .IsUnique()
                .HasDatabaseName("unique_stock");

            modelBuilder.Entity<ShipmentPackage>()
                .HasIndex(sp => new { sp.ShipmentId, sp.PackageId })
                .IsUnique();

            // Self-referencing default dock zone on Warehouse
            modelBuilder.Entity<Warehouse>()
                .HasOne(w => w.DefaultDockZone)
                .WithMany()
                .HasForeignKey(w => w.DefaultDockZoneId)
                .OnDelete(DeleteBehavior.SetNull);

            // Cascade rules adjustment if necessary to prevent multiple cascade paths in EF Core
            modelBuilder.Entity<Branch>()
                .HasOne(b => b.Company)
                .WithMany(c => c.Branches)
                .HasForeignKey(b => b.CompanyId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Warehouse>()
                .HasOne(w => w.Branch)
                .WithMany(b => b.Warehouses)
                .HasForeignKey(w => w.BranchId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Zone>()
                .HasOne(z => z.Warehouse)
                .WithMany(w => w.Zones)
                .HasForeignKey(z => z.WarehouseId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Rack>()
                .HasOne(r => r.Zone)
                .WithMany(z => z.Racks)
                .HasForeignKey(r => r.ZoneId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Shelf>()
                .HasOne(s => s.Rack)
                .WithMany(r => r.Shelves)
                .HasForeignKey(s => s.RackId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Bin>()
                .HasOne(b => b.Shelf)
                .WithMany(s => s.Bins)
                .HasForeignKey(b => b.ShelfId)
                .OnDelete(DeleteBehavior.Cascade);

            // Handle decimal precision configurations
            foreach (var property in modelBuilder.Model.GetEntityTypes().SelectMany(t => t.GetProperties()))
            {
                if (property.ClrType == typeof(decimal) || property.ClrType == typeof(decimal?))
                {
                    property.SetColumnType("numeric(18,4)");
                }
            }
        }
    }
}
