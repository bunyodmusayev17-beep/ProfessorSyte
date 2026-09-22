using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Controllers;

[ApiController]
public class FavoritesController : ControllerBase
{
    private readonly IFavoriteService _favoriteService;

    public FavoritesController(IFavoriteService favoriteService)
    {
        _favoriteService = favoriteService;
    }

    [HttpPost("api/videos/{videoId}/favorite")]
    [Authorize]
    public async Task<IActionResult> Add(long videoId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _favoriteService.AddAsync(videoId, userId);
        return NoContent();
    }

    [HttpDelete("api/videos/{videoId}/favorite")]
    [Authorize]
    public async Task<IActionResult> Remove(long videoId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _favoriteService.RemoveAsync(videoId, userId);
        return NoContent();
    }

    [HttpGet("api/favorites/my")]
    [Authorize]
    public async Task<IActionResult> GetMyFavorites()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var favorites = await _favoriteService.GetMyFavoritesAsync(userId);

        var result = favorites.Select(f => new
        {
            f.FavoriteId,
            f.VideoId,
            VideoTitle = f.Video.Title,
            f.CreatedAt
        }).ToList();

        return Ok(result);
    }
}