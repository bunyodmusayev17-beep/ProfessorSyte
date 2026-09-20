namespace WebSyteProffessor.Entities;

public class Video
{
    public long VideoId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string YoutubeUrl { get; set; } = string.Empty;
    public string YoutubeVideoId { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public bool IsExclusive { get; set; }
    public int ViewCount { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public long CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public long? ProjectId { get; set; }

    public List<ProductLink> ProductLinks { get; set; } = new();
    public List<VideoTag> VideoTags { get; set; } = new();
}
