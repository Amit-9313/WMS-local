using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WarehouseAPI.Models
{
    [Table("users", Schema = "wms")]
    public class User
    {
        [Key]
        [Column("userid")]
        public Guid UserId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        [Column("username")]
        public string Username { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        [Column("passwordhash")]
        public string PasswordHash { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("email")]
        public string? Email { get; set; }

        [MaxLength(100)]
        [Column("fullname")]
        public string? FullName { get; set; }

        [Column("isactive")]
        public bool IsActive { get; set; } = true;

        [Column("createdat")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }

    [Table("roles", Schema = "wms")]
    public class Role
    {
        [Key]
        [Column("roleid")]
        public Guid RoleId { get; set; } = Guid.NewGuid();

        [Required]
        [MaxLength(50)]
        [Column("rolename")]
        public string RoleName { get; set; } = string.Empty;

        [MaxLength(100)]
        [Column("description")]
        public string? Description { get; set; }

        public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
    }

    [Table("userroles", Schema = "wms")]
    public class UserRole
    {
        [Key]
        [Column("userroleid")]
        public Guid UserRoleId { get; set; } = Guid.NewGuid();

        [Required]
        [Column("userid")]
        public Guid UserId { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }

        [Required]
        [Column("roleid")]
        public Guid RoleId { get; set; }

        [ForeignKey(nameof(RoleId))]
        public virtual Role? Role { get; set; }
    }
}
