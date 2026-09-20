using WebSyteProffessor.Entities;
using WebSyteProffessor.Exceptions;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services;

public class VideoService : IVideoService
{
    private readonly IBaseRepository<Video> _videoRepository;

    public VideoService(IBaseRepository<Video> videoRepository)
    {
        _videoRepository = videoRepository;
    }

    public async Task<Video> CreateAsync(string title, string description, string youtubeUrl, long categoryId, bool isExclusive, long? projectId, List<(string StoreName, string ProductName, string Url)> productLinks)
    {
        var youtubeVideoId = ExtractYoutubeId(youtubeUrl);
        var thumbnailUrl = $"https://img.youtube.com/vi/{youtubeVideoId}/hqdefault.jpg";

        var video = new Video
        {
            Title = title,
            Description = description,
            YoutubeUrl = youtubeUrl,
            YoutubeVideoId = youtubeVideoId,
            ThumbnailUrl = thumbnailUrl,
            CategoryId = categoryId,
            IsExclusive = isExclusive,
            ProjectId = projectId,
            ProductLinks = productLinks.Select(p => new ProductLink
            {
                StoreName = p.StoreName,
                ProductName = p.ProductName,
                Url = p.Url
            }).ToList()
        };

        return await _videoRepository.AddAsync(video);
    }

    public async Task DeleteAsync(long videoId)
    {
        var video = await GetByIdAsync(videoId);
        await _videoRepository.DeleteAsync(video);
    }

    public async Task<List<Video>> GetAllAsync()
    {
        return await _videoRepository.GetAllAsync(v => v.Category, v => v.ProductLinks);
    }

    public async Task<List<Video>> GetByCategoryIdAsync(long categoryId)
    {
        var all = await _videoRepository.GetAllAsync(v => v.Category, v => v.ProductLinks);
        return all.Where(v => v.CategoryId == categoryId).ToList();
    }

    public async Task<Video> GetByIdAsync(long videoId)
    {
        var video = await _videoRepository.GetByIdAsync(videoId, v => v.Category, v => v.ProductLinks);
        if (video is null)
            throw new NotFoundException($"Video not found (videoId: {videoId})");

        return video;
    }

    public async Task IncrementViewCountAsync(long videoId)
    {
        var video = await GetByIdAsync(videoId);
        video.ViewCount++;
        await _videoRepository.UpdateAsync(video);
    }

    public async Task UpdateAsync(long videoId, string title, string description, string youtubeUrl, long categoryId, bool isExclusive, long? projectId, List<(string StoreName, string ProductName, string Url)> productLinks)
    {
        var video = await GetByIdAsync(videoId);

        video.Title = title;
        video.Description = description;
        video.CategoryId = categoryId;
        video.IsExclusive = isExclusive;
        video.ProjectId = projectId;

        if (video.YoutubeUrl != youtubeUrl)
        {
            video.YoutubeUrl = youtubeUrl;
            video.YoutubeVideoId = ExtractYoutubeId(youtubeUrl);
            video.ThumbnailUrl = $"https://img.youtube.com/vi/{video.YoutubeVideoId}/hqdefault.jpg";
        }

        video.ProductLinks.Clear();
        foreach (var link in productLinks)
        {
            video.ProductLinks.Add(new ProductLink
            {
                StoreName = link.StoreName,
                ProductName = link.ProductName,
                Url = link.Url
            });
        }

        await _videoRepository.UpdateAsync(video);
    }

    private static string ExtractYoutubeId(string url)
    {
        var match = System.Text.RegularExpressions.Regex.Match(url, @"(?:youtube\.com/watch\?v=)([a-zA-Z0-9_-]{11})");
        if (match.Success) return match.Groups[1].Value;

        match = System.Text.RegularExpressions.Regex.Match(url, @"(?:youtu\.be/)([a-zA-Z0-9_-]{11})");
        if (match.Success) return match.Groups[1].Value;

        throw new ArgumentException("Unrecognized YouTube URL format");
    }
}