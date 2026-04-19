using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;

using Microsoft.AspNetCore.Authorization;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
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
            var userCount = await _context.Users.CountAsync();
            var scoreCount = await _context.Scores.CountAsync();
            var assignmentCount = await _context.TeachingAssignments.CountAsync();
            var notificationCount = await _context.Notifications.CountAsync();
            var roleCount = await _context.Roles.CountAsync();

            var recentStudents = await _context.Students
                .OrderByDescending(s => s.Id)
                .Take(2)
                .Select(s => new { 
                    Title = "Sinh viên mới", 
                    Desc = $"Sinh viên {s.FullName} vừa được thêm vào hệ thống", 
                    Time = "Vừa xong" 
                })
                .ToListAsync();

            var recentScores = await _context.Scores
                .OrderByDescending(s => s.Id)
                .Take(3)
                .Select(s => new { 
                    Title = "Cập nhật điểm", 
                    Desc = $"Điểm môn {s.Subject.SubjectName} của học sinh {s.Student.FullName} vừa được cập nhật", 
                    Time = "Gần đây" 
                })
                .ToListAsync();

            var activities = new List<object>();
            activities.AddRange(recentStudents);
            activities.AddRange(recentScores);

            return Ok(new
            {
                totalStudents = studentCount,
                totalTeachers = teacherCount,
                totalClasses = classCount,
                totalSubjects = subjectCount,
                totalUsers = userCount,
                totalScores = scoreCount,
                totalAssignments = assignmentCount,
                totalNotifications = notificationCount,
                totalRoles = roleCount,
                recentActivities = activities
            });
        }
    }
}
