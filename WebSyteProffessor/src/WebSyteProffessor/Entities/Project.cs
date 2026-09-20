namespace WebSyteProffessor.Entities;

public class Project
{
    public long ProjectId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<ProjectImage> Images { get; set; } = new();
    public List<Video> Videos { get; set; } = new();
}
