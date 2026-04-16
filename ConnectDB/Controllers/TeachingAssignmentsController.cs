using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachingAssignmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public TeachingAssignmentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("teacher/{teacherId}")]
        public async Task<ActionResult<IEnumerable<TeachingAssignmentResponseDto>>> GetAssignmentsByTeacher(int teacherId)
        {
            return await _context.TeachingAssignments
                .Include(ta => ta.Class)
                .Include(ta => ta.Subject)
                .Where(ta => ta.TeacherId == teacherId)
                .Select(ta => new TeachingAssignmentResponseDto
                {
                    Id = ta.Id,
                    TeacherId = ta.TeacherId,
                    ClassId = ta.ClassId,
                    ClassName = ta.Class.ClassName,
                    SubjectId = ta.SubjectId,
                    SubjectName = ta.Subject.SubjectName,
                    Semester = ta.Semester,
                    SchoolYear = ta.SchoolYear
                })
                .ToListAsync();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeachingAssignmentResponseDto>>> GetAssignments()
        {
            return await _context.TeachingAssignments
                .Include(ta => ta.Teacher).ThenInclude(t => t.User)
                .Include(ta => ta.Class)
                .Include(ta => ta.Subject)
                .Select(ta => new TeachingAssignmentResponseDto
                {
                    Id = ta.Id,
                    TeacherId = ta.TeacherId,
                    TeacherName = ta.Teacher.User.FullName,
                    ClassId = ta.ClassId,
                    ClassName = ta.Class.ClassName,
                    SubjectId = ta.SubjectId,
                    SubjectName = ta.Subject.SubjectName,
                    Semester = ta.Semester,
                    SchoolYear = ta.SchoolYear
                })
                .ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<TeachingAssignmentResponseDto>> PostAssignment(TeachingAssignmentCreateDto dto)
        {
            var assignment = new TeachingAssignment
            {
                TeacherId = dto.TeacherId,
                ClassId = dto.ClassId,
                SubjectId = dto.SubjectId,
                Semester = dto.Semester,
                SchoolYear = dto.SchoolYear
            };

            _context.TeachingAssignments.Add(assignment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAssignments), new { id = assignment.Id }, dto);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var assignment = await _context.TeachingAssignments.FindAsync(id);
            if (assignment == null) return NotFound();

            _context.TeachingAssignments.Remove(assignment);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
