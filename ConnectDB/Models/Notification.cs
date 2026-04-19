using System.ComponentModel.DataAnnotations;

namespace ConnectDB.Models;

public class Notification
{
    [Key]
    public int Id { get; set; }

    public int? UserId { get; set; } // If null, it's for everyone. If set, for specific user.
    public int? StudentId { get; set; } // Specific to a student

    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Message { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public bool IsRead { get; set; } = false;

    // Navigation
    public virtual User? User { get; set; }
    public virtual Student? Student { get; set; }
}
