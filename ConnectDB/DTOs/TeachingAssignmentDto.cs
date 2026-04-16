namespace ConnectDB.DTOs;

public class TeachingAssignmentResponseDto
{
    public int Id { get; set; }
    public int TeacherId { get; set; }
    public string TeacherName { get; set; } = string.Empty;
    public int ClassId { get; set; }
    public string ClassName { get; set; } = string.Empty;
    public int SubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string Semester { get; set; } = "1";
    public string SchoolYear { get; set; } = string.Empty;
}

public class TeachingAssignmentCreateDto
{
    public int TeacherId { get; set; }
    public int ClassId { get; set; }
    public int SubjectId { get; set; }
    public string Semester { get; set; } = "1";
    public string SchoolYear { get; set; } = string.Empty;
}
