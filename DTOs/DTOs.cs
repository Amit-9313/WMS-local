using System;
using System.Collections.Generic;

namespace WarehouseAPI.DTOs
{
    // Authentication DTOs
    public class LoginRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class TokenResponse
    {
        public string Token { get; set; } = string.Empty;
        public string Username { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
    }

    public class RegisterRequest
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public List<string> Roles { get; set; } = new List<string>();
    }

    // Purchase Requisition DTOs
    public class PRLineCreateDto
    {
        public Guid ItemId { get; set; }
        public decimal RequiredQty { get; set; }
        public decimal EstimatedUnitPrice { get; set; }
        public string? Justification { get; set; }
    }

    public class PRCreateDto
    {
        public Guid? ProjectId { get; set; }
        public string Priority { get; set; } = "Medium";
        public DateTime? RequiredByDate { get; set; }
        public string? Remarks { get; set; }
        public List<PRLineCreateDto> Lines { get; set; } = new List<PRLineCreateDto>();
    }

    // Purchase Order DTOs
    public class POLineCreateDto
    {
        public Guid ItemId { get; set; }
        public decimal OrderedQty { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal DiscountPct { get; set; }
        public decimal TaxPct { get; set; }
    }

    public class POCreateDto
    {
        public Guid? PRId { get; set; }
        public Guid VendorId { get; set; }
        public Guid WarehouseId { get; set; }
        public DateTime? ExpectedDeliveryDate { get; set; }
        public string? PaymentTerms { get; set; }
        public string CurrencyCode { get; set; } = "INR";
        public List<POLineCreateDto> Lines { get; set; } = new List<POLineCreateDto>();
    }

    // Goods Receipt Note DTOs
    public class GRNLineCreateDto
    {
        public Guid? POLineId { get; set; }
        public Guid ItemId { get; set; }
        public string? LotNumber { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public decimal ReceivedQty { get; set; }
    }

    public class GRNCreateDto
    {
        public Guid? POId { get; set; }
        public Guid VendorId { get; set; }
        public string ReceiptType { get; set; } = "PO";
        public string? InvoiceNumber { get; set; }
        public DateTime? InvoiceDate { get; set; }
        public string? VehicleNumber { get; set; }
        public Guid? DockZoneId { get; set; }
        public List<GRNLineCreateDto> Lines { get; set; } = new List<GRNLineCreateDto>();
    }

    // Quality Inspection DTOs
    public class InspectionCreateDto
    {
        public Guid GRNId { get; set; }
        public Guid GRNLineId { get; set; }
        public Guid ItemId { get; set; }
        public string? LotNumber { get; set; }
        public string? SerialNumber { get; set; }
        public string InspectionType { get; set; } = "Visual";
        public decimal SampleQty { get; set; }
        public decimal PassQty { get; set; }
        public decimal FailQty { get; set; }
        public decimal HoldQty { get; set; }
        public string Result { get; set; } = "Passed"; // Passed, Failed, Hold
        public string? FailureReason { get; set; }
        public string? InspectionNotes { get; set; }
        public string? AttachmentUrl { get; set; }
    }

    // Pick Wave & Confirmation DTOs
    public class PickWaveCreateDto
    {
        public string WaveType { get; set; } = "Project"; // Project, Spares
        public Guid? ProjectId { get; set; }
        public string? StageCode { get; set; }
    }

    public class PickConfirmDto
    {
        public decimal PickedQty { get; set; }
        public string? SerialNumber { get; set; }
        public string? LotNumber { get; set; }
        public Guid? StagingBinId { get; set; }
    }

    // Package DTOs
    public class PackageLineCreateDto
    {
        public Guid? PickTaskId { get; set; }
        public Guid ItemId { get; set; }
        public string? LotNumber { get; set; }
        public string? SerialNumber { get; set; }
        public decimal PackedQty { get; set; }
    }

    public class PackageCreateDto
    {
        public Guid? ProjectId { get; set; }
        public string? StageCode { get; set; }
        public decimal? WeightKg { get; set; }
        public decimal? LengthCm { get; set; }
        public decimal? WidthCm { get; set; }
        public decimal? HeightCm { get; set; }
        public string? LabelTemplate { get; set; }
        public List<PackageLineCreateDto> Lines { get; set; } = new List<PackageLineCreateDto>();
    }

    // Shipment DTOs
    public class ShipmentCreateDto
    {
        public string ShipmentType { get; set; } = "Outbound";
        public Guid? ProjectId { get; set; }
        public Guid? CustomerId { get; set; }
        public Guid SourceWarehouseId { get; set; }
        public string DeliveryAddress { get; set; } = string.Empty;
        public string? VehicleNumber { get; set; }
        public string? DriverName { get; set; }
        public string? DriverMobile { get; set; }
        public string? TransportMode { get; set; }
        public string? CourierName { get; set; }
        public string? LRNumber { get; set; }
        public string? EWayBillNumber { get; set; }
        public DateTime? EWayBillExpiry { get; set; }
        public List<Guid> PackageIds { get; set; } = new List<Guid>();
    }
}
