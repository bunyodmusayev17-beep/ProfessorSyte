namespace WebSyteProffessor.Entities;

public class Category
{
    public long CategoryId { get; set; }
    public string Name { get; set; }

    public string? Description { get; set; }
    public string? IconUrl { get; set; }


    public List<Video> Videos { get; set; } = new();
}
