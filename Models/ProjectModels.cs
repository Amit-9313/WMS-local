using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("projects", Schema = "wms")]
    public class Project
    {
        [Key]
        [Column("projectid")]
        public Guid ProjectId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(30)]
        [Column("projectcode")]
        public string ProjectCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        [Column("projectname")]
        public string ProjectName { get; set; } = string.Empty;

        [Column("customerid")]
        public Guid? CustomerId { get; set; }

        [ForeignKey(nameof(CustomerId))]
        public virtual Customer? Customer { get; set; }

        [Column("siteaddress")]
        public string? SiteAddress { get; set; }

        [Column("projectmanagerid")]
        public Guid? ProjectManagerId { get; set; }

        [ForeignKey(nameof(ProjectManagerId))]
        public virtual User? ProjectManager { get; set; }

        [Column("startdate")]
        public DateTime? StartDate { get; set; }

        [Column("enddate")]
        public DateTime? EndDate { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Planned"; // Planned, Active, On Hold, Completed, Cancelled

        [Column("totalbomvalue")]
        public decimal TotalBOMValue { get; set; } = 0;

        [Column("completionpct")]
        public decimal CompletionPct { get; set; } = 0;

        [Column("warehouseid")]
        public Guid? WarehouseId { get; set; }

        [ForeignKey(nameof(WarehouseId))]
        public virtual Warehouse? Warehouse { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<ProjectStage> Stages { get; set; } = new List<ProjectStage>();
    }

    [Table("projectstages", Schema = "wms")]
    public class ProjectStage
    {
        [Key]
        [Column("stageid")]
        public Guid StageId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("projectid")]
        public Guid ProjectId { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public virtual Project? Project { get; set; }

        [Required]
        [MaxLength(5)]
        [Column("stagecode")]
        public string StageCode { get; set; } = string.Empty; // 1, 2T, 3, 4

        [Required]
        [MaxLength(50)]
        [Column("stagename")]
        public string StageName { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Not Started"; // Not Started, In Progress, Completed, Delayed

        [Column("plannedstartdate")]
        public DateTime? PlannedStartDate { get; set; }

        [Column("plannedenddate")]
        public DateTime? PlannedEndDate { get; set; }

        [Column("actualstartdate")]
        public DateTime? ActualStartDate { get; set; }

        [Column("actualenddate")]
        public DateTime? ActualEndDate { get; set; }

        [Column("completionpct")]
        public decimal CompletionPct { get; set; } = 0;
    }

    [Table("boms", Schema = "wms")]
    public class Bom
    {
        [Key]
        [Column("bomid")]
        public Guid BOMId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("projectid")]
        public Guid ProjectId { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public virtual Project? Project { get; set; }

        [Column("importedbyid")]
        public Guid? ImportedById { get; set; }

        [ForeignKey(nameof(ImportedById))]
        public virtual User? ImportedBy { get; set; }

        [Column("importedat")]
        public DateTime ImportedAt { get; set; } = DateTime.UtcNow;

        [Column("version")]
        public short Version { get; set; } = 1;

        [MaxLength(200)]
        [Column("filename")]
        public string? FileName { get; set; }

        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Draft"; // Draft, Active, Superseded

        public virtual ICollection<BomLine> Lines { get; set; } = new List<BomLine>();
    }

    [Table("bomlines", Schema = "wms")]
    public class BomLine
    {
        [Key]
        [Column("bomlineid")]
        public Guid BOMLineId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("bomid")]
        public Guid BOMId { get; set; }

        [ForeignKey(nameof(BOMId))]
        public virtual Bom? Bom { get; set; }

        [Required]
        [Column("itemid")]
        public Guid ItemId { get; set; }

        [ForeignKey(nameof(ItemId))]
        public virtual Item? Item { get; set; }

        [Required]
        [MaxLength(5)]
        [Column("stagecode")]
        public string StageCode { get; set; } = string.Empty; // 1, 2T, 3, 4

        [Required]
        [Column("requiredqty")]
        public decimal RequiredQty { get; set; }

        [Column("allocatedqty")]
        public decimal AllocatedQty { get; set; } = 0;

        [Column("pickedqty")]
        public decimal PickedQty { get; set; } = 0;

        [Column("packedqty")]
        public decimal PackedQty { get; set; } = 0;

        [Column("substituteitemids")]
        public Guid[]? SubstituteItemIds { get; set; }

        [Column("remarks")]
        public string? Remarks { get; set; }
    }
}
