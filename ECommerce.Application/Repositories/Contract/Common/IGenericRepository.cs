using ECommerce.Domain.Entities;
using ECommerce.Domain.Specifications;

namespace ECommerce.Application.Repositories.Contract.Common
{
    //generic constraint to ensure the T is class inherit from baseClass
    public interface IGenericRepository<T> where T : BaseClass
    {
        //? => علشان لو ملقهاش يرجع null
        Task<T?> GetByIdAsync(int id);
        Task<IReadOnlyList<T>> GetAllAsync();
        Task AddAsync(T entity);
        void Update(T entity);
        Task Delete(int id);

        Task<T>GetEntitiesWithSpecAsync(ISpecification<T> spec);
        Task<IReadOnlyList<T>>ListSpecificationAsync(ISpecification<T> spec);
    }
}
