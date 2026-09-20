namespace WebSyteProffessor.Entities;

public class Comment
{
    public long CommentId { get; set; }
    public string Text { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public long VideoId { get; set; }
    public Video Video { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
}
