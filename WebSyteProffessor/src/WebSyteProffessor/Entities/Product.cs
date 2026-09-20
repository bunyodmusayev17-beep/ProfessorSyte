namespace WebSyteProffessor.Entities;

public class Product
{
    public long ProductId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public string? SourceStoreName { get; set; } // masalan "AliExpress"
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<ProductReview> Reviews { get; set; } = new();
}
