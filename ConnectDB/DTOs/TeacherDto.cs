namespace ConnectDB.DTOs;

public class TeacherResponseDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string TeacherCode { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string? Specialization { get; set; }
    public DateTime HireDate { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
}

public class TeacherCreateDto
{
    public int UserId { get; set; }
    public string TeacherCode { get; set; } = string.Empty;
    public string? Specialization { get; set; }
    public DateTime HireDate { get; set; }
}
