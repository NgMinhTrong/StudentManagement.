using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var studentCount = await _context.Students.CountAsync();
            var teacherCount = await _context.Teachers.CountAsync();
            var classCount = await _context.Classes.CountAsync();
            var subjectCount = await _context.Subjects.CountAsync();

            return Ok(new
            {
                totalStudents = studentCount,
                totalTeachers = teacherCount,
                totalClasses = classCount,
                totalSubjects = subjectCount
            });
        }
    }
}
