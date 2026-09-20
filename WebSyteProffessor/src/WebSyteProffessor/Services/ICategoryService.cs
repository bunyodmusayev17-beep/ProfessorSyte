using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Services;

public interface ICategoryService
{
    Task<List<Category>> GetAllAsync();
    Task<Category> GetByIdAsync(long categoryId);
    Task<Category> CreateAsync(string name, string? description, string? iconUrl);
    Task UpdateAsync(long categoryId, string name, string? description, string? iconUrl);
    Task DeleteAsync(long categoryId);
}