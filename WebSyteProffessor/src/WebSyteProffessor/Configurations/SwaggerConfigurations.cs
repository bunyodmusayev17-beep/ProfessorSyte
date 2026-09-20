namespace WebSyteProffessor.Configurations;

public static class SwaggerConfigurations
{
    public static void AddSwaggerConfigurations(this WebApplicationBuilder builder)
    {
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
    }
}
