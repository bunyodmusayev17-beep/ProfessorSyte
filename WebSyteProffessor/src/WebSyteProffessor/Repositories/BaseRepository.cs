using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using WebSyteProffessor.Data;

namespace WebSyteProffessor.Repositories;

public class BaseRepository<T> : IBaseRepository<T> where T : class
{
    protected readonly AppDbContext _context;
    protected readonly DbSet<T> _dbSet;

    public BaseRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<List<T>> GetAllAsync(params Expression<Func<T, object>>[] includes)
    {
        IQueryable<T> query = _dbSet;
        foreach (var include in includes)
            query = query.Include(include);

        return await query.ToListAsync();
    }

    public async Task<T?> GetByIdAsync(long id, params Expression<Func<T, object>>[] includes)
    {
        IQueryable<T> query = _dbSet;
        foreach (var include in includes)
            query = query.Include(include);

        // Bu qism har bir entity'da "Id" nomli maydon borligini talab qiladi.
        // Bizda esa VideoId, CategoryId kabi nomlar — shuning uchun EF.Property ishlatamiz
        return await query.FirstOrDefaultAsync(e => EF.Property<long>(e, GetKeyName()) == id);
    }

    private string GetKeyName()
    {
        return _context.Model.FindEntityType(typeof(T))!
            .FindPrimaryKey()!.Properties[0].Name;
    }

    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }

    public async Task UpdateAsync(T entity)
    {
        _dbSet.Update(entity);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(T entity)
    {
        _dbSet.Remove(entity);
        await _context.SaveChangesAsync();
    }
}