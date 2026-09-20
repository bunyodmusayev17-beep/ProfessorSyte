using Microsoft.EntityFrameworkCore;
using WebSyteProffessor.Data;

namespace WebSyteProffessor.Configurations;

public static class DatabaseConfigurations
{
    public static void AddDatabaseConfigurations(this WebApplicationBuilder builder)
    {
        builder.Services.AddDbContext<AppDbContext>(options =>
            options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
    }
}