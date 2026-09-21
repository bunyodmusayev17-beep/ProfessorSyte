using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Services;

public interface IReactionService
{
    Task SetReactionAsync(long videoId, string userId, ReactionType type);
    Task RemoveReactionAsync(long videoId, string userId);
    Task<(int LikeCount, int DislikeCount)> GetCountsAsync(long videoId);
}