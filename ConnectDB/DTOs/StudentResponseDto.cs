namespace ConnectDB.DTOs;

public class StudentResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int ClassId { get; set; }
    public string StudentCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public DateTime Birthday { get; set; }

    // Thông tin mở rộng (optional)
    public string ClassName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}