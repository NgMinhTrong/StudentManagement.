using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ScoresController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ScoresController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScoreResponseDto>>> GetScores()
        {
            return await GetFilteredScores(null, null, null);
        }

        [HttpGet("filter")]
        public async Task<ActionResult<IEnumerable<ScoreResponseDto>>> GetFilteredScores(int? classId, int? subjectId, string? semester)
        {
            var query = _context.Scores
                .Include(s => s.Student)
                .Include(s => s.Subject)
                .AsQueryable();

            if (classId.HasValue)
                query = query.Where(s => s.Student.ClassId == classId.Value);
            
            if (subjectId.HasValue)
                query = query.Where(s => s.SubjectId == subjectId.Value);

            if (!string.IsNullOrEmpty(semester))
                query = query.Where(s => s.Semester == semester);

            // Project directly to ScoreResponseDto to ensure EF Core translation
            var response = await query
                .Select(s => new ScoreResponseDto
                {
                    Id = s.Id,
                    StudentId = s.StudentId,
                    StudentName = s.Student.FullName,
                    StudentCode = s.Student.StudentCode,
                    SubjectId = s.SubjectId,
                    SubjectName = s.Subject.SubjectName,
                    Semester = s.Semester,
                    Score15Min = s.Score15Min,
                    Score45Min = s.Score45Min,
                    ScoreFinal = s.ScoreFinal,
                    AverageScore = s.AverageScore,
                    TeacherRemarks = s.TeacherRemarks,
                    TeacherName = _context.TeachingAssignments
                        .Where(ta => ta.ClassId == s.Student.ClassId && ta.SubjectId == s.SubjectId)
                        .Select(ta => ta.Teacher.FullName)
                        .FirstOrDefault() ?? "Chưa phân công"
                })
                .ToListAsync();

            return response;
        }

        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<ScoreResponseDto>>> GetStudentScores(int studentId)
        {
            var student = await _context.Students.FindAsync(studentId);
            if (student == null) return NotFound();

            var response = await _context.Scores
                .Include(s => s.Subject)
                .Where(s => s.StudentId == studentId)
                .Select(s => new ScoreResponseDto
                {
                    Id = s.Id,
                    StudentId = s.StudentId,
                    SubjectId = s.SubjectId,
                    SubjectName = s.Subject.SubjectName,
                    Semester = s.Semester,
                    Score15Min = s.Score15Min,
                    Score45Min = s.Score45Min,
                    ScoreFinal = s.ScoreFinal,
                    AverageScore = s.AverageScore,
                    TeacherRemarks = s.TeacherRemarks,
                    TeacherName = _context.TeachingAssignments
                        .Where(ta => ta.ClassId == student.ClassId && ta.SubjectId == s.SubjectId)
                        .Select(ta => ta.Teacher.FullName)
                        .FirstOrDefault() ?? "Chưa phân công"
                })
                .ToListAsync();

            return response;
        }

        [HttpPost]
        public async Task<ActionResult<Score>> PostScore(ScoreCreateDto scoreDto)
        {
            var score = new Score
            {
                StudentId = scoreDto.StudentId,
                SubjectId = scoreDto.SubjectId,
                Semester = scoreDto.Semester,
                Score15Min = scoreDto.Score15Min,
                Score45Min = scoreDto.Score45Min,
                ScoreFinal = scoreDto.ScoreFinal,
                TeacherRemarks = scoreDto.TeacherRemarks
            };

            _context.Scores.Add(score);

            // Create Automated Notification
            var subject = await _context.Subjects.FindAsync(score.SubjectId);
            _context.Notifications.Add(new Notification
            {
                StudentId = score.StudentId,
                Title = "Điểm mới vừa được nhập",
                Message = $"Môn {subject?.SubjectName} vừa có điểm mới cho học kỳ {score.Semester}.",
                CreatedAt = DateTime.Now
            });

            await _context.SaveChangesAsync();

            return Ok(score);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutScore(int id, ScoreCreateDto scoreDto)
        {
            var score = await _context.Scores.FindAsync(id);
            if (score == null) return NotFound();

            score.Score15Min = scoreDto.Score15Min;
            score.Score45Min = scoreDto.Score45Min;
            score.ScoreFinal = scoreDto.ScoreFinal;
            score.TeacherRemarks = scoreDto.TeacherRemarks;

            // Create Automated Notification
            var subject = await _context.Subjects.FindAsync(score.SubjectId);
            _context.Notifications.Add(new Notification
            {
                StudentId = score.StudentId,
                Title = "Cập nhật điểm số",
                Message = $"Điểm môn {subject?.SubjectName} đã được cập nhật.",
                CreatedAt = DateTime.Now
            });

            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
