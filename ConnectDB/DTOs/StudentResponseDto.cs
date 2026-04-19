namespace ConnectDB.DTOs
{
    public class StudentResponseDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string StudentCode { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public DateTime Birthday { get; set; }
        public string ClassName { get; set; } = string.Empty;
        public int ClassId { get; set; }
        public string Email { get; set; } = string.Empty;
    }
}