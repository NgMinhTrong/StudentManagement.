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

            return await query
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
                    AverageScore = s.AverageScore
                })
                .ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScoreResponseDto>>> GetScores()
        {
            return await _context.Scores
                .Include(s => s.Student)
                .Include(s => s.Subject)
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
                    AverageScore = s.AverageScore
                })
                .ToListAsync();
        }

        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<ScoreResponseDto>>> GetScoresByStudent(int studentId)
        {
            return await _context.Scores
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
                    AverageScore = s.AverageScore
                })
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<ScoreResponseDto>> PostScore(ScoreCreateDto scoreDto)
        {
            var score = new Score
            {
                StudentId = scoreDto.StudentId,
                SubjectId = scoreDto.SubjectId,
                Semester = scoreDto.Semester,
                Score15Min = scoreDto.Score15Min,
                Score45Min = scoreDto.Score45Min,
                ScoreFinal = scoreDto.ScoreFinal
            };

            _context.Scores.Add(score);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetScores), new { id = score.Id }, scoreDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutScore(int id, ScoreCreateDto scoreDto)
        {
            var score = await _context.Scores.FindAsync(id);
            if (score == null) return NotFound();

            score.Score15Min = scoreDto.Score15Min;
            score.Score45Min = scoreDto.Score45Min;
            score.ScoreFinal = scoreDto.ScoreFinal;
            score.Semester = scoreDto.Semester;

            _context.Entry(score).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScore(int id)
        {
            var score = await _context.Scores.FindAsync(id);
            if (score == null) return NotFound();

            _context.Scores.Remove(score);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
