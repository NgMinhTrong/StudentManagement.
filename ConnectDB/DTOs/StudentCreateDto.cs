using System.ComponentModel.DataAnnotations;

namespace ConnectDB.DTOs;

public class StudentCreateDto
{
    [Required]
    public int UserId { get; set; }

    [Required]
    public int ClassId { get; set; }

    [Required]
    [StringLength(20)]
    public string StudentCode { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    public DateTime Birthday { get; set; }
}