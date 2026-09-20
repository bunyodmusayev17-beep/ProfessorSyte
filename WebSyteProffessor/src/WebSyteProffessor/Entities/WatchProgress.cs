namespace WebSyteProffessor.Entities;

public class WatchProgress
{
    public long WatchProgressId { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime LastWatchedAt { get; set; } = DateTime.UtcNow;

    public long VideoId { get; set; }
    public Video Video { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
}
