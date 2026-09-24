namespace WebSyteProffessor.Entities;

public class Category
{
    public long CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    /// <summary>
    /// Small icon shown next to the category name. Either a preset key handled by
    /// the frontend (e.g. "preset:arduino") or an uploaded file path.
    /// </summary>
    public string? IconUrl { get; set; }

    /// <summary>
    /// Wide photo used as the category card background.
    /// </summary>
    public string? CoverImageUrl { get; set; }


    public List<Video> Videos { get; set; } = new();
}
