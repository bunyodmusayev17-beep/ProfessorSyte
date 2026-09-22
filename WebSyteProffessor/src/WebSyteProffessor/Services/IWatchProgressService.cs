using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Services;

public interface IWatchProgressService
{
    Task MarkAsWatchedAsync(long videoId, string userId);
    Task<List<WatchProgress>> GetMyProgressAsync(string userId);
}