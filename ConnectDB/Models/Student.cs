using System.ComponentModel.DataAnnotations;
namespace ConnectDB.Models;

public class Student
{
    [Key]
    public int Id { get; set; }

    public int UserId { get; set; }
    public int ClassId { get; set; }

    [Required]
    [StringLength(20)]
    public string StudentCode { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    public DateTime Birthday { get; set; }

    // Navigation properties
    public virtual Class Class { get; set; } = null!;
    public virtual User User { get; set; } = null!;
    public virtual ICollection<Score> Scores { get; set; } = new List<Score>();
}