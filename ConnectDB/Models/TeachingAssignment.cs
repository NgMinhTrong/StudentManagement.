using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConnectDB.Models;

public class TeachingAssignment
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int TeacherId { get; set; }

    [Required]
    public int ClassId { get; set; }

    [Required]
    public int SubjectId { get; set; }

    [Required]
    [StringLength(10)]
    public string Semester { get; set; } = "1"; // Học kỳ 1 hoặc 2

    [Required]
    [StringLength(10)]
    public string SchoolYear { get; set; } = string.Empty; // Năm học: "2024-2025"

    // Navigation properties
    public virtual Teacher Teacher { get; set; } = null!;
    public virtual Class Class { get; set; } = null!;
    public virtual Subject Subject { get; set; } = null!;
}