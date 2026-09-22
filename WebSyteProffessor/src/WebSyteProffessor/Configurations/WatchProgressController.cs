using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Controllers;

[ApiController]
public class WatchProgressController : ControllerBase
{
    private readonly IWatchProgressService _watchProgressService;

    public WatchProgressController(IWatchProgressService watchProgressService)
    {
        _watchProgressService = watchProgressService;
    }

    [HttpPost("api/videos/{videoId}/progress")]
    [Authorize]
    public async Task<IActionResult> MarkAsWatched(long videoId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _watchProgressService.MarkAsWatchedAsync(videoId, userId);
        return NoContent();
    }

    [HttpGet("api/progress/my")]
    [Authorize]
    public async Task<IActionResult> GetMyProgress()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var progress = await _watchProgressService.GetMyProgressAsync(userId);

        var result = progress.Select(p => new
        {
            p.WatchProgressId,
            p.VideoId,
            VideoTitle = p.Video.Title,
            p.IsCompleted,
            p.LastWatchedAt
        }).ToList();

        return Ok(result);
    }
}