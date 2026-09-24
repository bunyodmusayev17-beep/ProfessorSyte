using WebSyteProffessor.Exceptions;

namespace WebSyteProffessor.Services;

public class FileUploadService : IFileUploadService
{
    private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB
    private const string UploadsRoot = "uploads";

    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<FileUploadService> _logger;

    public FileUploadService(IWebHostEnvironment environment, ILogger<FileUploadService> logger)
    {
        _environment = environment;
        _logger = logger;
    }

    public async Task<string> SaveImageAsync(IFormFile file, string folder)
    {
        if (file is null || file.Length == 0)
            throw new BadRequestException("Uploaded file is empty");

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!AllowedExtensions.Contains(extension))
            throw new BadRequestException(
                $"Unsupported file type: {extension}. Allowed: {string.Join(", ", AllowedExtensions)}");

        if (file.Length > MaxFileSizeBytes)
            throw new BadRequestException("File is too large. Maximum size is 5MB");

        var fileName = $"{Guid.NewGuid()}{extension}";
        var uploadsPath = Path.Combine(GetWebRootPath(), UploadsRoot, folder);

        Directory.CreateDirectory(uploadsPath);

        var filePath = Path.Combine(uploadsPath, fileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        return $"/{UploadsRoot}/{folder}/{fileName}";
    }

    public void DeleteImage(string? relativeUrl)
    {
        // Preset icon keys and remote URLs are not ours to delete.
        if (string.IsNullOrWhiteSpace(relativeUrl) || !relativeUrl.StartsWith($"/{UploadsRoot}/"))
            return;

        var webRoot = GetWebRootPath();
        var fullPath = Path.GetFullPath(Path.Combine(webRoot, relativeUrl.TrimStart('/')));

        // Guard against a crafted "../" path escaping the uploads directory.
        var uploadsRootPath = Path.GetFullPath(Path.Combine(webRoot, UploadsRoot));
        if (!fullPath.StartsWith(uploadsRootPath, StringComparison.OrdinalIgnoreCase))
            return;

        try
        {
            if (File.Exists(fullPath))
                File.Delete(fullPath);
        }
        catch (IOException ex)
        {
            // A leftover file is not worth failing the request over.
            _logger.LogWarning(ex, "Could not delete upload {Path}", fullPath);
        }
    }

    /// <summary>
    /// WebRootPath is null until wwwroot exists on disk, which is the case in a
    /// fresh container before the first upload.
    /// </summary>
    private string GetWebRootPath()
    {
        if (!string.IsNullOrEmpty(_environment.WebRootPath))
            return _environment.WebRootPath;

        var fallback = Path.Combine(_environment.ContentRootPath, "wwwroot");
        Directory.CreateDirectory(fallback);
        return fallback;
    }
}
