namespace WebSyteProffessor.Dtos.Project;

public class CreateProjectDto
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public List<IFormFile> Images { get; set; } = new();
}