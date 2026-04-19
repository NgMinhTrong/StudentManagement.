using Microsoft.EntityFrameworkCore;
using ConnectDB.Models;
using static BCrypt.Net.BCrypt;

namespace ConnectDB.Data
{
    public static class DbSeeder
    {
        public static async Task SeedAll(AppDbContext context)
        {
            // 1. Roles
            if (!context.Roles.Any())
            {
                context.Roles.AddRange(
                    new Role { RoleName = "Admin", Description = "Quản trị viên hệ thống" },
                    new Role { RoleName = "Teacher", Description = "Giáo viên giảng dạy" },
                    new Role { RoleName = "Student", Description = "Học sinh/Sinh viên" }
                );
                await context.SaveChangesAsync();
            }

            var adminRole = await context.Roles.FirstAsync(r => r.RoleName == "Admin");
            var teacherRole = await context.Roles.FirstAsync(r => r.RoleName == "Teacher");
            var studentRole = await context.Roles.FirstAsync(r => r.RoleName == "Student");

            // 2. Users & UserRoles
            if (context.Users.Count() < 5)
            {
                var users = new List<User>();
                // Add Admin
                users.Add(new User { Username = "admin", PasswordHash = HashPassword("admin123"), FullName = "Quản trị viên", Email = "admin@system.com" });
                
                // Add 5 Teachers
                for (int i = 1; i <= 5; i++)
                {
                    users.Add(new User { Username = $"teacher{i}", PasswordHash = HashPassword("123456"), FullName = $"Giáo viên {i}", Email = $"teacher{i}@school.edu.vn" });
                }

                // Add 15 Students
                string[] studentNames = { "Nguyễn Văn An", "Trần Thị Bình", "Lê Văn Cường", "Phạm Minh Đức", "Hoàng Kim Liên", "Vũ Huy Hoàng", "Đỗ Bảo Ngọc", "Ngô Thành Nam", "Bùi Hồng Hạnh", "Lý Thanh Tùng", "Trịnh Xuân Bắc", "Đinh Tuyết Mai", "Quách Công Minh", "Lương Thu Trang", "Hồ Mạnh Hùng" };
                for (int i = 0; i < studentNames.Length; i++)
                {
                    users.Add(new User { Username = $"student{i+1}", PasswordHash = HashPassword("123456"), FullName = studentNames[i], Email = $"student{i+1}@st.school.edu.vn" });
                }

                context.Users.AddRange(users);
                await context.SaveChangesAsync();

                // Assign Roles
                foreach (var u in users)
                {
                    if (u.Username == "admin") 
                        context.UserRoles.Add(new UserRole { UserId = u.Id, RoleId = adminRole.Id });
                    else if (u.Username.StartsWith("teacher"))
                        context.UserRoles.Add(new UserRole { UserId = u.Id, RoleId = teacherRole.Id });
                    else
                        context.UserRoles.Add(new UserRole { UserId = u.Id, RoleId = studentRole.Id });
                }
                await context.SaveChangesAsync();
            }

            // 3. Classes
            if (!context.Classes.Any())
            {
                context.Classes.AddRange(
                    new Class { ClassName = "10A1", Grade = 10, AcademicYear = "2024-2025", RoomNumber = "P.101" },
                    new Class { ClassName = "10A2", Grade = 10, AcademicYear = "2024-2025", RoomNumber = "P.102" },
                    new Class { ClassName = "11B1", Grade = 11, AcademicYear = "2024-2025", RoomNumber = "P.201" },
                    new Class { ClassName = "11B2", Grade = 11, AcademicYear = "2024-2025", RoomNumber = "P.202" },
                    new Class { ClassName = "12C1", Grade = 12, AcademicYear = "2024-2025", RoomNumber = "P.301" }
                );
                await context.SaveChangesAsync();
            }

            // 4. Subjects
            if (!context.Subjects.Any())
            {
                context.Subjects.AddRange(
                    new Subject { SubjectName = "Toán học", Credits = 4, SubjectType = "Theory" },
                    new Subject { SubjectName = "Ngữ văn", Credits = 4, SubjectType = "Theory" },
                    new Subject { SubjectName = "Tiếng Anh", Credits = 3, SubjectType = "Both" },
                    new Subject { SubjectName = "Vật lý", Credits = 3, SubjectType = "Both" },
                    new Subject { SubjectName = "Hóa học", Credits = 3, SubjectType = "Both" },
                    new Subject { SubjectName = "Sinh học", Credits = 2, SubjectType = "Theory" },
                    new Subject { SubjectName = "Lịch sử", Credits = 2, SubjectType = "Theory" },
                    new Subject { SubjectName = "Địa lý", Credits = 2, SubjectType = "Theory" },
                    new Subject { SubjectName = "Tin học", Credits = 2, SubjectType = "Practice" },
                    new Subject { SubjectName = "GDTC", Credits = 1, SubjectType = "Practice" }
                );
                await context.SaveChangesAsync();
            }

            // 5. Teachers
            if (!context.Teachers.Any())
            {
                var teacherUsers = await context.Users.Where(u => u.Username.StartsWith("teacher")).ToListAsync();
                string[] specs = { "Toán học", "Ngữ văn", "Tiếng Anh", "Vật lý", "Hóa học" };
                for (int i = 0; i < teacherUsers.Count; i++)
                {
                    context.Teachers.Add(new Teacher 
                    { 
                        UserId = teacherUsers[i].Id, 
                        TeacherCode = $"GV{100 + i}", 
                        FullName = teacherUsers[i].FullName,
                        Specialization = specs[i % specs.Length],
                        HireDate = DateTime.Now.AddYears(-i)
                    });
                }
                await context.SaveChangesAsync();
            }

            // 6. Students
            if (!context.Students.Any())
            {
                var studentUsers = await context.Users.Where(u => u.Username.StartsWith("student")).ToListAsync();
                var allClasses = await context.Classes.ToListAsync();
                for (int i = 0; i < studentUsers.Count; i++)
                {
                    context.Students.Add(new Student
                    {
                        UserId = studentUsers[i].Id,
                        ClassId = allClasses[i % allClasses.Count].Id,
                        StudentCode = $"SV24{1000 + i}",
                        FullName = studentUsers[i].FullName,
                        Birthday = DateTime.Now.AddYears(-16).AddDays(i * 10)
                    });
                }
                await context.SaveChangesAsync();
            }

            // 7. TeachingAssignments
            if (!context.TeachingAssignments.Any())
            {
                var allTeachers = await context.Teachers.ToListAsync();
                var allClasses = await context.Classes.ToListAsync();
                var allSubjects = await context.Subjects.ToListAsync();
                
                foreach (var cls in allClasses)
                {
                    for (int i = 0; i < 3; i++) // Mỗi lớp gán 3 môn mẫu
                    {
                        context.TeachingAssignments.Add(new TeachingAssignment
                        {
                            TeacherId = allTeachers[i % allTeachers.Count].Id,
                            ClassId = cls.Id,
                            SubjectId = allSubjects[i % allSubjects.Count].Id,
                            Semester = "1",
                            SchoolYear = "2024-2025"
                        });
                    }
                }
                await context.SaveChangesAsync();
            }

            // 8. Scores
            if (!context.Scores.Any())
            {
                var allStudents = await context.Students.ToListAsync();
                var allSubjects = await context.Subjects.Take(3).ToListAsync();
                var random = new Random();

                foreach (var std in allStudents)
                {
                    foreach (var sub in allSubjects)
                    {
                        context.Scores.Add(new Score
                        {
                            StudentId = std.Id,
                            SubjectId = sub.Id,
                            Semester = "HK1",
                            Score15Min = Math.Round(random.NextDouble() * 10, 1),
                            Score45Min = Math.Round(random.NextDouble() * 10, 1),
                            ScoreFinal = Math.Round(random.NextDouble() * 10, 1),
                            TeacherRemarks = "Cần cố gắng hơn"
                        });
                    }
                }
                await context.SaveChangesAsync();
            }

            // 9. Notifications
            if (!context.Notifications.Any())
            {
                var someStudents = await context.Students.Take(5).ToListAsync();
                foreach (var std in someStudents)
                {
                    context.Notifications.Add(new Notification
                    {
                        StudentId = std.Id,
                        Title = "Chào mừng bạn",
                        Message = $"Chào mừng {std.FullName} đã tham gia hệ thống quản lý sinh viên.",
                        CreatedAt = DateTime.Now
                    });
                }
                await context.SaveChangesAsync();
            }
        }
    }
}
