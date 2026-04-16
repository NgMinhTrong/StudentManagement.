using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;  

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StudentsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Students
        [HttpGet]
        public async Task<ActionResult<IEnumerable<StudentResponseDto>>> GetStudents()
        {
            var students = await _context.Students
                .Include(s => s.Class)
                .Include(s => s.User)
                .Select(s => new StudentResponseDto
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    ClassId = s.ClassId,
                    StudentCode = s.StudentCode,
                    FullName = s.FullName,
                    Birthday = s.Birthday,
                    ClassName = s.Class != null ? s.Class.ClassName : "",
                    UserName = s.User != null ? s.User.Username : "",
                    Email = s.User != null ? s.User.Email : ""
                })
                .ToListAsync();

            return Ok(students);
        }

        // GET: api/Students/5
        [HttpGet("{id}")]
        public async Task<ActionResult<StudentResponseDto>> GetStudent(int id)
        {
            var student = await _context.Students
                .Include(s => s.Class)
                .Include(s => s.User)
                .Where(s => s.Id == id)
                .Select(s => new StudentResponseDto
                {
                    Id = s.Id,
                    UserId = s.UserId,
                    ClassId = s.ClassId,
                    StudentCode = s.StudentCode,
                    FullName = s.FullName,
                    Birthday = s.Birthday,
                    ClassName = s.Class != null ? s.Class.ClassName : "",
                    UserName = s.User != null ? s.User.Username : "",
                    Email = s.User != null ? s.User.Email : ""
                })
                .FirstOrDefaultAsync();

            if (student == null) return NotFound();
            return Ok(student);
        }

        // POST: api/Students
        [HttpPost]
        public async Task<ActionResult<StudentResponseDto>> PostStudent(StudentCreateDto studentDto)
        {
            // Kiểm tra User có tồn tại không
            var user = await _context.Users.FindAsync(studentDto.UserId);
            if (user == null)
            {
                return BadRequest(new { message = $"User với Id = {studentDto.UserId} không tồn tại" });
            }

            // Kiểm tra Class có tồn tại không
            var classEntity = await _context.Classes.FindAsync(studentDto.ClassId);
            if (classEntity == null)
            {
                return BadRequest(new { message = $"Class với Id = {studentDto.ClassId} không tồn tại" });
            }

            // Kiểm tra StudentCode có bị trùng không
            var existingStudent = await _context.Students
                .FirstOrDefaultAsync(s => s.StudentCode == studentDto.StudentCode);
            if (existingStudent != null)
            {
                return BadRequest(new { message = $"Mã học sinh {studentDto.StudentCode} đã tồn tại" });
            }

            // Tạo Student mới từ DTO
            var student = new Student
            {
                UserId = studentDto.UserId,
                ClassId = studentDto.ClassId,
                StudentCode = studentDto.StudentCode,
                FullName = studentDto.FullName,
                Birthday = studentDto.Birthday
            };

            _context.Students.Add(student);
            await _context.SaveChangesAsync();

            // Load thêm thông tin Class và User để trả về
            await _context.Entry(student)
                .Reference(s => s.Class)
                .LoadAsync();
            await _context.Entry(student)
                .Reference(s => s.User)
                .LoadAsync();

            var response = new StudentResponseDto
            {
                Id = student.Id,
                UserId = student.UserId,
                ClassId = student.ClassId,
                StudentCode = student.StudentCode,
                FullName = student.FullName,
                Birthday = student.Birthday,
                ClassName = student.Class?.ClassName ?? "",
                UserName = student.User?.Username ?? "",
                Email = student.User?.Email ?? ""
            };

            return CreatedAtAction(nameof(GetStudent), new { id = student.Id }, response);
        }

        // PUT: api/Students/5 (Cập nhật)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutStudent(int id, StudentCreateDto studentDto)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            // Kiểm tra User tồn tại
            var user = await _context.Users.FindAsync(studentDto.UserId);
            if (user == null)
            {
                return BadRequest(new { message = $"User với Id = {studentDto.UserId} không tồn tại" });
            }

            // Kiểm tra Class tồn tại
            var classEntity = await _context.Classes.FindAsync(studentDto.ClassId);
            if (classEntity == null)
            {
                return BadRequest(new { message = $"Class với Id = {studentDto.ClassId} không tồn tại" });
            }

            // Cập nhật thông tin
            student.UserId = studentDto.UserId;
            student.ClassId = studentDto.ClassId;
            student.StudentCode = studentDto.StudentCode;
            student.FullName = studentDto.FullName;
            student.Birthday = studentDto.Birthday;

            _context.Entry(student).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}