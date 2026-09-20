namespace WebSyteProffessor.Entities;

public class Rating
{
    public long RatingId { get; set; }
    public int Stars { get; set; } // 1-5

    public long VideoId { get; set; }
    public Video Video { get; set; } = null!;

    public string UserId { get; set; } = string.Empty;
    public ApplicationUser User { get; set; } = null!;
}
