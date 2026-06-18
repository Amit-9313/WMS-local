using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("pickwaves", Schema = "wms")]
    public class PickWave
    {
        [Key]
        [Column("waveid")]
        public Guid WaveId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(30)]
        [Column("wavenumber")]
        public string WaveNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("wavetype")]
        public string WaveType { get; set; } = "Project"; // Project, Spares

        [Column("projectid")]
        public Guid? ProjectId { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public virtual Project? Project { get; set; }

        [MaxLength(5)]
        [Column("stagecode")]
        public string? StageCode { get; set; }

        [Column("createdbyid")]
        public Guid? CreatedById { get; set; }

        [ForeignKey(nameof(CreatedById))]
        public virtual User? CreatedBy { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Pending"; // Pending, Released, In Progress, Completed, Short

        [Column("autorouteoptimized")]
        public bool AutoRouteOptimized { get; set; } = false;

        [Column("totallines")]
        public int TotalLines { get; set; } = 0;

        [Column("completedlines")]
        public int CompletedLines { get; set; } = 0;

        [Column("shortlines")]
        public int ShortLines { get; set; } = 0;

        [Column("releasedat")]
        public DateTime? ReleasedAt { get; set; }

        [Column("completedat")]
        public DateTime? CompletedAt { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<PickTask> PickTasks { get; set; } = new List<PickTask>();
    }

    [Table("picktasks", Schema = "wms")]
    public class PickTask
    {
        [Key]
        [Column("picktaskid")]
        public Guid PickTaskId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("waveid")]
        public Guid WaveId { get; set; }

        [ForeignKey(nameof(WaveId))]
        public virtual PickWave? PickWave { get; set; }

        [Column("bomlineid")]
        public Guid? BOMLineId { get; set; }

        [ForeignKey(nameof(BOMLineId))]
        public virtual BomLine? BomLine { get; set; }

        [Required]
        [Column("itemid")]
        public Guid ItemId { get; set; }

        [ForeignKey(nameof(ItemId))]
        public virtual Item? Item { get; set; }

        [Required]
        [Column("sourcebinid")]
        public Guid SourceBinId { get; set; }

        [ForeignKey(nameof(SourceBinId))]
        public virtual Bin? SourceBin { get; set; }

        [Required]
        [Column("requestedqty")]
        public decimal RequestedQty { get; set; }

        [Column("pickedqty")]
        public decimal PickedQty { get; set; } = 0;

        [Column("shortqty")]
        public decimal ShortQty { get; set; } = 0;

        [Column("assignedtoid")]
        public Guid? AssignedToId { get; set; }

        [ForeignKey(nameof(AssignedToId))]
        public virtual User? AssignedTo { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Pending"; // Pending, In Progress, Completed, Short, Exception

        [Column("startedat")]
        public DateTime? StartedAt { get; set; }

        [Column("completedat")]
        public DateTime? CompletedAt { get; set; }

        [MaxLength(50)]
        [Column("lotnumber")]
        public string? LotNumber { get; set; }

        [MaxLength(100)]
        [Column("serialnumber")]
        public string? SerialNumber { get; set; }

        [Column("stagingbinid")]
        public Guid? StagingBinId { get; set; }

        [ForeignKey(nameof(StagingBinId))]
        public virtual Bin? StagingBin { get; set; }

        [Column("exceptionreason")]
        public string? ExceptionReason { get; set; }

        [Column("sequenceno")]
        public int SequenceNo { get; set; } = 1;
    }

    [Table("packages", Schema = "wms")]
    public class Package
    {
        [Key]
        [Column("packageid")]
        public Guid PackageId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(30)]
        [Column("packagenumber")]
        public string PackageNumber { get; set; } = string.Empty;

        [Column("projectid")]
        public Guid? ProjectId { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public virtual Project? Project { get; set; }

        [MaxLength(5)]
        [Column("stagecode")]
        public string? StageCode { get; set; }

        [Column("packedbyid")]
        public Guid? PackedById { get; set; }

        [ForeignKey(nameof(PackedById))]
        public virtual User? PackedBy { get; set; }

        [Column("packedat")]
        public DateTime PackedAt { get; set; } = DateTime.UtcNow;

        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Open"; // Open, Sealed, Dispatched

        [Column("weightkg")]
        public decimal? WeightKg { get; set; }

        [Column("lengthcm")]
        public decimal? LengthCm { get; set; }

        [Column("widthcm")]
        public decimal? WidthCm { get; set; }

        [Column("heightcm")]
        public decimal? HeightCm { get; set; }

        [MaxLength(500)]
        [Column("barcodeurl")]
        public string? BarcodeUrl { get; set; }

        [MaxLength(50)]
        [Column("labeltemplate")]
        public string? LabelTemplate { get; set; }

        [Column("printedat")]
        public DateTime? PrintedAt { get; set; }

        public virtual ICollection<PackageLine> Lines { get; set; } = new List<PackageLine>();
    }

    [Table("packagelines", Schema = "wms")]
    public class PackageLine
    {
        [Key]
        [Column("packagelineid")]
        public Guid PackageLineId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("packageid")]
        public Guid PackageId { get; set; }

        [ForeignKey(nameof(PackageId))]
        public virtual Package? Package { get; set; }

        [Column("picktaskid")]
        public Guid? PickTaskId { get; set; }

        [ForeignKey(nameof(PickTaskId))]
        public virtual PickTask? PickTask { get; set; }

        [Required]
        [Column("itemid")]
        public Guid ItemId { get; set; }

        [ForeignKey(nameof(ItemId))]
        public virtual Item? Item { get; set; }

        [MaxLength(50)]
        [Column("lotnumber")]
        public string? LotNumber { get; set; }

        [MaxLength(100)]
        [Column("serialnumber")]
        public string? SerialNumber { get; set; }

        [Required]
        [Column("packedqty")]
        public decimal PackedQty { get; set; }
    }
}
