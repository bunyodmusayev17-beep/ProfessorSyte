using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Data;

public class AppDbContext : IdentityDbContext<ApplicationUser>
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Category> Categories { get; set; }
    public DbSet<Video> Videos { get; set; }
    public DbSet<ProductLink> ProductLinks { get; set; }
    public DbSet<Tag> Tags { get; set; }
    public DbSet<VideoTag> VideoTags { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectImage> ProjectImages { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Reaction> Reactions { get; set; }
    public DbSet<Rating> Ratings { get; set; }
    public DbSet<Favorite> Favorites { get; set; }
    public DbSet<WatchProgress> WatchProgresses { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductReview> ProductReviews { get; set; }
    public DbSet<SiteSettings> SiteSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // Category → Video
        builder.Entity<Video>()
            .HasOne(v => v.Category)
            .WithMany(c => c.Videos)
            .HasForeignKey(v => v.CategoryId);

        // VideoTag — many to many linking (composite key)
        builder.Entity<VideoTag>()
            .HasKey(vt => new { vt.VideoId, vt.TagId });

        builder.Entity<VideoTag>()
            .HasOne(vt => vt.Video)
            .WithMany(v => v.VideoTags)
            .HasForeignKey(vt => vt.VideoId);

        builder.Entity<VideoTag>()
            .HasOne(vt => vt.Tag)
            .WithMany(t => t.VideoTags)
            .HasForeignKey(vt => vt.TagId);

        // ProjectImage → Project
        builder.Entity<ProjectImage>()
            .HasOne(pi => pi.Project)
            .WithMany(p => p.Images)
            .HasForeignKey(pi => pi.ProjectId);

        // Reaction — one user can only give one reaction per video
        builder.Entity<Reaction>()
            .HasIndex(r => new { r.VideoId, r.UserId })
            .IsUnique();

        // Favorite — user can save only one video once
        builder.Entity<Favorite>()
            .HasIndex(f => new { f.VideoId, f.UserId })
            .IsUnique();

        // Rating — one user can only give one rating for a video
        builder.Entity<Rating>()
            .HasIndex(r => new { r.VideoId, r.UserId })
            .IsUnique();

        // WatchProgress — one user can only have one progress entry for a video
        builder.Entity<WatchProgress>()
            .HasIndex(w => new { w.VideoId, w.UserId })
            .IsUnique();

        // Video → Project (nullable, Project o'chirilsa Video qolishi kerak)
        builder.Entity<Video>()
            .HasOne<Project>()
            .WithMany(p => p.Videos)
            .HasForeignKey(v => v.ProjectId)
            .OnDelete(DeleteBehavior.SetNull);
    }
}