using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebSyteProffessor.Entities;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly IVideoService _videoService;
    private readonly ICommentService _commentService;
    private readonly IReactionService _reactionService;
    private readonly UserManager<ApplicationUser> _userManager;

    public AdminController(
        IVideoService videoService,
        ICommentService commentService,
        IReactionService reactionService,
        UserManager<ApplicationUser> userManager)
    {
        _videoService = videoService;
        _commentService = commentService;
        _reactionService = reactionService;
        _userManager = userManager;
    }

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics()
    {
        var videos = await _videoService.GetAllAsync();
        var totalUsers = _userManager.Users.Count();

        var mostViewed = videos
            .OrderByDescending(v => v.ViewCount)
            .Take(5)
            .Select(v => new { v.VideoId, v.Title, v.ViewCount })
            .ToList();

        var videosWithLikes = new List<(long VideoId, string Title, int LikeCount)>();
        foreach (var video in videos)
        {
            var (likeCount, _) = await _reactionService.GetCountsAsync(video.VideoId);
            videosWithLikes.Add((video.VideoId, video.Title, likeCount));
        }

        var mostLiked = videosWithLikes
            .OrderByDescending(v => v.LikeCount)
            .Take(5)
            .Select(v => new { v.VideoId, v.Title, v.LikeCount })
            .ToList();

        var totalComments = videos.Sum(v =>
            _commentService.GetByVideoIdAsync(v.VideoId).Result.Count);

        var result = new
        {
            TotalVideos = videos.Count,
            TotalUsers = totalUsers,
            TotalComments = totalComments,
            MostViewedVideos = mostViewed,
            MostLikedVideos = mostLiked
        };

        return Ok(result);
    }
}