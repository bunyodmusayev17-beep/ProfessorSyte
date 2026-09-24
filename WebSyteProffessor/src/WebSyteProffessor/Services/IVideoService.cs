using WebSyteProffessor.Dtos.Video;
using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Services;

public interface IVideoService
{
    Task<List<Video>> GetAllAsync();
    Task<Video> GetByIdAsync(long videoId);
    Task<List<Video>> GetByCategoryIdAsync(long categoryId);
    Task<Video> CreateAsync(CreateVideoDto dto);
    Task UpdateAsync(long videoId, UpdateVideoDto dto);
    Task DeleteAsync(long videoId);
    Task IncrementViewCountAsync(long videoId);
}
