using System.ComponentModel.DataAnnotations;

namespace ConnectDB.Models;

public class Role
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string RoleName { get; set; } = string.Empty; // "Admin", "Teacher", "Student"

    [StringLength(255)]
    public string? Description { get; set; }

    // Navigation property
    public virtual ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}