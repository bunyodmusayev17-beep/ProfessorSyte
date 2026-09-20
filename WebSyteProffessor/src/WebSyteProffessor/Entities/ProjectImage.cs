namespace WebSyteProffessor.Entities;

public class ProjectImage
{
    public long ProjectImageId { get; set; }
    public string ImageUrl { get; set; } = string.Empty;

    public long ProjectId { get; set; }
    public Project Project { get; set; } = null!;
}