using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReportsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ReportsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("transcript/{studentId}")]
        public async Task<ActionResult<StudentTranscriptDto>> GetStudentTranscript(int studentId)
        {
            var student = await _context.Students
                .Include(s => s.Class)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null) return NotFound("Không tìm thấy học sinh.");

            var scores = await _context.Scores
                .Include(s => s.Subject)
                .Where(s => s.StudentId == studentId)
                .Select(s => new SubjectScoreDto
                {
                    SubjectId = s.SubjectId,
                    SubjectName = s.Subject.SubjectName,
                    Semester = s.Semester,
                    Score15Min = s.Score15Min,
                    Score45Min = s.Score45Min,
                    ScoreFinal = s.ScoreFinal,
                    AverageScore = s.AverageScore
                })
                .ToListAsync();

            var avgGPA = scores.Any() ? scores.Average(s => s.AverageScore ?? 0) : 0;

            var result = new StudentTranscriptDto
            {
                StudentId = student.Id,
                StudentCode = student.StudentCode,
                FullName = student.FullName,
                ClassName = student.Class?.ClassName ?? "Chưa có lớp",
                Scores = scores,
                TotalAverageScore = Math.Round(avgGPA, 2),
                Classification = GetClassification(avgGPA)
            };

            return Ok(result);
        }

        [HttpGet("class-rank/{classId}")]
        public async Task<ActionResult<IEnumerable<ClassRankDto>>> GetClassRanking(int classId, string? semester)
        {
            var classObj = await _context.Classes.FindAsync(classId);
            if (classObj == null) return NotFound("Không tìm thấy lớp học.");

            var studentScores = await _context.Students
                .Where(s => s.ClassId == classId)
                .Select(s => new
                {
                    s.Id,
                    s.StudentCode,
                    s.FullName,
                    AverageGPA = _context.Scores
                        .Where(sc => sc.StudentId == s.Id && (string.IsNullOrEmpty(semester) || sc.Semester == semester))
                        .Average(sc => (double?)sc.AverageScore) ?? 0
                })
                .OrderByDescending(s => s.AverageGPA)
                .ToListAsync();

            var result = studentScores.Select((s, index) => new ClassRankDto
            {
                Rank = index + 1,
                StudentId = s.Id,
                StudentCode = s.StudentCode,
                FullName = s.FullName,
                AverageGPA = Math.Round(s.AverageGPA, 2),
                Classification = GetClassification(s.AverageGPA)
            }).ToList();

            return Ok(result);
        }

        private string GetClassification(double gpa)
        {
            return ConnectDB.Services.ScoreService.GetClassification(gpa);
        }
    }
}
