using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Services;

public interface IVideoService
{
    Task<List<Video>> GetAllAsync();
    Task<Video> GetByIdAsync(long videoId);
    Task<List<Video>> GetByCategoryIdAsync(long categoryId);
    Task<Video> CreateAsync(string title, string description, string youtubeUrl, long categoryId, bool isExclusive, long? projectId, List<(string StoreName, string ProductName, string Url)> productLinks);
    Task UpdateAsync(long videoId, string title, string description, string youtubeUrl, long categoryId, bool isExclusive, long? projectId, List<(string StoreName, string ProductName, string Url)> productLinks);
    Task DeleteAsync(long videoId);
    Task IncrementViewCountAsync(long videoId);
}