using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConnectDB.Models;

public class UserRole
{
    [Key]
    [Column(Order = 0)]
    public int UserId { get; set; }

    [Key]
    [Column(Order = 1)]
    public int RoleId { get; set; }

    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Role Role { get; set; } = null!;
}