namespace WebSyteProffessor.Dtos.Category
{
    public class UpdateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
    }
}
