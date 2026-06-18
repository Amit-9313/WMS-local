using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("categories", Schema = "wms")]
    public class Category
    {
        [Key]
        [Column("categoryid")]
        public Guid CategoryId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        [Column("categoryname")]
        public string CategoryName { get; set; } = string.Empty;

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<SubCategory> SubCategories { get; set; } = new List<SubCategory>();
    }

    [Table("subcategories", Schema = "wms")]
    public class SubCategory
    {
        [Key]
        [Column("subcategoryid")]
        public Guid SubCategoryId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("categoryid")]
        public Guid CategoryId { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public virtual Category? Category { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("subcategoryname")]
        public string SubCategoryName { get; set; } = string.Empty;

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("manufacturers", Schema = "wms")]
    public class Manufacturer
    {
        [Key]
        [Column("manufacturerid")]
        public Guid ManufacturerId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(100)]
        [Column("name")]
        public string Name { get; set; } = string.Empty;

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    [Table("uoms", Schema = "wms")]
    public class Uom
    {
        [Key]
        [Column("uomid")]
        public Guid UomId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(10)]
        [Column("uomcode")]
        public string UomCode { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("description")]
        public string? Description { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; } = true;
    }

    [Table("items", Schema = "wms")]
    public class Item
    {
        [Key]
        [Column("itemid")]
        public Guid ItemId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        [Column("skucode")]
        public string SKUCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        [Column("itemname")]
        public string ItemName { get; set; } = string.Empty;

        [Column("description")]
        public string? Description { get; set; }

        [Column("categoryid")]
        public Guid? CategoryId { get; set; }

        [ForeignKey(nameof(CategoryId))]
        public virtual Category? Category { get; set; }

        [Column("subcategoryid")]
        public Guid? SubCategoryId { get; set; }

        [ForeignKey(nameof(SubCategoryId))]
        public virtual SubCategory? SubCategory { get; set; }

        [Column("manufacturerid")]
        public Guid? ManufacturerId { get; set; }

        [ForeignKey(nameof(ManufacturerId))]
        public virtual Manufacturer? Manufacturer { get; set; }

        [MaxLength(100)]
        [Column("partnumber")]
        public string? PartNumber { get; set; }

        [Column("uomid")]
        public Guid? UomId { get; set; }

        [ForeignKey(nameof(UomId))]
        public virtual Uom? Uom { get; set; }

        [Column("weightkg")]
        public decimal? WeightKg { get; set; }

        [Column("lengthmm")]
        public decimal? LengthMm { get; set; }

        [Column("widthmm")]
        public decimal? WidthMm { get; set; }

        [Column("heightmm")]
        public decimal? HeightMm { get; set; }

        [MaxLength(20)]
        [Column("hsncode")]
        public string? HSNCode { get; set; }

        [Column("serialrequired")]
        public bool SerialRequired { get; set; } = false;

        [Column("batchrequired")]
        public bool BatchRequired { get; set; } = false;

        [Column("minstockqty")]
        public decimal MinStockQty { get; set; } = 0;

        [Column("maxstockqty")]
        public decimal? MaxStockQty { get; set; }

        [Column("reorderlevel")]
        public decimal ReorderLevel { get; set; } = 0;

        [Column("reorderqty")]
        public decimal? ReorderQty { get; set; }

        [Column("leadtimedays")]
        public int LeadTimeDays { get; set; } = 0;

        [MaxLength(20)]
        [Column("barcodetype")]
        public string BarcodeType { get; set; } = "Code128";

        [MaxLength(200)]
        [Column("barcodevalue")]
        public string? BarcodeValue { get; set; }

        [MaxLength(500)]
        [Column("barcodeimageurl")]
        public string? BarcodeImageUrl { get; set; }

        [Required]
        [Column("standardcost")]
        public decimal StandardCost { get; set; } = 0;

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }
    }

    [Table("vendors", Schema = "wms")]
    public class Vendor
    {
        [Key]
        [Column("vendorid")]
        public Guid VendorId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(20)]
        [Column("vendorcode")]
        public string VendorCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        [Column("vendorname")]
        public string VendorName { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("contactperson")]
        public string? ContactPerson { get; set; }

        [MaxLength(20)]
        [Column("mobile")]
        public string? Mobile { get; set; }

        [MaxLength(100)]
        [Column("email")]
        public string? Email { get; set; }

        [MaxLength(20)]
        [Column("gstnumber")]
        public string? GSTNumber { get; set; }

        [MaxLength(20)]
        [Column("pannumber")]
        public string? PANNumber { get; set; }

        [MaxLength(200)]
        [Column("addressline1")]
        public string? AddressLine1 { get; set; }

        [MaxLength(100)]
        [Column("city")]
        public string? City { get; set; }

        [MaxLength(100)]
        [Column("state")]
        public string? State { get; set; }

        [MaxLength(10)]
        [Column("pincode")]
        public string? Pincode { get; set; }

        [MaxLength(50)]
        [Column("paymentterms")]
        public string? PaymentTerms { get; set; }

        [Column("creditlimit")]
        public decimal? CreditLimit { get; set; }

        [Column("rating")]
        public short? Rating { get; set; }

        [Column("isapproved")]
        public bool IsApproved { get; set; } = false;

        [Column("blacklistreason")]
        public string? BlacklistReason { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }
    }

    [Table("customers", Schema = "wms")]
    public class Customer
    {
        [Key]
        [Column("customerid")]
        public Guid CustomerId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(20)]
        [Column("customercode")]
        public string CustomerCode { get; set; } = string.Empty;

        [Required]
        [MaxLength(200)]
        [Column("customername")]
        public string CustomerName { get; set; } = string.Empty;

        [MaxLength(200)]
        [Column("projectname")]
        public string? ProjectName { get; set; }

        [Column("siteaddress")]
        public string? SiteAddress { get; set; }

        [MaxLength(100)]
        [Column("contactperson")]
        public string? ContactPerson { get; set; }

        [MaxLength(20)]
        [Column("mobile")]
        public string? Mobile { get; set; }

        [MaxLength(100)]
        [Column("email")]
        public string? Email { get; set; }

        [MaxLength(20)]
        [Column("gstnumber")]
        public string? GSTNumber { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [Column("updatedat")]
        public DateTime? UpdatedAt { get; set; }
    }
}
