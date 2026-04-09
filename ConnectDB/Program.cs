using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.DTOs; // Thêm dòng này

var builder = WebApplication.CreateBuilder(args);

// Đăng ký kết nối SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Bỏ qua vòng lặp vô hạn khi serialize
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    // Tùy chỉnh Swagger để hiểu DTO
    c.UseInlineDefinitionsForEnums();
});

var app = builder.Build();

// Cấu hình Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();