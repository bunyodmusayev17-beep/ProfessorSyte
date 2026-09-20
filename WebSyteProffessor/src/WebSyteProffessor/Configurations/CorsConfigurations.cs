namespace WebSyteProffessor.Configurations;

public static class CorsConfigurations
{
    public static void AddCorsConfigurations(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                      .AllowAnyHeader()
                      .AllowAnyMethod();
            });
        });
    }
}