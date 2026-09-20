namespace WebSyteProffessor.Dtos.Category
{
    public class CategoryDto
    {
        public long CategoryId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? IconUrl { get; set; }
        public int VideoCount { get; set; }
    }
}
