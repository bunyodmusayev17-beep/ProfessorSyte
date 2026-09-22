using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebSyteProffessor.Dtos.Project;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var projects = await _projectService.GetAllAsync();
        return Ok(projects.Select(MapToDto).ToList());
    }

    [HttpGet("{projectId}")]
    public async Task<IActionResult> GetById(long projectId)
    {
        var project = await _projectService.GetByIdAsync(projectId);
        return Ok(MapToDto(project));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] CreateProjectDto dto)
    {
        var project = await _projectService.CreateAsync(dto.Title, dto.Description, dto.Images);
        return CreatedAtAction(nameof(GetById), new { projectId = project.ProjectId }, MapToDto(project));
    }

    [HttpDelete("{projectId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(long projectId)
    {
        await _projectService.DeleteAsync(projectId);
        return NoContent();
    }

    private static ProjectDto MapToDto(Entities.Project project)
    {
        return new ProjectDto
        {
            ProjectId = project.ProjectId,
            Title = project.Title,
            Description = project.Description,
            CreatedAt = project.CreatedAt,
            ImageUrls = project.Images.Select(i => i.ImageUrl).ToList()
        };
    }
}