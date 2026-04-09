using ConnectDB.Models;
using Microsoft.EntityFrameworkCore;

namespace ConnectDB.Data;

public static class DbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        context.Database.EnsureCreated();

        // Seed Roles
        if (!context.Roles.Any())
        {
            var roles = new Role[]
            {
                new Role { RoleName = "Admin", Description = "Quản trị viên hệ thống" },
                new Role { RoleName = "Teacher", Description = "Giáo viên" },
                new Role { RoleName = "Student", Description = "Học sinh" }
            };
            context.Roles.AddRange(roles);
            context.SaveChanges();
        }

        // Seed Subjects (Môn học)
        if (!context.Subjects.Any())
        {
            var subjects = new Subject[]
            {
                new Subject { SubjectName = "Toán", Credits = 4, SubjectType = "Theory" },
                new Subject { SubjectName = "Ngữ Văn", Credits = 3, SubjectType = "Theory" },
                new Subject { SubjectName = "Tiếng Anh", Credits = 3, SubjectType = "Practice" }
            };
            context.Subjects.AddRange(subjects);
            context.SaveChanges();
        }
    }
}