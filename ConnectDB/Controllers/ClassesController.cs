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
    public class ClassesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ClassesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Classes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClassResponseDto>>> GetClasses()
        {
            return await _context.Classes
                .Include(c => c.HomeroomTeacher)
                .Include(c => c.Students)
                .Select(c => new ClassResponseDto
                {
                    Id = c.Id,
                    ClassName = c.ClassName,
                    Grade = c.Grade,
                    AcademicYear = c.AcademicYear,
                    RoomNumber = c.RoomNumber,
                    HomeroomTeacherId = c.HomeroomTeacherId,
                    HomeroomTeacherName = c.HomeroomTeacher != null ? c.HomeroomTeacher.User.FullName : "N/A",
                    StudentCount = c.Students.Count
                })
                .ToListAsync();
        }

        // GET: api/Classes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ClassResponseDto>> GetClass(int id)
        {
            var classEntity = await _context.Classes
                .Include(c => c.HomeroomTeacher)
                .Include(c => c.Students)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (classEntity == null) return NotFound();

            return new ClassResponseDto
            {
                Id = classEntity.Id,
                ClassName = classEntity.ClassName,
                Grade = classEntity.Grade,
                AcademicYear = classEntity.AcademicYear,
                RoomNumber = classEntity.RoomNumber,
                HomeroomTeacherId = classEntity.HomeroomTeacherId,
                HomeroomTeacherName = classEntity.HomeroomTeacher != null ? classEntity.HomeroomTeacher.User.FullName : "N/A",
                StudentCount = classEntity.Students.Count
            };
        }

        // POST: api/Classes
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ClassResponseDto>> PostClass(ClassCreateDto classDto)
        {
            var classEntity = new Class
            {
                ClassName = classDto.ClassName,
                Grade = classDto.Grade,
                AcademicYear = classDto.AcademicYear,
                RoomNumber = classDto.RoomNumber,
                HomeroomTeacherId = classDto.HomeroomTeacherId
            };

            _context.Classes.Add(classEntity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetClass), new { id = classEntity.Id }, classDto);
        }

        // PUT: api/Classes/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutClass(int id, ClassCreateDto classDto)
        {
            var classEntity = await _context.Classes.FindAsync(id);
            if (classEntity == null) return NotFound();

            classEntity.ClassName = classDto.ClassName;
            classEntity.Grade = classDto.Grade;
            classEntity.AcademicYear = classDto.AcademicYear;
            classEntity.RoomNumber = classDto.RoomNumber;
            classEntity.HomeroomTeacherId = classDto.HomeroomTeacherId;

            _context.Entry(classEntity).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Classes/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            var classEntity = await _context.Classes.FindAsync(id);
            if (classEntity == null) return NotFound();

            _context.Classes.Remove(classEntity);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
