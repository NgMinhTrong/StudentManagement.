using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NuGet.DependencyResolver;

namespace ConnectDB.Models;

public class User
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty; // Lưu mật khẩu đã mã hóa

    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(100)]
    public string Email { get; set; } = string.Empty;

    [StringLength(20)]
    public string? PhoneNumber { get; set; }

    public bool IsActive { get; set; } = true; // Tài khoản có bị khóa không?

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public DateTime? LastLoginAt { get; set; }

    // Navigation property: Một User có thể có nhiều Role (quan hệ nhiều-nhiều)
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();

    // Navigation property: Một User có thể là Student (1-1)
    public virtual Student? Student { get; set; }

    // Navigation property: Một User có thể là Teacher (1-1)
    public virtual Teacher? Teacher { get; set; }
}