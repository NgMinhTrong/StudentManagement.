using Microsoft.EntityFrameworkCore;
using ConnectDB.Models;

namespace ConnectDB.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // DbSets
    public DbSet<Student> Students { get; set; }
    public DbSet<Class> Classes { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<Score> Scores { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<TeachingAssignment> TeachingAssignments { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Cấu hình quan hệ nhiều-nhiều giữa User và Role
        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId);

        // Cấu hình quan hệ 1-1 giữa User và Student
        modelBuilder.Entity<Student>()
            .HasOne(s => s.User)
            .WithOne(u => u.Student)
            .HasForeignKey<Student>(s => s.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình quan hệ 1-1 giữa User và Teacher
        modelBuilder.Entity<Teacher>()
            .HasOne(t => t.User)
            .WithOne(u => u.Teacher)
            .HasForeignKey<Teacher>(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình quan hệ 1-N giữa Class và Student
        modelBuilder.Entity<Student>()
            .HasOne(s => s.Class)
            .WithMany(c => c.Students)
            .HasForeignKey(s => s.ClassId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình quan hệ 1-N giữa Teacher và TeachingAssignment
        modelBuilder.Entity<TeachingAssignment>()
            .HasOne(ta => ta.Teacher)
            .WithMany(t => t.TeachingAssignments)
            .HasForeignKey(ta => ta.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình quan hệ 1-N giữa Class và TeachingAssignment
        modelBuilder.Entity<TeachingAssignment>()
            .HasOne(ta => ta.Class)
            .WithMany(c => c.TeachingAssignments)
            .HasForeignKey(ta => ta.ClassId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình quan hệ 1-N giữa Subject và TeachingAssignment
        modelBuilder.Entity<TeachingAssignment>()
            .HasOne(ta => ta.Subject)
            .WithMany(s => s.TeachingAssignments)
            .HasForeignKey(ta => ta.SubjectId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình quan hệ 1-N giữa Student và Score
        modelBuilder.Entity<Score>()
            .HasOne(s => s.Student)
            .WithMany(st => st.Scores)
            .HasForeignKey(s => s.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình quan hệ 1-N giữa Subject và Score
        modelBuilder.Entity<Score>()
            .HasOne(s => s.Subject)
            .WithMany(sub => sub.Scores)
            .HasForeignKey(s => s.SubjectId)
            .OnDelete(DeleteBehavior.Restrict);

        // Cấu hình computed column cho AverageScore trong bảng Score
        modelBuilder.Entity<Score>()
            .Property(s => s.AverageScore)
            .HasComputedColumnSql("(ISNULL(Score15Min,0) + ISNULL(Score45Min,0)*2 + ISNULL(ScoreFinal,0)*3) / 6");
    }
}