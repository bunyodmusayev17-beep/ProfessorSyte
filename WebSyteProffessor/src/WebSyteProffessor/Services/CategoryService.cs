using WebSyteProffessor.Dtos.Category;
using WebSyteProffessor.Entities;
using WebSyteProffessor.Exceptions;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services;

public class CategoryService : ICategoryService
{
    private const string UploadFolder = "categories";

    private readonly IBaseRepository<Category> _repository;
    private readonly IFileUploadService _fileUploadService;

    public CategoryService(IBaseRepository<Category> repository, IFileUploadService fileUploadService)
    {
        _repository = repository;
        _fileUploadService = fileUploadService;
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _repository.GetAllAsync(c => c.Videos);
    }

    public async Task<Category> GetByIdAsync(long categoryId)
    {
        var category = await _repository.GetByIdAsync(categoryId, c => c.Videos);
        if (category is null)
            throw new NotFoundException($"Category not found (categoryId: {categoryId})");

        return category;
    }

    public async Task<Category> CreateAsync(CreateCategoryDto dto)
    {
        var name = Normalize(dto.Name);
        if (name is null)
            throw new BadRequestException("Category name is required");

        var category = new Category
        {
            Name = name,
            Description = Normalize(dto.Description),
            // An uploaded file wins over a preset key.
            IconUrl = dto.IconFile is not null
                ? await _fileUploadService.SaveImageAsync(dto.IconFile, UploadFolder)
                : Normalize(dto.IconKey),
            CoverImageUrl = dto.CoverImage is not null
                ? await _fileUploadService.SaveImageAsync(dto.CoverImage, UploadFolder)
                : null
        };

        return await _repository.AddAsync(category);
    }

    public async Task UpdateAsync(long categoryId, UpdateCategoryDto dto)
    {
        var category = await GetByIdAsync(categoryId);

        var name = Normalize(dto.Name);
        if (name is null)
            throw new BadRequestException("Category name is required");

        category.Name = name;
        category.Description = Normalize(dto.Description);

        category.IconUrl = await ResolveImageAsync(
            current: category.IconUrl,
            file: dto.IconFile,
            presetKey: Normalize(dto.IconKey),
            remove: dto.RemoveIcon);

        category.CoverImageUrl = await ResolveImageAsync(
            current: category.CoverImageUrl,
            file: dto.CoverImage,
            presetKey: null,
            remove: dto.RemoveCoverImage);

        await _repository.UpdateAsync(category);
    }

    public async Task DeleteAsync(long categoryId)
    {
        var category = await GetByIdAsync(categoryId);

        _fileUploadService.DeleteImage(category.IconUrl);
        _fileUploadService.DeleteImage(category.CoverImageUrl);

        await _repository.DeleteAsync(category);
    }

    /// <summary>
    /// Decides what an image field becomes on update: cleared, replaced by a new
    /// upload, replaced by a preset key, or left as it was. The previous file is
    /// deleted from disk whenever it stops being referenced.
    /// </summary>
    private async Task<string?> ResolveImageAsync(string? current, IFormFile? file, string? presetKey, bool remove)
    {
        if (remove)
        {
            _fileUploadService.DeleteImage(current);
            return null;
        }

        if (file is not null)
        {
            var saved = await _fileUploadService.SaveImageAsync(file, UploadFolder);
            _fileUploadService.DeleteImage(current);
            return saved;
        }

        if (presetKey is not null && presetKey != current)
        {
            _fileUploadService.DeleteImage(current);
            return presetKey;
        }

        return current;
    }

    private static string? Normalize(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }
}
