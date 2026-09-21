using WebSyteProffessor.Entities;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services;

public class ReactionService : IReactionService
{
    private readonly IBaseRepository<Reaction> _reactionRepository;

    public ReactionService(IBaseRepository<Reaction> reactionRepository)
    {
        _reactionRepository = reactionRepository;
    }

    public async Task SetReactionAsync(long videoId, string userId, ReactionType type)
    {
        var all = await _reactionRepository.GetAllAsync();
        var existing = all.FirstOrDefault(r => r.VideoId == videoId && r.UserId == userId);

        if (existing is null)
        {
            var reaction = new Reaction
            {
                VideoId = videoId,
                UserId = userId,
                Type = type
            };
            await _reactionRepository.AddAsync(reaction);
            return;
        }

        if (existing.Type == type)
        {
            // Same reaction sent again -> remove it (toggle off)
            await _reactionRepository.DeleteAsync(existing);
            return;
        }

        // Different reaction -> update it
        existing.Type = type;
        await _reactionRepository.UpdateAsync(existing);
    }

    public async Task RemoveReactionAsync(long videoId, string userId)
    {
        var all = await _reactionRepository.GetAllAsync();
        var existing = all.FirstOrDefault(r => r.VideoId == videoId && r.UserId == userId);

        if (existing is not null)
        {
            await _reactionRepository.DeleteAsync(existing);
        }
    }

    public async Task<(int LikeCount, int DislikeCount)> GetCountsAsync(long videoId)
    {
        var all = await _reactionRepository.GetAllAsync();
        var videoReactions = all.Where(r => r.VideoId == videoId).ToList();

        var likeCount = videoReactions.Count(r => r.Type == ReactionType.Like);
        var dislikeCount = videoReactions.Count(r => r.Type == ReactionType.Dislike);

        return (likeCount, dislikeCount);
    }
}