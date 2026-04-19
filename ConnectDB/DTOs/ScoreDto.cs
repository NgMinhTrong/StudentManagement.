namespace ConnectDB.DTOs
{
    public class ScoreResponseDto
    {
        public int Id { get; set; }
        public int StudentId { get; set; }
        public string StudentName { get; set; } = string.Empty;
        public string StudentCode { get; set; } = string.Empty;
        public int SubjectId { get; set; }
        public string SubjectName { get; set; } = string.Empty;
        public string Semester { get; set; } = string.Empty;
        public double? Score15Min { get; set; }
        public double? Score45Min { get; set; }
        public double? ScoreFinal { get; set; }
        public double? AverageScore { get; set; }
        public string? TeacherRemarks { get; set; }
        public string? TeacherName { get; set; } // Derived from TeachingAssignments
    }

    public class ScoreCreateDto
    {
        public int StudentId { get; set; }
        public int SubjectId { get; set; }
        public string Semester { get; set; } = string.Empty;
        public double? Score15Min { get; set; }
        public double? Score45Min { get; set; }
        public double? ScoreFinal { get; set; }
        public string? TeacherRemarks { get; set; }
    }
}
