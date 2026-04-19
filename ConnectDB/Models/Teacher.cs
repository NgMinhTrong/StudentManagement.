using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConnectDB.Models;

public class Teacher
{
    [Key]
    public int Id { get; set; }

    // Liên kết đến User (1-1)
    [Required]
    public int UserId { get; set; }

    [Required]
    [StringLength(20)]
    public string TeacherCode { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty; // Added FullName for consistency with Student

    [StringLength(100)]
    public string? Specialization { get; set; } // Chuyên môn: Toán, Văn, CNTT...

    public DateTime HireDate { get; set; } = DateTime.Now;

    // Navigation properties
    public virtual User User { get; set; } = null!;

    // Một giáo viên có thể là chủ nhiệm của nhiều lớp (trong các năm khác nhau)
    public virtual ICollection<Class> HomeroomClasses { get; set; } = new List<Class>();

    // Một giáo viên có thể được phân công dạy nhiều lớp-môn
    public virtual ICollection<TeachingAssignment> TeachingAssignments { get; set; } = new List<TeachingAssignment>();
}