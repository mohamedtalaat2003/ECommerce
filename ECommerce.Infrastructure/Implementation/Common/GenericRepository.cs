using ECommerce.Application.Repositories.Contract.Common;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Specifications;
using ECommerce.Infrastructure;
using ECommerce.Infrastructure.Implementation.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using System.Linq.Expressions;


namespace ECommerce.Infrastructure.Implementation.Common
{
    public class GenericRepository<T> : IGenericRepository<T> where T : BaseClass
    {
        private readonly ECommerceDbContext _context;
        public GenericRepository(ECommerceDbContext context)
        {
            _context = context;
        }
        public async Task AddAsync(T entity) => await _context.Set<T>().AddAsync(entity);
        public async Task Delete(int id)
        {
            var entity = await GetByIdAsync(id);
            if (entity != null)
            {
                _context.Set<T>().Remove(entity);
            }
        }
        public async Task<IReadOnlyList<T>> GetAllAsync() => await _context.Set<T>().AsNoTracking().ToListAsync();
        public async Task<T?> GetByIdAsync(int id) => await _context.Set<T>().AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);

        public async Task<T> GetEntitiesWithSpecAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).FirstOrDefaultAsync();
        }

        public async Task<IReadOnlyList<T>> ListSpecificationAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).ToListAsync();
        }

        //Helper method to apply specification to the query without execution
        private IQueryable<T> ApplySpecification(ISpecification<T>spec)
        {
            //user AsQueryable to conver DbSet to IQueryable to apply filters and includes defined in the specification
            return SpecificationEvaluator<T>.GetQuery(_context.Set<T>().AsQueryable(), spec);
        }
        public void Update(T product) => _context.Set<T>().Update(product);

        public async Task<IReadOnlyList<T>> GetByExpressionAsync(Expression<Func<T, bool>> predicate)
        {
            return await _context.Set<T>().Where(predicate).ToListAsync();
        }
    }
}
