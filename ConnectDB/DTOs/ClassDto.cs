namespace ConnectDB.DTOs;

public class ClassResponseDto
{
    public int Id { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public int Grade { get; set; }
    public string AcademicYear { get; set; } = string.Empty;
    public string? RoomNumber { get; set; }
    public int? HomeroomTeacherId { get; set; }
    public string? HomeroomTeacherName { get; set; }
    public int StudentCount { get; set; }
}

public class ClassCreateDto
{
    public string ClassName { get; set; } = string.Empty;
    public int Grade { get; set; }
    public string AcademicYear { get; set; } = string.Empty;
    public string? RoomNumber { get; set; }
    public int? HomeroomTeacherId { get; set; }
}
