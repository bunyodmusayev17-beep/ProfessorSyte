using WebSyteProffessor.Entities;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services;

public class WatchProgressService : IWatchProgressService
{
    private readonly IBaseRepository<WatchProgress> _watchProgressRepository;

    public WatchProgressService(IBaseRepository<WatchProgress> watchProgressRepository)
    {
        _watchProgressRepository = watchProgressRepository;
    }

    public async Task MarkAsWatchedAsync(long videoId, string userId)
    {
        var all = await _watchProgressRepository.GetAllAsync();
        var existing = all.FirstOrDefault(w => w.VideoId == videoId && w.UserId == userId);

        if (existing is not null)
        {
            existing.IsCompleted = true;
            existing.LastWatchedAt = DateTime.UtcNow;
            await _watchProgressRepository.UpdateAsync(existing);
            return;
        }

        var progress = new WatchProgress
        {
            VideoId = videoId,
            UserId = userId,
            IsCompleted = true
        };

        await _watchProgressRepository.AddAsync(progress);
    }

    public async Task<List<WatchProgress>> GetMyProgressAsync(string userId)
    {
        var all = await _watchProgressRepository.GetAllAsync(w => w.Video);
        return all.Where(w => w.UserId == userId).OrderByDescending(w => w.LastWatchedAt).ToList();
    }
}