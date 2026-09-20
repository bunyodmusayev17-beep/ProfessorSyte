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

        var result = categories.Select(c => new CategoryDto
        {
            CategoryId = c.CategoryId,
            Name = c.Name,
            Description = c.Description,
            IconUrl = c.IconUrl,
            VideoCount = c.Videos.Count
        }).ToList();

        return Ok(result);
    }

    [HttpGet("{categoryId}")]
    public async Task<IActionResult> GetCategoryById(long categoryId)
    {
        var category = await _categoryService.GetByIdAsync(categoryId);

        var result = new CategoryDto
        {
            CategoryId = category.CategoryId,
            Name = category.Name,
            Description = category.Description,
            IconUrl = category.IconUrl,
            VideoCount = category.Videos.Count
        };
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto dto)
    {
        var category = await _categoryService.CreateAsync(dto.Name, dto.Description, dto.IconUrl);

        var result = new CategoryDto
        {
            CategoryId = category.CategoryId,
            Name = category.Name,
            Description = category.Description,
            IconUrl = category.IconUrl,
            VideoCount = 0
        };

        return CreatedAtAction(nameof(GetCategoryById), new { categoryId = category.CategoryId }, result);
    }

    [HttpPut("{categoryId}")]
    public async Task<IActionResult> Update(long categoryId, [FromBody] UpdateCategoryDto dto)
    {
        await _categoryService.UpdateAsync(categoryId, dto.Name, dto.Description, dto.IconUrl);
        return NoContent();
    }

    [HttpDelete("{categoryId}")]
    public async Task<IActionResult> Delete(long categoryId)
    {
        await _categoryService.DeleteAsync(categoryId);
        return NoContent();
    }
}