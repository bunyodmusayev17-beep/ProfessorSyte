namespace WebSyteProffessor.Services;

public interface IFileUploadService
{
    /// <summary>
    /// Validates and stores an uploaded image under wwwroot/uploads/{folder},
    /// returning the public relative URL (e.g. "/uploads/categories/{guid}.png").
    /// </summary>
    Task<string> SaveImageAsync(IFormFile file, string folder);

    /// <summary>
    /// Deletes a file previously returned by <see cref="SaveImageAsync"/>.
    /// Ignores values that are not local upload paths (preset keys, remote URLs)
    /// and files that are already gone.
    /// </summary>
    void DeleteImage(string? relativeUrl);
}
