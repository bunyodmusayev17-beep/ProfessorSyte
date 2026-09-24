namespace WebSyteProffessor.Dtos.Video;

/// <summary>
/// Sent as multipart/form-data so a custom card thumbnail can be uploaded with
/// the video. Product links are bound as indexed form keys, e.g.
/// ProductLinks[0].StoreName / ProductLinks[0].ProductName / ProductLinks[0].Url
/// </summary>
public class CreateVideoDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string YoutubeUrl { get; set; } = string.Empty;
    public long CategoryId { get; set; }
    public bool IsExclusive { get; set; }
    public long? ProjectId { get; set; }

    /// <summary>
    /// Optional card image. When omitted, the YouTube thumbnail is used.
    /// </summary>
    public IFormFile? Thumbnail { get; set; }

    public List<CreateProductLinkDto> ProductLinks { get; set; } = new();
}
