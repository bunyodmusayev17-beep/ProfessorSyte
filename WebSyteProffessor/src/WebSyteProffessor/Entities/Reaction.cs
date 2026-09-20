namespace WebSyteProffessor.Entities;

public class Reaction
{
    public long ReactionId { get; set; }
    public ReactionType Type { get; set; }

    public long VideoId { get; set; }
    public Video Video { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
}
