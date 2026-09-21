using WebSyteProffessor.Entities;
using WebSyteProffessor.Exceptions;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services;

public class CommentService : ICommentService
{
    private readonly IBaseRepository<Comment> _commentRepository;

    public CommentService(IBaseRepository<Comment> commentRepository)
    {
        _commentRepository = commentRepository;
    }

    public async Task<List<Comment>> GetByVideoIdAsync(long videoId)
    {
        var all = await _commentRepository.GetAllAsync(c => c.User);
        return all.Where(c => c.VideoId == videoId).OrderByDescending(c => c.CreatedAt).ToList();
    }

    public async Task<Comment> CreateAsync(long videoId, string userId, string text)
    {
        var comment = new Comment
        {
            VideoId = videoId,
            UserId = userId,
            Text = text
        };

        return await _commentRepository.AddAsync(comment);
    }

    public async Task UpdateAsync(long commentId, string currentUserId, string text)
    {
        var comment = await GetOwnedCommentAsync(commentId, currentUserId, isAdmin: false);
        comment.Text = text;
        await _commentRepository.UpdateAsync(comment);
    }

    public async Task DeleteAsync(long commentId, string currentUserId, bool isAdmin)
    {
        var comment = await GetOwnedCommentAsync(commentId, currentUserId, isAdmin);
        await _commentRepository.DeleteAsync(comment);
    }

    private async Task<Comment> GetOwnedCommentAsync(long commentId, string currentUserId, bool isAdmin)
    {
        var comment = await _commentRepository.GetByIdAsync(commentId);
        if (comment is null)
            throw new NotFoundException($"Comment not found (commentId: {commentId})");

        if (comment.UserId != currentUserId && !isAdmin)
            throw new UnauthorizedException("You can only modify your own comment");

        return comment;
    }
}
