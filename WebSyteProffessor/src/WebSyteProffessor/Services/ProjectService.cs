using WebSyteProffessor.Entities;
using WebSyteProffessor.Exceptions;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services;

public class ProjectService : IProjectService
{
    private readonly IBaseRepository<Project> _projectRepository;
    private readonly IFileUploadService _fileUploadService;

    public ProjectService(IBaseRepository<Project> projectRepository, IFileUploadService fileUploadService)
    {
        _projectRepository = projectRepository;
        _fileUploadService = fileUploadService;
    }

    public async Task<List<Project>> GetAllAsync()
    {
        return await _projectRepository.GetAllAsync(p => p.Images);
    }

    public async Task<Project> GetByIdAsync(long projectId)
    {
        var project = await _projectRepository.GetByIdAsync(projectId, p => p.Images);
        if (project is null)
            throw new NotFoundException($"Project not found (projectId: {projectId})");

        return project;
    }

    public async Task<Project> CreateAsync(string title, string description, List<IFormFile> images)
    {
        var project = new Project
        {
            Title = title,
            Description = description
        };

        foreach (var image in images)
        {
            var imageUrl = await _fileUploadService.SaveImageAsync(image, "projects");
            project.Images.Add(new ProjectImage { ImageUrl = imageUrl });
        }

        return await _projectRepository.AddAsync(project);
    }

    public async Task DeleteAsync(long projectId)
    {
        var project = await GetByIdAsync(projectId);
        await _projectRepository.DeleteAsync(project);
    }
}