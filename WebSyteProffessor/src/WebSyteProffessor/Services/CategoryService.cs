using WebSyteProffessor.Entities;
using WebSyteProffessor.Repositories;

namespace WebSyteProffessor.Services;

public class CategoryService : ICategoryService
{
    private readonly IBaseRepository<Category> _repository;

    public CategoryService(IBaseRepository<Category> repository)
    {
        _repository = repository;
    }

    public async Task<List<Category>> GetAllAsync()
    {
        return await _repository.GetAllAsync(c => c.Videos);
    }

    public async Task<Category?> GetByIdAsync(long categoryId)
    {
        return await _repository.GetByIdAsync(categoryId, c => c.Videos);
    }

    public async Task<Category> CreateAsync(string name, string? description, string? iconUrl)
    {
        var category = new Category { Name = name, Description = description, IconUrl = iconUrl };
        return await _repository.AddAsync(category);
    }

    public async Task<bool> UpdateAsync(long categoryId, string name, string? description, string? iconUrl)
    {
        var category = await _repository.GetByIdAsync(categoryId);
        if (category is null) return false;

        category.Name = name;
        category.Description = description;
        category.IconUrl = iconUrl;

        await _repository.UpdateAsync(category);
        return true;
    }

    public async Task<bool> DeleteAsync(long categoryId)
    {
        var category = await _repository.GetByIdAsync(categoryId);
        if (category is null) return false;

        await _repository.DeleteAsync(category);
        return true;
    }
}