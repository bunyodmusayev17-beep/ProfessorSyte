using WebSyteProffessor.Repositories;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Configurations;

public static class DependencyInjectionConfigurations
{
    public static void AddDependencyInjectionConfigurations(this WebApplicationBuilder builder)
    {
        builder.Services.AddScoped(typeof(IBaseRepository<>), typeof(BaseRepository<>));
        builder.Services.AddScoped<ICategoryService, CategoryService>();
        builder.Services.AddScoped<IVideoService, VideoService>();
        builder.Services.AddScoped<ITokenService, TokenService>();
        builder.Services.AddScoped<ICommentService, CommentService>();
        builder.Services.AddScoped<IReactionService, ReactionService>();
    }
}