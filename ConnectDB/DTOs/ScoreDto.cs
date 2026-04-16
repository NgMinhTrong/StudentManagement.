namespace ConnectDB.DTOs;

public class ScoreResponseDto
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string StudentCode { get; set; } = string.Empty;
    public int SubjectId { get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string Semester { get; set; } = "1";
    public float? Score15Min { get; set; }
    public float? Score45Min { get; set; }
    public float? ScoreFinal { get; set; }
    public float? AverageScore { get; set; }
}

public class ScoreCreateDto
{
    public int StudentId { get; set; }
    public int SubjectId { get; set; }
    public string Semester { get; set; } = "1";
    public float? Score15Min { get; set; }
    public float? Score45Min { get; set; }
    public float? ScoreFinal { get; set; }
}
