using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebSyteProffessor.Dtos.Category;
using WebSyteProffessor.Services;

namespace WebSyteProffessor.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        var categories = await _categoryService.GetAllAsync();
        return Ok(categories.Select(MapToDto).ToList());
    }

    [HttpGet("{categoryId}")]
    public async Task<IActionResult> GetCategoryById(long categoryId)
    {
        var category = await _categoryService.GetByIdAsync(categoryId);
        return Ok(MapToDto(category));
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] CreateCategoryDto dto)
    {
        var category = await _categoryService.CreateAsync(dto);
        return CreatedAtAction(
            nameof(GetCategoryById),
            new { categoryId = category.CategoryId },
            MapToDto(category));
    }

    [HttpPut("{categoryId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(long categoryId, [FromForm] UpdateCategoryDto dto)
    {
        await _categoryService.UpdateAsync(categoryId, dto);
        return NoContent();
    }

    [HttpDelete("{categoryId}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(long categoryId)
    {
        await _categoryService.DeleteAsync(categoryId);
        return NoContent();
    }

    private static CategoryDto MapToDto(Entities.Category category)
    {
        return new CategoryDto
        {
            CategoryId = category.CategoryId,
            Name = category.Name,
            Description = category.Description,
            IconUrl = category.IconUrl,
            CoverImageUrl = category.CoverImageUrl,
            VideoCount = category.Videos.Count
        };
    }
}
