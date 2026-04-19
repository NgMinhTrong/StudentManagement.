using System.ComponentModel.DataAnnotations;

namespace ConnectDB.Models;

public class Score
{
    [Key]
    public int Id { get; set; }

    public int StudentId { get; set; }
    public int SubjectId { get; set; }

    [Required]
    [StringLength(10)]
    public string Semester { get; set; } = string.Empty; // e.g., "HK1", "HK2"

    [Range(0, 10)]
    public double? Score15Min { get; set; }

    [Range(0, 10)]
    public double? Score45Min { get; set; }

    [Range(0, 10)]
    public double? ScoreFinal { get; set; }

    public double? AverageScore { get; private set; } // Computed in DB

    [StringLength(500)]
    public string? TeacherRemarks { get; set; } // Lời phê của giáo viên

    // Navigation properties
    public virtual Student Student { get; set; } = null!;
    public virtual Subject Subject { get; set; } = null!;
}