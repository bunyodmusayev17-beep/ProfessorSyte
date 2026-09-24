namespace WebSyteProffessor.Dtos.Category;

/// <summary>
/// Sent as multipart/form-data. Images are only replaced when a new file (or a
/// new preset key) arrives; the explicit Remove flags clear them instead.
/// </summary>
public class UpdateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public string? IconKey { get; set; }
    public IFormFile? IconFile { get; set; }
    public IFormFile? CoverImage { get; set; }

    public bool RemoveIcon { get; set; }
    public bool RemoveCoverImage { get; set; }
}
