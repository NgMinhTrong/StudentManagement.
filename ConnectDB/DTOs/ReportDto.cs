namespace ConnectDB.DTOs
{
    public class StudentTranscriptDto
    {
        public int StudentId { get; set; }
        public string StudentCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string ClassName { get; set; } = string.Empty;
        public List<SubjectScoreDto> Scores { get; set; } = new();
        public double? TotalAverageScore { get; set; }
        public string Classification { get; set; } = string.Empty;
    }

    public class SubjectScoreDto
    {
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public string Semester { get; set; } = string.Empty;
        public double? Score15Min { get; set; }
        public double? Score45Min { get; set; }
        public double? ScoreFinal { get; set; }
        public double? AverageScore { get; set; }
    }

    public class ClassRankDto
    {
        public int Rank { get; set; }
        public int StudentId { get; set; }
        public string StudentCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public double? AverageGPA { get; set; }
        public string Classification { get; set; } = string.Empty;
    }
}
