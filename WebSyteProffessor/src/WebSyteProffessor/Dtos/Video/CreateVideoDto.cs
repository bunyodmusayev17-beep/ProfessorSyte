namespace WebSyteProffessor.Dtos.Video;

public class CreateVideoDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string YoutubeUrl { get; set; } = string.Empty;
    public long CategoryId { get; set; }
    public bool IsExclusive { get; set; }
    public long? ProjectId { get; set; }
    public List<CreateProductLinkDto> ProductLinks { get; set; } = new();
}

