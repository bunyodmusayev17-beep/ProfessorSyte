using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebSyteProffessor.Dtos.Comment;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    [HttpGet("video/{videoId}")]
    public async Task<IActionResult> GetByVideoId(long videoId)
    {
        var comments = await _commentService.GetByVideoIdAsync(videoId);
        return Ok(comments.Select(MapToDto).ToList());
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateCommentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var comment = await _commentService.CreateAsync(dto.VideoId, userId, dto.Text);
        return Ok(comment.CommentId);
    }

    [HttpPut("{commentId}")]
    [Authorize]
    public async Task<IActionResult> Update(long commentId, [FromBody] UpdateCommentDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        await _commentService.UpdateAsync(commentId, userId, dto.Text);
        return NoContent();
    }

    [HttpDelete("{commentId}")]
    [Authorize]
    public async Task<IActionResult> Delete(long commentId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var isAdmin = User.IsInRole("Admin");

        await _commentService.DeleteAsync(commentId, userId, isAdmin);
        return NoContent();
    }

    private static CommentDto MapToDto(Entities.Comment comment)
    {
        return new CommentDto
        {
            CommentId = comment.CommentId,
            Text = comment.Text,
            CreatedAt = comment.CreatedAt,
            VideoId = comment.VideoId,
            UserId = comment.UserId,
            UserName = comment.User.UserName ?? string.Empty
        };
    }
}