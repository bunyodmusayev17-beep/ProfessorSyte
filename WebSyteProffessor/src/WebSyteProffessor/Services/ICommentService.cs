using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Services;

public interface ICommentService
{
    Task<List<Comment>> GetByVideoIdAsync(long videoId);
    Task<Comment> CreateAsync(long videoId, string userId, string text);
    Task UpdateAsync(long commentId, string currentUserId, string text);
    Task DeleteAsync(long commentId, string currentUserId, bool isAdmin);
}