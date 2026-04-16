namespace ConnectDB.DTOs;

public class SubjectResponseDto
{
    public int Id { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public int Credits { get; set; }
    public string SubjectType { get; set; } = string.Empty;
}

public class SubjectCreateDto
{
    public string SubjectName { get; set; } = string.Empty;
    public int Credits { get; set; }
    public string SubjectType { get; set; } = "Theory";
}
