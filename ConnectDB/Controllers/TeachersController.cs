using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeachersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeacherResponseDto>>> GetTeachers()
        {
            return await _context.Teachers
                .Include(t => t.User)
                .Select(t => new TeacherResponseDto
                {
                    Id = t.Id,
                    UserId = t.UserId,
                    TeacherCode = t.TeacherCode,
                    FullName = t.User.FullName,
                    Specialization = t.Specialization,
                    HireDate = t.HireDate,
                    UserName = t.User.Username,
                    Email = t.User.Email
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<TeacherResponseDto>> GetTeacher(int id)
        {
            var teacher = await _context.Teachers
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (teacher == null) return NotFound();

            return new TeacherResponseDto
            {
                Id = teacher.Id,
                UserId = teacher.UserId,
                TeacherCode = teacher.TeacherCode,
                FullName = teacher.User.FullName,
                Specialization = teacher.Specialization,
                HireDate = teacher.HireDate,
                UserName = teacher.User.Username,
                Email = teacher.User.Email
            };
        }

        [HttpPost]
        public async Task<ActionResult<TeacherResponseDto>> PostTeacher(TeacherCreateDto teacherDto)
        {
            var teacher = new Teacher
            {
                UserId = teacherDto.UserId,
                TeacherCode = teacherDto.TeacherCode,
                Specialization = teacherDto.Specialization,
                HireDate = teacherDto.HireDate
            };

            _context.Teachers.Add(teacher);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetTeacher), new { id = teacher.Id }, teacherDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutTeacher(int id, TeacherCreateDto teacherDto)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

            teacher.UserId = teacherDto.UserId;
            teacher.TeacherCode = teacherDto.TeacherCode;
            teacher.Specialization = teacherDto.Specialization;
            teacher.HireDate = teacherDto.HireDate;

            _context.Entry(teacher).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
