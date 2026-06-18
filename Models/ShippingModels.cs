using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("shipments", Schema = "wms")]
    public class Shipment
    {
        [Key]
        [Column("shipmentid")]
        public Guid ShipmentId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(30)]
        [Column("shipmentnumber")]
        public string ShipmentNumber { get; set; } = string.Empty;

        [Required]
        [MaxLength(20)]
        [Column("shipmenttype")]
        public string ShipmentType { get; set; } = "Outbound"; // Outbound, Transfer, Return

        [Column("projectid")]
        public Guid? ProjectId { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public virtual Project? Project { get; set; }

        [Column("customerid")]
        public Guid? CustomerId { get; set; }

        [ForeignKey(nameof(CustomerId))]
        public virtual Customer? Customer { get; set; }

        [Required]
        [Column("sourcewarehouseid")]
        public Guid SourceWarehouseId { get; set; }

        [ForeignKey(nameof(SourceWarehouseId))]
        public virtual Warehouse? SourceWarehouse { get; set; }

        [Required]
        [Column("deliveryaddress")]
        public string DeliveryAddress { get; set; } = string.Empty;

        [Required]
        [Column("shipmentdate")]
        public DateTime ShipmentDate { get; set; } = DateTime.UtcNow;

        [Column("deliverydate")]
        public DateTime? DeliveryDate { get; set; }

        [MaxLength(20)]
        [Column("vehiclenumber")]
        public string? VehicleNumber { get; set; }

        [MaxLength(100)]
        [Column("drivername")]
        public string? DriverName { get; set; }

        [MaxLength(20)]
        [Column("drivermobile")]
        public string? DriverMobile { get; set; }

        [MaxLength(20)]
        [Column("transportmode")]
        public string? TransportMode { get; set; } // Road, Rail, Air, Sea, Courier

        [MaxLength(100)]
        [Column("couriername")]
        public string? CourierName { get; set; }

        [MaxLength(50)]
        [Column("lrnumber")]
        public string? LRNumber { get; set; }

        [MaxLength(50)]
        [Column("ewaybillnumber")]
        public string? EWayBillNumber { get; set; }

        [Column("ewaybillexpiry")]
        public DateTime? EWayBillExpiry { get; set; }

        [Column("totalpackages")]
        public int TotalPackages { get; set; } = 0;

        [Column("totalweightkg")]
        public decimal? TotalWeightKg { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Draft"; // Draft, Ready, Dispatched, In Transit, Delivered, Returned

        [Column("dispatchedbyid")]
        public Guid? DispatchedById { get; set; }

        [ForeignKey(nameof(DispatchedById))]
        public virtual User? DispatchedBy { get; set; }

        [Column("dispatchedat")]
        public DateTime? DispatchedAt { get; set; }

        [MaxLength(500)]
        [Column("pod")]
        public string? POD { get; set; } // Proof of delivery URL

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<ShipmentPackage> ShipmentPackages { get; set; } = new List<ShipmentPackage>();
    }

    [Table("shipmentpackages", Schema = "wms")]
    public class ShipmentPackage
    {
        [Key]
        [Column("shipmentpackageid")]
        public Guid ShipmentPackageId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("shipmentid")]
        public Guid ShipmentId { get; set; }

        [ForeignKey(nameof(ShipmentId))]
        public virtual Shipment? Shipment { get; set; }

        [Required]
        [Column("packageid")]
        public Guid PackageId { get; set; }

        [ForeignKey(nameof(PackageId))]
        public virtual Package? Package { get; set; }
    }
}
