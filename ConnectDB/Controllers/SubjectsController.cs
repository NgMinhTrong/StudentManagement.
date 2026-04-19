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
    public class SubjectsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SubjectsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SubjectResponseDto>>> GetSubjects()
        {
            return await _context.Subjects
                .Select(s => new SubjectResponseDto
                {
                    Id = s.Id,
                    SubjectName = s.SubjectName,
                    Credits = s.Credits,
                    SubjectType = s.SubjectType
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SubjectResponseDto>> GetSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null) return NotFound();

            return new SubjectResponseDto
            {
                Id = subject.Id,
                SubjectName = subject.SubjectName,
                Credits = subject.Credits,
                SubjectType = subject.SubjectType
            };
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SubjectResponseDto>> PostSubject(SubjectCreateDto subjectDto)
        {
            var subject = new Subject
            {
                SubjectName = subjectDto.SubjectName,
                Credits = subjectDto.Credits,
                SubjectType = subjectDto.SubjectType
            };

            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetSubject), new { id = subject.Id }, subjectDto);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutSubject(int id, SubjectCreateDto subjectDto)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null) return NotFound();

            subject.SubjectName = subjectDto.SubjectName;
            subject.Credits = subjectDto.Credits;
            subject.SubjectType = subjectDto.SubjectType;

            _context.Entry(subject).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteSubject(int id)
        {
            var subject = await _context.Subjects.FindAsync(id);
            if (subject == null) return NotFound();

            _context.Subjects.Remove(subject);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
