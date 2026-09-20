namespace WebSyteProffessor.Entities;

public class Tag
{
    public long TagId { get; set; }
    public string Name { get; set; } = string.Empty;

    public List<VideoTag> VideoTags { get; set; } = new();
}
