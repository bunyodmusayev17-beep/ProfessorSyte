namespace WebSyteProffessor.Dtos.Video;

public class VideoDto
{
    public long VideoId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string YoutubeUrl { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
    public bool IsExclusive { get; set; }
    public int ViewCount { get; set; }
    public long CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public long? ProjectId { get; set; }
    public List<ProductLinkDto> ProductLinks { get; set; } = new();
}

