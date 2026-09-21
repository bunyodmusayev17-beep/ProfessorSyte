namespace WebSyteProffessor.Dtos.Comment;

public class CreateCommentDto
{
    public long VideoId { get; set; }
    public string Text { get; set; } = string.Empty;
}