using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Services;

public interface IFavoriteService
{
    Task AddAsync(long videoId, string userId);
    Task RemoveAsync(long videoId, string userId);
    Task<List<Favorite>> GetMyFavoritesAsync(string userId);
    Task<bool> IsFavoritedAsync(long videoId, string userId);
}