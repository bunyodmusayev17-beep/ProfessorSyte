using Microsoft.AspNetCore.Http;
using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Services;

public interface IProjectService
{
    Task<List<Project>> GetAllAsync();
    Task<Project> GetByIdAsync(long projectId);
    Task<Project> CreateAsync(string title, string description, List<IFormFile> images);
    Task DeleteAsync(long projectId);
}