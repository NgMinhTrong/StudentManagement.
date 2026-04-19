using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;

using Microsoft.AspNetCore.Authorization;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class StudentDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentDashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary/{studentId}")]
        public async Task<IActionResult> GetSummary(int studentId)
        {
            var student = await _context.Students
                .Include(s => s.Class)
                .FirstOrDefaultAsync(s => s.Id == studentId);

            if (student == null) return NotFound();

            var scores = await _context.Scores
                .Where(s => s.StudentId == studentId)
                .ToListAsync();

            double gpa = scores.Any() ? scores.Average(s => s.AverageScore ?? 0) : 0;

            // Simple Ranking logic by Grade (Khối)
            var gradeStudents = await _context.Students
                .Where(s => s.Class.Grade == student.Class.Grade)
                .Include(s => s.Scores)
                .ToListAsync();

            var rankings = gradeStudents
                .Select(s => new { 
                    StudentId = s.Id, 
                    Avg = s.Scores.Any() ? s.Scores.Average(sc => sc.AverageScore ?? 0) : 0 
                })
                .OrderByDescending(x => x.Avg)
                .ToList();

            int rank = rankings.FindIndex(x => x.StudentId == studentId) + 1;

            var notifications = await _context.Notifications
                .Where(n => n.StudentId == studentId || n.StudentId == null)
                .OrderByDescending(n => n.CreatedAt)
                .Take(5)
                .ToListAsync();

            return Ok(new
            {
                gpa = Math.Round(gpa, 2),
                rank = rank,
                totalInGrade = rankings.Count,
                notifications = notifications
            });
        }

        [HttpGet("performance-chart/{studentId}")]
        public async Task<IActionResult> GetChartData(int studentId)
        {
            var scores = await _context.Scores
                .Where(s => s.StudentId == studentId)
                .ToListAsync();

            // Group by Semester for the chart
            var chartData = scores
                .GroupBy(s => s.Semester)
                .Select(g => new { 
                    Semester = g.Key, 
                    Avg = Math.Round(g.Average(s => s.AverageScore ?? 0), 2) 
                })
                .OrderBy(x => x.Semester)
                .ToList();

            return Ok(chartData);
        }
    }
}
