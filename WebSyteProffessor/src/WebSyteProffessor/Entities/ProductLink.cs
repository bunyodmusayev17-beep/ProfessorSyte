namespace WebSyteProffessor.Entities;

public class ProductLink
{
    public long ProductLinkId { get; set; }
    public string StoreName { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public string Url { get; set; } = string.Empty;

    public long VideoId { get; set; }
    public Video Video { get; set; } = null!;
}