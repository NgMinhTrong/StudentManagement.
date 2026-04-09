using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConnectDB.Models;

public class Class
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(20)]
    public string ClassName { get; set; } = string.Empty;

    [Required]
    public int Grade { get; set; }

    [Required]
    [StringLength(10)]
    public string AcademicYear { get; set; } = string.Empty;

    [StringLength(10)]
    public string? RoomNumber { get; set; }

    // Khóa ngoại đến Teacher (Giáo viên chủ nhiệm)
    public int? HomeroomTeacherId { get; set; }

    // Navigation properties
    public virtual Teacher? HomeroomTeacher { get; set; }
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
    public virtual ICollection<TeachingAssignment> TeachingAssignments { get; set; } = new List<TeachingAssignment>();
}