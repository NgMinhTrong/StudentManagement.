using Microsoft.AspNetCore.Mvc;
using ConnectDB.Data;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeedController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SeedController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> Seed()
        {
            try
            {
                await DbSeeder.SeedAll(_context);
                return Ok(new { message = "Database seeded successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Seeding failed", error = ex.Message });
            }
        }
    }
}
