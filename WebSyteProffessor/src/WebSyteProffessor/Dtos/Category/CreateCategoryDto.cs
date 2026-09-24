namespace WebSyteProffessor.Dtos.Category;

/// <summary>
/// Sent as multipart/form-data so the category card image can be uploaded
/// together with the text fields.
/// </summary>
public class CreateCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    /// <summary>
    /// A preset icon key chosen in the admin UI (e.g. "preset:arduino").
    /// Ignored when <see cref="IconFile"/> is provided.
    /// </summary>
    public string? IconKey { get; set; }

    /// <summary>Custom icon image, used instead of a preset key.</summary>
    public IFormFile? IconFile { get; set; }

    /// <summary>Wide photo used as the category card background.</summary>
    public IFormFile? CoverImage { get; set; }
}
