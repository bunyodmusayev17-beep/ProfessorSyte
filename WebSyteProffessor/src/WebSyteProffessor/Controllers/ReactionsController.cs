using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebSyteProffessor.Dtos.Reaction;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Controllers;

[Route("api/videos/{videoId}/reaction")]
[ApiController]
public class ReactionsController : ControllerBase
{
    private readonly IReactionService _reactionService;

    public ReactionsController(IReactionService reactionService)
    {
        _reactionService = reactionService;
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> SetReaction(long videoId, [FromBody] CreateReactionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _reactionService.SetReactionAsync(videoId, userId, dto.Type);
        return NoContent();
    }

    [HttpDelete]
    [Authorize]
    public async Task<IActionResult> RemoveReaction(long videoId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _reactionService.RemoveReactionAsync(videoId, userId);
        return NoContent();
    }
}