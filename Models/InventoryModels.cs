using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("stockledger", Schema = "wms")]
    public class StockLedger
    {
        [Key]
        [Column("stockid")]
        public Guid StockId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("warehouseid")]
        public Guid WarehouseId { get; set; }

        [ForeignKey(nameof(WarehouseId))]
        public virtual Warehouse? Warehouse { get; set; }

        [Required]
        [Column("binid")]
        public Guid BinId { get; set; }

        [ForeignKey(nameof(BinId))]
        public virtual Bin? Bin { get; set; }

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

        [Column("projectid")]
        public Guid? ProjectId { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public virtual Project? Project { get; set; }

        [MaxLength(5)]
        [Column("stagecode")]
        public string? StageCode { get; set; } // 1, 2T, 3, 4

        [Required]
        [Column("onhandqty")]
        public decimal OnHandQty { get; set; } = 0;

        [Required]
        [Column("reservedqty")]
        public decimal ReservedQty { get; set; } = 0;

        [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
        [Column("availableqty")]
        public decimal AvailableQty { get; private set; }

        [Required]
        [Column("damagedqty")]
        public decimal DamagedQty { get; set; } = 0;

        [Required]
        [Column("blockedqty")]
        public decimal BlockedQty { get; set; } = 0;

        [Required]
        [Column("intransitqty")]
        public decimal InTransitQty { get; set; } = 0;

        [Column("lastmovementat")]
        public DateTime LastMovementAt { get; set; } = DateTime.UtcNow;

        [MaxLength(30)]
        [Column("lastmovementtype")]
        public string? LastMovementType { get; set; }

        [Required]
        [Column("valuationcost")]
        public decimal ValuationCost { get; set; } = 0;
    }

    [Table("stockmovements", Schema = "wms")]
    public class StockMovement
    {
        [Key]
        [Column("movementid")]
        public Guid MovementId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(30)]
        [Column("transactionnumber")]
        public string TransactionNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("movementtype")]
        public string MovementType { get; set; } = string.Empty; // Receiving, Putaway, Picking, Packing, Shipping, Transfer, Adjustment, Cycle Count, Return

        [Required]
        [MaxLength(20)]
        [Column("referencetype")]
        public string ReferenceType { get; set; } = string.Empty; // GRN, PO, PickTask, Shipment

        [Required]
        [Column("referenceid")]
        public Guid ReferenceId { get; set; }

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

        [Column("projectid")]
        public Guid? ProjectId { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public virtual Project? Project { get; set; }

        [MaxLength(5)]
        [Column("stagecode")]
        public string? StageCode { get; set; }

        [Column("sourcebinid")]
        public Guid? SourceBinId { get; set; }

        [ForeignKey(nameof(SourceBinId))]
        public virtual Bin? SourceBin { get; set; }

        [Column("destinationbinid")]
        public Guid? DestinationBinId { get; set; }

        [ForeignKey(nameof(DestinationBinId))]
        public virtual Bin? DestinationBin { get; set; }

        [Required]
        [Column("qty")]
        public decimal Qty { get; set; }

        [Column("uomid")]
        public Guid? UomId { get; set; }

        [ForeignKey(nameof(UomId))]
        public virtual Uom? Uom { get; set; }

        [Column("performedbyid")]
        public Guid? PerformedById { get; set; }

        [ForeignKey(nameof(PerformedById))]
        public virtual User? PerformedBy { get; set; }

        [Column("performedat")]
        public DateTime PerformedAt { get; set; } = DateTime.UtcNow;

        [Column("remarks")]
        public string? Remarks { get; set; }

        [MaxLength(45)]
        [Column("ipaddress")]
        public string? IPAddress { get; set; }
    }
}
