namespace WebSyteProffessor.Services;

public interface IFileUploadService
{
    Task<string> SaveImageAsync(IFormFile file, string folder);
}