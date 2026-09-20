using Microsoft.AspNetCore.Identity;

namespace WebSyteProffessor.Configurations;

public static class RoleSeederConfigurations
{
    public static async Task SeedRolesAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

        string[] roles = { "User", "Admin" };

        foreach (var role in roles)
        {
            var exists = await roleManager.RoleExistsAsync(role);
            if (!exists)
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }
}