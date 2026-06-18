using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("purchaserequisitions", Schema = "wms")]
    public class PurchaseRequisition
    {
        [Key]
        [Column("prid")]
        public Guid PRId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(30)]
        [Column("prnumber")]
        public string PRNumber { get; set; } = string.Empty;

        [Column("requestedbyid")]
        public Guid? RequestedById { get; set; }

        [ForeignKey(nameof(RequestedById))]
        public virtual User? RequestedBy { get; set; }

        [Column("departmentid")]
        public Guid? DepartmentId { get; set; }

        [Column("projectid")]
        public Guid? ProjectId { get; set; }

        [ForeignKey(nameof(ProjectId))]
        public virtual Project? Project { get; set; }

        [Required]
        [MaxLength(10)]
        [Column("priority")]
        public string Priority { get; set; } = "Medium"; // Low, Medium, High, Critical

        [Column("requiredbydate")]
        public DateTime? RequiredByDate { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Draft"; // Draft, Pending Approval, Approved, Rejected, Ordered

        [Column("approvallevel")]
        public short ApprovalLevel { get; set; } = 0;

        [Column("remarks")]
        public string? Remarks { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<PrLine> Lines { get; set; } = new List<PrLine>();
    }

    [Table("prlines", Schema = "wms")]
    public class PrLine
    {
        [Key]
        [Column("prlineid")]
        public Guid PRLineId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("prid")]
        public Guid PRId { get; set; }

        [ForeignKey(nameof(PRId))]
        public virtual PurchaseRequisition? PurchaseRequisition { get; set; }

        [Required]
        [Column("itemid")]
        public Guid ItemId { get; set; }

        [ForeignKey(nameof(ItemId))]
        public virtual Item? Item { get; set; }

        [Required]
        [Column("requiredqty")]
        public decimal RequiredQty { get; set; }

        [Column("approvedqty")]
        public decimal ApprovedQty { get; set; } = 0;

        [Column("estimatedunitprice")]
        public decimal? EstimatedUnitPrice { get; set; }

        [Column("justification")]
        public string? Justification { get; set; }
    }

    [Table("purchaseorders", Schema = "wms")]
    public class PurchaseOrder
    {
        [Key]
        [Column("poid")]
        public Guid POId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(30)]
        [Column("ponumber")]
        public string PONumber { get; set; } = string.Empty;

        [Column("prid")]
        public Guid? PRId { get; set; }

        [ForeignKey(nameof(PRId))]
        public virtual PurchaseRequisition? PurchaseRequisition { get; set; }

        [Required]
        [Column("vendorid")]
        public Guid VendorId { get; set; }

        [ForeignKey(nameof(VendorId))]
        public virtual Vendor? Vendor { get; set; }

        [Required]
        [Column("warehouseid")]
        public Guid WarehouseId { get; set; }

        [ForeignKey(nameof(WarehouseId))]
        public virtual Warehouse? Warehouse { get; set; }

        [Required]
        [Column("podate")]
        public DateTime PODate { get; set; } = DateTime.UtcNow;

        [Column("expecteddeliverydate")]
        public DateTime? ExpectedDeliveryDate { get; set; }

        [MaxLength(50)]
        [Column("paymentterms")]
        public string? PaymentTerms { get; set; }

        [MaxLength(3)]
        [Column("currencycode")]
        public string CurrencyCode { get; set; } = "INR";

        [Column("subtotal")]
        public decimal SubTotal { get; set; } = 0;

        [Column("taxamount")]
        public decimal TaxAmount { get; set; } = 0;

        [Column("totalamount")]
        public decimal TotalAmount { get; set; } = 0;

        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Draft"; // Draft, Confirmed, PartialReceived, FullReceived, Cancelled

        [Column("approvedbyid")]
        public Guid? ApprovedById { get; set; }

        [ForeignKey(nameof(ApprovedById))]
        public virtual User? ApprovedBy { get; set; }

        [Column("approvedat")]
        public DateTime? ApprovedAt { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<PoLine> Lines { get; set; } = new List<PoLine>();
    }

    [Table("polines", Schema = "wms")]
    public class PoLine
    {
        [Key]
        [Column("polineid")]
        public Guid POLineId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("poid")]
        public Guid POId { get; set; }

        [ForeignKey(nameof(POId))]
        public virtual PurchaseOrder? PurchaseOrder { get; set; }

        [Required]
        [Column("itemid")]
        public Guid ItemId { get; set; }

        [ForeignKey(nameof(ItemId))]
        public virtual Item? Item { get; set; }

        [Required]
        [Column("orderedqty")]
        public decimal OrderedQty { get; set; }

        [Column("receivedqty")]
        public decimal ReceivedQty { get; set; } = 0;

        [Required]
        [Column("unitprice")]
        public decimal UnitPrice { get; set; }

        [Column("discountpct")]
        public decimal DiscountPct { get; set; } = 0;

        [Column("taxpct")]
        public decimal TaxPct { get; set; } = 18;

        [Required]
        [Column("linetotal")]
        public decimal LineTotal { get; set; }

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("grns", Schema = "wms")]
    public class Grn
    {
        [Key]
        [Column("grnid")]
        public Guid GRNId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(30)]
        [Column("grnnumber")]
        public string GRNNumber { get; set; } = string.Empty;

        [Column("poid")]
        public Guid? POId { get; set; }

        [ForeignKey(nameof(POId))]
        public virtual PurchaseOrder? PurchaseOrder { get; set; }

        [Required]
        [Column("vendorid")]
        public Guid VendorId { get; set; }

        [ForeignKey(nameof(VendorId))]
        public virtual Vendor? Vendor { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("receipttype")]
        public string ReceiptType { get; set; } = "PO"; // PO, DirectReceipt, Return

        [MaxLength(50)]
        [Column("invoicenumber")]
        public string? InvoiceNumber { get; set; }

        [Column("invoicedate")]
        public DateTime? InvoiceDate { get; set; }

        [MaxLength(20)]
        [Column("vehiclenumber")]
        public string? VehicleNumber { get; set; }

        [Column("receivedbyid")]
        public Guid? ReceivedById { get; set; }

        [ForeignKey(nameof(ReceivedById))]
        public virtual User? ReceivedBy { get; set; }

        [Column("receivedat")]
        public DateTime ReceivedAt { get; set; } = DateTime.UtcNow;

        [Column("dockzoneid")]
        public Guid? DockZoneId { get; set; }

        [ForeignKey(nameof(DockZoneId))]
        public virtual Zone? DockZone { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("status")]
        public string Status { get; set; } = "Draft"; // Draft, Received, Inspected, Closed

        public virtual ICollection<GrnLine> Lines { get; set; } = new List<GrnLine>();
    }

    [Table("grnlines", Schema = "wms")]
    public class GrnLine
    {
        [Key]
        [Column("grnlineid")]
        public Guid GRNLineId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("grnid")]
        public Guid GRNId { get; set; }

        [ForeignKey(nameof(GRNId))]
        public virtual Grn? Grn { get; set; }

        [Column("polineid")]
        public Guid? POLineId { get; set; }

        [ForeignKey(nameof(POLineId))]
        public virtual PoLine? PoLine { get; set; }

        [Required]
        [Column("itemid")]
        public Guid ItemId { get; set; }

        [ForeignKey(nameof(ItemId))]
        public virtual Item? Item { get; set; }

        [MaxLength(50)]
        [Column("lotnumber")]
        public string? LotNumber { get; set; }

        [Column("expirydate")]
        public DateTime? ExpiryDate { get; set; }

        [Required]
        [Column("receivedqty")]
        public decimal ReceivedQty { get; set; }

        [Column("acceptedqty")]
        public decimal AcceptedQty { get; set; } = 0;

        [Column("rejectedqty")]
        public decimal RejectedQty { get; set; } = 0;

        [Required]
        [MaxLength(20)]
        [Column("inspectionstatus")]
        public string InspectionStatus { get; set; } = "Pending"; // Pending, Passed, Failed, Hold
    }

    [Table("qualityinspections", Schema = "wms")]
    public class QualityInspection
    {
        [Key]
        [Column("inspectionid")]
        public Guid InspectionId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(30)]
        [Column("inspectionnumber")]
        public string InspectionNumber { get; set; } = string.Empty;

        [Required]
        [Column("grnid")]
        public Guid GRNId { get; set; }

        [ForeignKey(nameof(GRNId))]
        public virtual Grn? Grn { get; set; }

        [Required]
        [Column("grnlineid")]
        public Guid GRNLineId { get; set; }

        [ForeignKey(nameof(GRNLineId))]
        public virtual GrnLine? GrnLine { get; set; }

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

        [Column("inspectorid")]
        public Guid? InspectorId { get; set; }

        [ForeignKey(nameof(InspectorId))]
        public virtual User? Inspector { get; set; }

        [Column("inspectedat")]
        public DateTime InspectedAt { get; set; } = DateTime.UtcNow;

        [MaxLength(20)]
        [Column("inspectiontype")]
        public string InspectionType { get; set; } = "Visual"; // Visual, Functional, Dimensional

        [Required]
        [Column("sampleqty")]
        public decimal SampleQty { get; set; }

        [Required]
        [Column("passqty")]
        public decimal PassQty { get; set; }

        [Required]
        [Column("failqty")]
        public decimal FailQty { get; set; }

        [Required]
        [Column("holdqty")]
        public decimal HoldQty { get; set; }

        [Required]
        [MaxLength(20)]
        [Column("result")]
        public string Result { get; set; } = "Pending"; // Pending, Passed, Failed, Hold

        [Column("failurereason")]
        public string? FailureReason { get; set; }

        [Column("inspectionnotes")]
        public string? InspectionNotes { get; set; }

        [MaxLength(500)]
        [Column("attachmenturl")]
        public string? AttachmentUrl { get; set; }
    }
}
