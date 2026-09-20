using System.Linq.Expressions;

namespace WebSyteProffessor.Repositories;

public interface IBaseRepository<T> where T : class
{
    Task<List<T>> GetAllAsync(params Expression<Func<T, object>>[] includes);
    Task<T?> GetByIdAsync(long id, params Expression<Func<T, object>>[] includes);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(T entity);
}