using Microsoft.AspNetCore.Mvc;
using WebSyteProffessor.Dtos.Video;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VideosController : ControllerBase
{
    private readonly IVideoService _videoService;

    public VideosController(IVideoService videoService)
    {
        _videoService = videoService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllVideos()
    {
        var videos = await _videoService.GetAllAsync();
        return Ok(videos.Select(MapToDto).ToList());
    }

    [HttpGet("{videoId}")]
    public async Task<IActionResult> GetVideoById(long videoId)
    {
        var video = await _videoService.GetByIdAsync(videoId);
        await _videoService.IncrementViewCountAsync(videoId);
        return Ok(MapToDto(video));
    }

    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetVideosByCategoryId(long categoryId)
    {
        var videos = await _videoService.GetByCategoryIdAsync(categoryId);
        return Ok(videos.Select(MapToDto).ToList());
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVideoDto dto)
    {
        var productLinks = dto.ProductLinks
            .Select(p => (p.StoreName, p.ProductName, p.Url))
            .ToList();

        var video = await _videoService.CreateAsync(
            dto.Title, dto.Description, dto.YoutubeUrl, dto.CategoryId, dto.IsExclusive, dto.ProjectId, productLinks);

        return CreatedAtAction(nameof(GetVideoById), new { videoId = video.VideoId }, MapToDto(video));
    }

    [HttpPut("{videoId}")]
    public async Task<IActionResult> Update(long videoId, [FromBody] UpdateVideoDto dto)
    {
        var productLinks = dto.ProductLinks
            .Select(p => (p.StoreName, p.ProductName, p.Url))
            .ToList();

        await _videoService.UpdateAsync(
            videoId, dto.Title, dto.Description, dto.YoutubeUrl, dto.CategoryId, dto.IsExclusive, dto.ProjectId, productLinks);

        return NoContent();
    }

    [HttpDelete("{videoId}")]
    public async Task<IActionResult> DeleteVideo(long videoId)
    {
        await _videoService.DeleteAsync(videoId);
        return NoContent();
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
            IsExclusive = video.IsExclusive,
            ViewCount = video.ViewCount,
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