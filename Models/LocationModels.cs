using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("companies", Schema = "wms")]
    public class Company
    {
        [Key]
        [Column("companyid")]
        public Guid CompanyId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(200)]
        [Column("companyname")]
        public string CompanyName { get; set; } = string.Empty;

        [MaxLength(20)]
        [Column("gstnumber")]
        public string? GSTNumber { get; set; }

        [MaxLength(20)]
        [Column("pannumber")]
        public string? PANNumber { get; set; }

        [Column("address")]
        public string? Address { get; set; }

        [MaxLength(20)]
        [Column("phone")]
        public string? Phone { get; set; }

        [MaxLength(100)]
        [Column("email")]
        public string? Email { get; set; }

        [MaxLength(500)]
        [Column("logo")]
        public string? Logo { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Branch> Branches { get; set; } = new List<Branch>();
    }

    [Table("branches", Schema = "wms")]
    public class Branch
    {
        [Key]
        [Column("branchid")]
        public Guid BranchId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("companyid")]
        public Guid CompanyId { get; set; }

        [ForeignKey(nameof(CompanyId))]
        public virtual Company? Company { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("branchname")]
        public string BranchName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("branchcode")]
        public string BranchCode { get; set; } = string.Empty;

        [Column("address")]
        public string? Address { get; set; }

        [Column("isheadoffice")]
        public bool IsHeadOffice { get; set; } = false;

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Warehouse> Warehouses { get; set; } = new List<Warehouse>();
    }

    [Table("warehouses", Schema = "wms")]
    public class Warehouse
    {
        [Key]
        [Column("warehouseid")]
        public Guid WarehouseId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("branchid")]
        public Guid BranchId { get; set; }

        [ForeignKey(nameof(BranchId))]
        public virtual Branch? Branch { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("warehousecode")]
        public string WarehouseCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        [Column("warehousename")]
        public string WarehouseName { get; set; } = string.Empty;

        [Column("address")]
        public string? Address { get; set; }

        [Column("latitude")]
        public decimal? Latitude { get; set; }

        [Column("longitude")]
        public decimal? Longitude { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("timezone")]
        public string Timezone { get; set; } = "Asia/Kolkata";

        [Column("totalareasqft")]
        public decimal? TotalAreaSqFt { get; set; }

        [Column("defaultdockzoneid")]
        public Guid? DefaultDockZoneId { get; set; }

        [ForeignKey(nameof(DefaultDockZoneId))]
        public virtual Zone? DefaultDockZone { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Zone> Zones { get; set; } = new List<Zone>();
    }

    [Table("zones", Schema = "wms")]
    public class Zone
    {
        [Key]
        [Column("zoneid")]
        public Guid ZoneId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("warehouseid")]
        public Guid WarehouseId { get; set; }

        [ForeignKey(nameof(WarehouseId))]
        public virtual Warehouse? Warehouse { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("zonecode")]
        public string ZoneCode { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("zonename")]
        public string? ZoneName { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("zonetype")]
        public string ZoneType { get; set; } = string.Empty; // Storage, Dock, Staging, Quarantine

        [MaxLength(10)]
        [Column("stageassignment")]
        public string? StageAssignment { get; set; } // 1, 2T, 3, 4

        [MaxLength(7)]
        [Column("colorhex")]
        public string ColorHex { get; set; } = "#CCCCCC";

        [Column("positionx")]
        public decimal? PositionX { get; set; }

        [Column("positiony")]
        public decimal? PositionY { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Rack> Racks { get; set; } = new List<Rack>();
    }

    [Table("racks", Schema = "wms")]
    public class Rack
    {
        [Key]
        [Column("rackid")]
        public Guid RackId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("zoneid")]
        public Guid ZoneId { get; set; }

        [ForeignKey(nameof(ZoneId))]
        public virtual Zone? Zone { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("rackcode")]
        public string RackCode { get; set; } = string.Empty;

        [Column("positionx")]
        public decimal? PositionX { get; set; }

        [Column("positiony")]
        public decimal? PositionY { get; set; }

        [Column("positionz")]
        public decimal? PositionZ { get; set; }

        [Required]
        [Column("length")]
        public decimal Length { get; set; }

        [Required]
        [Column("width")]
        public decimal Width { get; set; }

        [Required]
        [Column("height")]
        public decimal Height { get; set; }

        [Required]
        [Column("orientation")]
        public string Orientation { get; set; } = "N"; // N, S, E, W

        [Required]
        [Column("levelcount")]
        public int LevelCount { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Shelf> Shelves { get; set; } = new List<Shelf>();
    }

    [Table("shelves", Schema = "wms")]
    public class Shelf
    {
        [Key]
        [Column("shelfid")]
        public Guid ShelfId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("rackid")]
        public Guid RackId { get; set; }

        [ForeignKey(nameof(RackId))]
        public virtual Rack? Rack { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("shelfcode")]
        public string ShelfCode { get; set; } = string.Empty;

        [Required]
        [Column("levelindex")]
        public int LevelIndex { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }

        public virtual ICollection<Bin> Bins { get; set; } = new List<Bin>();
    }

    [Table("bins", Schema = "wms")]
    public class Bin
    {
        [Key]
        [Column("binid")]
        public Guid BinId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("shelfid")]
        public Guid ShelfId { get; set; }

        [ForeignKey(nameof(ShelfId))]
        public virtual Shelf? Shelf { get; set; }

        [Required]
        [MaxLength(50)]
        [Column("bincode")]
        public string BinCode { get; set; } = string.Empty;

        [Required]
        [Column("capacityweightkg")]
        public decimal CapacityWeightKg { get; set; }

        [Required]
        [Column("capacityvolumel")]
        public decimal CapacityVolumeL { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("mixrule")]
        public string MixRule { get; set; } = "Multi"; // Single, Multi, ProjectStage

        [Column("isfrozen")]
        public bool IsFrozen { get; set; } = false;

        [MaxLength(500)]
        [Column("barcodeurl")]
        public string? BarcodeUrl { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }
    }
}
