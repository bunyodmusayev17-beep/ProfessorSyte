using WebSyteProffessor.Entities;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services
{
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

        public async Task<bool> DeleteAsync(long videoId)
        {
            var video = await _videoRepository.GetByIdAsync(videoId);
            if (video is null) return false;

            await _videoRepository.DeleteAsync(video);
            return true;
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

        public async Task<Video?> GetByIdAsync(long videoId)
        {
            return await _videoRepository.GetByIdAsync(videoId, v => v.Category, v => v.ProductLinks);
        }

        public async Task IncrementViewCountAsync(long videoId)
        {
            var video = await _videoRepository.GetByIdAsync(videoId);
            if (video is null) return;

            video.ViewCount++;
            await _videoRepository.UpdateAsync(video);
        }

        public async Task<bool> UpdateAsync(long videoId, string title,string description,string youtubeUrl,long categoryId,bool isExclusive,long? projectId,List<(string StoreName, string ProductName, string Url)> productLinks)
        {
            var video = await _videoRepository.GetByIdAsync(videoId, v => v.ProductLinks);
            if (video is null) return false;

            video.Title = title;
            video.Description = description;
            video.CategoryId = categoryId;
            video.IsExclusive = isExclusive;
            video.ProjectId = projectId;

            // YoutubeUrl o'zgargan bo'lsa, ID va thumbnail'ni qayta hisoblaymiz
            if (video.YoutubeUrl != youtubeUrl)
            {
                video.YoutubeUrl = youtubeUrl;
                video.YoutubeVideoId = ExtractYoutubeId(youtubeUrl);
                video.ThumbnailUrl = $"https://img.youtube.com/vi/{video.YoutubeVideoId}/hqdefault.jpg";
            }

            // Eski ProductLink'larni tozalab, yangilarini qo'yamiz
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
            return true;
        }
        private static string ExtractYoutubeId(string youtubeUrl)
        {
            var uri = new Uri(youtubeUrl);
            var query = System.Web.HttpUtility.ParseQueryString(uri.Query);
            return query["v"] ?? throw new ArgumentException("Invalid YouTube URL");
        }
    }
}//ExtractYoutubeId — ikkala formatni ham qo'llab-quvvatlaydi
 //(Regex orqali 11 belgili video ID'ni ajratib oladi).
 //Agar hech biriga mos kelmasa, xato tashlaydi
 //(bu — keyinroq Middleware ushlaydigan ArgumentException).