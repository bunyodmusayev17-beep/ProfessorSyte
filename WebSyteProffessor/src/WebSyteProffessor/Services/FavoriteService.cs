using WebSyteProffessor.Entities;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services;

public class FavoriteService : IFavoriteService
{
    private readonly IBaseRepository<Favorite> _favoriteRepository;

    public FavoriteService(IBaseRepository<Favorite> favoriteRepository)
    {
        _favoriteRepository = favoriteRepository;
    }

    public async Task AddAsync(long videoId, string userId)
    {
        var all = await _favoriteRepository.GetAllAsync();
        var existing = all.FirstOrDefault(f => f.VideoId == videoId && f.UserId == userId);

        if (existing is not null)
            return; // Already favorited, do nothing

        var favorite = new Favorite
        {
            VideoId = videoId,
            UserId = userId
        };

        await _favoriteRepository.AddAsync(favorite);
    }

    public async Task RemoveAsync(long videoId, string userId)
    {
        var all = await _favoriteRepository.GetAllAsync();
        var existing = all.FirstOrDefault(f => f.VideoId == videoId && f.UserId == userId);

        if (existing is not null)
        {
            await _favoriteRepository.DeleteAsync(existing);
        }
    }

    public async Task<List<Favorite>> GetMyFavoritesAsync(string userId)
    {
        var all = await _favoriteRepository.GetAllAsync(f => f.Video);
        return all.Where(f => f.UserId == userId).OrderByDescending(f => f.CreatedAt).ToList();
    }

    public async Task<bool> IsFavoritedAsync(long videoId, string userId)
    {
        var all = await _favoriteRepository.GetAllAsync();
        return all.Any(f => f.VideoId == videoId && f.UserId == userId);
    }
}