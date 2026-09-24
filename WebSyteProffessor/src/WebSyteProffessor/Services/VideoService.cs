using System.Text.RegularExpressions;
using WebSyteProffessor.Dtos.Video;
using WebSyteProffessor.Entities;
using WebSyteProffessor.Exceptions;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services;

public class VideoService : IVideoService
{
    private const string UploadFolder = "videos";

    private readonly IBaseRepository<Video> _videoRepository;
    private readonly IFileUploadService _fileUploadService;

    public VideoService(IBaseRepository<Video> videoRepository, IFileUploadService fileUploadService)
    {
        _videoRepository = videoRepository;
        _fileUploadService = fileUploadService;
    }

    public async Task<List<Video>> GetAllAsync()
    {
        var videos = await _videoRepository.GetAllAsync(v => v.Category, v => v.ProductLinks);
        return videos.OrderByDescending(v => v.CreatedAt).ToList();
    }

    public async Task<List<Video>> GetByCategoryIdAsync(long categoryId)
    {
        var all = await GetAllAsync();
        return all.Where(v => v.CategoryId == categoryId).ToList();
    }

    public async Task<Video> GetByIdAsync(long videoId)
    {
        var video = await _videoRepository.GetByIdAsync(videoId, v => v.Category, v => v.ProductLinks);
        if (video is null)
            throw new NotFoundException($"Video not found (videoId: {videoId})");

        return video;
    }

    public async Task<Video> CreateAsync(CreateVideoDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new BadRequestException("Video title is required");

        var youtubeVideoId = ExtractYoutubeId(dto.YoutubeUrl);

        var video = new Video
        {
            Title = dto.Title.Trim(),
            Description = dto.Description?.Trim() ?? string.Empty,
            YoutubeUrl = dto.YoutubeUrl.Trim(),
            YoutubeVideoId = youtubeVideoId,
            ThumbnailUrl = dto.Thumbnail is not null
                ? await _fileUploadService.SaveImageAsync(dto.Thumbnail, UploadFolder)
                : BuildYoutubeThumbnailUrl(youtubeVideoId),
            CategoryId = dto.CategoryId,
            IsExclusive = dto.IsExclusive,
            ProjectId = dto.ProjectId,
            ProductLinks = MapProductLinks(dto.ProductLinks)
        };

        return await _videoRepository.AddAsync(video);
    }

    public async Task UpdateAsync(long videoId, UpdateVideoDto dto)
    {
        var video = await GetByIdAsync(videoId);

        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new BadRequestException("Video title is required");

        video.Title = dto.Title.Trim();
        video.Description = dto.Description?.Trim() ?? string.Empty;
        video.CategoryId = dto.CategoryId;
        video.IsExclusive = dto.IsExclusive;
        video.ProjectId = dto.ProjectId;

        var youtubeUrl = dto.YoutubeUrl.Trim();
        var youtubeUrlChanged = video.YoutubeUrl != youtubeUrl;
        if (youtubeUrlChanged)
        {
            video.YoutubeUrl = youtubeUrl;
            video.YoutubeVideoId = ExtractYoutubeId(youtubeUrl);
        }

        video.ThumbnailUrl = await ResolveThumbnailAsync(video, dto, youtubeUrlChanged);

        video.ProductLinks.Clear();
        foreach (var link in MapProductLinks(dto.ProductLinks))
        {
            video.ProductLinks.Add(link);
        }

        await _videoRepository.UpdateAsync(video);
    }

    public async Task DeleteAsync(long videoId)
    {
        var video = await GetByIdAsync(videoId);

        _fileUploadService.DeleteImage(video.ThumbnailUrl);

        await _videoRepository.DeleteAsync(video);
    }

    public async Task IncrementViewCountAsync(long videoId)
    {
        var video = await GetByIdAsync(videoId);
        video.ViewCount++;
        await _videoRepository.UpdateAsync(video);
    }

    /// <summary>
    /// A custom thumbnail survives a YouTube URL change; only an auto-generated
    /// one is regenerated. Removing the custom image falls back to YouTube.
    /// </summary>
    private async Task<string> ResolveThumbnailAsync(Video video, UpdateVideoDto dto, bool youtubeUrlChanged)
    {
        var hasCustomThumbnail = IsUploadedThumbnail(video.ThumbnailUrl);

        if (dto.Thumbnail is not null)
        {
            var saved = await _fileUploadService.SaveImageAsync(dto.Thumbnail, UploadFolder);
            if (hasCustomThumbnail)
                _fileUploadService.DeleteImage(video.ThumbnailUrl);
            return saved;
        }

        if (dto.RemoveThumbnail)
        {
            if (hasCustomThumbnail)
                _fileUploadService.DeleteImage(video.ThumbnailUrl);
            return BuildYoutubeThumbnailUrl(video.YoutubeVideoId);
        }

        if (youtubeUrlChanged && !hasCustomThumbnail)
            return BuildYoutubeThumbnailUrl(video.YoutubeVideoId);

        return video.ThumbnailUrl;
    }

    public static bool IsUploadedThumbnail(string? thumbnailUrl)
    {
        return thumbnailUrl?.StartsWith("/uploads/", StringComparison.OrdinalIgnoreCase) == true;
    }

    private static List<ProductLink> MapProductLinks(List<CreateProductLinkDto> productLinks)
    {
        return productLinks
            .Where(p => !string.IsNullOrWhiteSpace(p.ProductName) && !string.IsNullOrWhiteSpace(p.Url))
            .Select(p => new ProductLink
            {
                StoreName = p.StoreName?.Trim() ?? string.Empty,
                ProductName = p.ProductName.Trim(),
                Url = p.Url.Trim()
            })
            .ToList();
    }

    private static string BuildYoutubeThumbnailUrl(string youtubeVideoId)
    {
        return $"https://img.youtube.com/vi/{youtubeVideoId}/hqdefault.jpg";
    }

    private const string YoutubeIdPattern = "[a-zA-Z0-9_-]{11}";

    private static readonly Regex[] YoutubeUrlPatterns =
    {
        new($@"youtube\.com/watch\?(?:.*&)?v=({YoutubeIdPattern})", RegexOptions.IgnoreCase),
        new($@"youtu\.be/({YoutubeIdPattern})", RegexOptions.IgnoreCase),
        new($@"youtube\.com/embed/({YoutubeIdPattern})", RegexOptions.IgnoreCase),
        new($@"youtube\.com/shorts/({YoutubeIdPattern})", RegexOptions.IgnoreCase),
        new($@"youtube\.com/live/({YoutubeIdPattern})", RegexOptions.IgnoreCase),
        // A bare video id pasted straight into the admin form.
        new($@"^{YoutubeIdPattern}$")
    };

    private static string ExtractYoutubeId(string url)
    {
        if (string.IsNullOrWhiteSpace(url))
            throw new BadRequestException("YouTube URL is required");

        var trimmed = url.Trim();

        foreach (var pattern in YoutubeUrlPatterns)
        {
            var match = pattern.Match(trimmed);
            if (match.Success)
                return match.Groups.Count > 1 && match.Groups[1].Success
                    ? match.Groups[1].Value
                    : match.Value;
        }

        throw new BadRequestException(
            "Unrecognized YouTube URL. Supported: watch?v=, youtu.be/, /embed/, /shorts/, /live/");
    }
}
