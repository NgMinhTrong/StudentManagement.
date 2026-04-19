using System.ComponentModel.DataAnnotations;

namespace ConnectDB.Models;

public class Class
{
    [Key]
    public int Id { get; set; }

    [Required]
    [StringLength(50)]
    public string ClassName { get; set; } = string.Empty;

    public int Grade { get; set; } // Ví dụ: 10, 11, 12

    [StringLength(20)]
    public string AcademicYear { get; set; } = string.Empty;

    [StringLength(50)]
    public string? RoomNumber { get; set; } // Ví dụ: "Phòng 101"

    // Giáo viên chủ nhiệm
    public int? HomeroomTeacherId { get; set; }
    public virtual Teacher? HomeroomTeacher { get; set; }

    // Quan hệ điều hướng
    public virtual ICollection<Student> Students { get; set; } = new List<Student>();
    public virtual ICollection<TeachingAssignment> TeachingAssignments { get; set; } = new List<TeachingAssignment>();
}