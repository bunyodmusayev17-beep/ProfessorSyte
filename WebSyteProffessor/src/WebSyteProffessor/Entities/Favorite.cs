namespace WebSyteProffessor.Entities;

public class Favorite
{
    public long FavoriteId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public long VideoId { get; set; }
    public Video Video { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
}
