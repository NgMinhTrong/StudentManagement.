using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;
using static BCrypt.Net.BCrypt;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var user = await _context.Users
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Include(u => u.Student)
                .Include(u => u.Teacher)
                .FirstOrDefaultAsync(u => u.Username == request.Username);

            if (user == null || !Verify(request.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không chính xác." });
            }

            if (!user.IsActive)
            {
                return BadRequest(new { message = "Tài khoản của bạn đã bị khóa." });
            }

            var token = GenerateJwtToken(user);

            var roles = user.UserRoles.Select(ur => ur.Role.RoleName).ToList();

            return Ok(new AuthResponse
            {
                Token = token,
                Id = user.Id,
                Username = user.Username,
                FullName = user.FullName,
                Roles = roles,
                StudentId = user.Student?.Id,
                TeacherId = user.Teacher?.Id
            });
        }

        private string GenerateJwtToken(User user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var key = Encoding.ASCII.GetBytes(jwtSettings["Key"] ?? "SecretKeyDefaultValue32CharsLong!!");

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim("FullName", user.FullName)
            };

            // Thêm các Roles vào Claims
            foreach (var userRole in user.UserRoles)
            {
                claims.Add(new Claim(ClaimTypes.Role, userRole.Role.RoleName));
            }

            // Thêm ID Student/Teacher nếu có
            if (user.Student != null) claims.Add(new Claim("StudentId", user.Student.Id.ToString()));
            if (user.Teacher != null) claims.Add(new Claim("TeacherId", user.Teacher.Id.ToString()));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
