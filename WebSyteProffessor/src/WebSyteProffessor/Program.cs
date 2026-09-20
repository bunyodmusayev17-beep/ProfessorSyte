using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebSyteProffessor.Data;
using WebSyteProffessor.Entities;
using WebSyteProffessor.Repositories;
using WebSyteProffessor.Services;

var builder = WebApplication.CreateBuilder(args);

// ============================================
// 1. DATABASE (PostgreSQL + EF Core)
// ============================================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// ============================================
// 2. IDENTITY
// ============================================
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// ============================================
// 3. CONTROLLERS
// ============================================
builder.Services.AddControllers();


// ============================================
// 4. REPOSITORY + SERVICE (DI)
// ============================================
builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IVideoService, VideoService>();
// ============================================
// 5. SWAGGER (Swashbuckle)
// ============================================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ============================================
// 6. CORS (React frontend bilan ishlashi uchun)
// ============================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// ============================================
// MIDDLEWARE PIPELINE
// ============================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();