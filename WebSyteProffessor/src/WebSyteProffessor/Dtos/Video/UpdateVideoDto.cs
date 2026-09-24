namespace WebSyteProffessor.Dtos.Video;

/// <summary>
/// Sent as multipart/form-data. The thumbnail is only replaced when a new file
/// arrives; <see cref="RemoveThumbnail"/> reverts to the YouTube thumbnail.
/// </summary>
public class UpdateVideoDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string YoutubeUrl { get; set; } = string.Empty;
    public long CategoryId { get; set; }
    public bool IsExclusive { get; set; }
    public long? ProjectId { get; set; }

    public IFormFile? Thumbnail { get; set; }

    /// <summary>Drop the custom thumbnail and fall back to the YouTube one.</summary>
    public bool RemoveThumbnail { get; set; }

    public List<CreateProductLinkDto> ProductLinks { get; set; } = new();
}
