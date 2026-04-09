using System.ComponentModel.DataAnnotations;

namespace ConnectDB.Models;

public class Subject
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(100)]
    public string SubjectName { get; set; } = string.Empty; // Toán, Văn, Anh...

    public int Credits { get; set; } = 1; // Số tín chỉ

    [StringLength(20)]
    public string SubjectType { get; set; } = "Theory"; // Theory, Practice, Both

    public virtual ICollection<TeachingAssignment> TeachingAssignments { get; set; } = new List<TeachingAssignment>();
    public virtual ICollection<Score> Scores { get; set; } = new List<Score>();
}