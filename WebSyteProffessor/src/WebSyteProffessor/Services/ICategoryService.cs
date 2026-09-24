using WebSyteProffessor.Dtos.Category;
using WebSyteProffessor.Entities;

namespace WebSyteProffessor.Services;

public interface ICategoryService
{
    Task<List<Category>> GetAllAsync();
    Task<Category> GetByIdAsync(long categoryId);
    Task<Category> CreateAsync(CreateCategoryDto dto);
    Task UpdateAsync(long categoryId, UpdateCategoryDto dto);
    Task DeleteAsync(long categoryId);
}
