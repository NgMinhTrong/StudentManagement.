using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConnectDB.Models;

public class Score
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int StudentId { get; set; }

    [Required]
    public int SubjectId { get; set; }

    [Required]
    [StringLength(10)]
    public string Semester { get; set; } = "1"; // Học kỳ 1 hoặc 2

    [Range(0, 10)]
    public float? Score15Min { get; set; }  // Điểm 15 phút (hệ số 1)

    [Range(0, 10)]
    public float? Score45Min { get; set; }  // Điểm 45 phút / 1 tiết (hệ số 2)

    [Range(0, 10)]
    public float? ScoreFinal { get; set; }  // Điểm cuối kỳ (hệ số 3)

    [DatabaseGenerated(DatabaseGeneratedOption.Computed)]
    public float? AverageScore { get; set; } // Điểm trung bình môn (sẽ tự tính khi lưu)

    // Navigation properties
    public virtual Student Student { get; set; } = null!;
    public virtual Subject Subject { get; set; } = null!;
}