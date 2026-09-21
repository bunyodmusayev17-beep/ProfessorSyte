using Microsoft.AspNetCore.Identity;
using WebSyteProffessor.Data;
using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Configurations;

public static class IdentityConfigurations
{
    public static void AddIdentityConfigurations(this WebApplicationBuilder builder)
    {
        builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 6;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.User.RequireUniqueEmail = true;
        })
            .AddEntityFrameworkStores<AppDbContext>()
            .AddDefaultTokenProviders();
    }
}