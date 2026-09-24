using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebSyteProffessor.Dtos.Video;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VideosController : ControllerBase
{
    private readonly IVideoService _videoService;
    private readonly IReactionService _reactionService;

    public VideosController(IVideoService videoService, IReactionService reactionService)
    {
        _videoService = videoService;
        _reactionService = reactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllVideos()
    {
        var videos = await _videoService.GetAllAsync();
        return Ok(await MapWithReactionCountsAsync(videos));
    }

    [HttpGet("{videoId}")]
    public async Task<IActionResult> GetVideoById(long videoId)
    {
        var video = await _videoService.GetByIdAsync(videoId);
        await _videoService.IncrementViewCountAsync(videoId);

        var (likeCount, dislikeCount) = await _reactionService.GetCountsAsync(videoId);

        var dto = MapToDto(video);
        dto.LikeCount = likeCount;
        dto.DislikeCount = dislikeCount;

        return Ok(dto);
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetVideosByCategoryId(long categoryId)
    {
        var videos = await _videoService.GetByCategoryIdAsync(categoryId);
        return Ok(await MapWithReactionCountsAsync(videos));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] CreateVideoDto dto)
    {
        var video = await _videoService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetVideoById), new { videoId = video.VideoId }, MapToDto(video));
    }

    [HttpPut("{videoId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(long videoId, [FromForm] UpdateVideoDto dto)
    {
        await _videoService.UpdateAsync(videoId, dto);
        return NoContent();
    }

    [HttpDelete("{videoId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteVideo(long videoId)
    {
        await _videoService.DeleteAsync(videoId);
        return NoContent();
    }

    private async Task<List<VideoDto>> MapWithReactionCountsAsync(List<Entities.Video> videos)
    {
        var dtos = new List<VideoDto>(videos.Count);

        foreach (var video in videos)
        {
            var dto = MapToDto(video);
            var (likeCount, dislikeCount) = await _reactionService.GetCountsAsync(video.VideoId);
            dto.LikeCount = likeCount;
            dto.DislikeCount = dislikeCount;
            dtos.Add(dto);
        }

        return dtos;
    }

    private static VideoDto MapToDto(Entities.Video video)
    {
        return new VideoDto
        {
            VideoId = video.VideoId,
            Title = video.Title,
            Description = video.Description,
            YoutubeUrl = video.YoutubeUrl,
            ThumbnailUrl = video.ThumbnailUrl,
            HasCustomThumbnail = VideoService.IsUploadedThumbnail(video.ThumbnailUrl),
            IsExclusive = video.IsExclusive,
            ViewCount = video.ViewCount,
            CreatedAt = video.CreatedAt,
            CategoryId = video.CategoryId,
            CategoryName = video.Category?.Name ?? string.Empty,
            ProjectId = video.ProjectId,
            ProductLinks = video.ProductLinks.Select(p => new ProductLinkDto
            {
                ProductLinkId = p.ProductLinkId,
                StoreName = p.StoreName,
                ProductName = p.ProductName,
                Url = p.Url
            }).ToList()
        };
    }
}
