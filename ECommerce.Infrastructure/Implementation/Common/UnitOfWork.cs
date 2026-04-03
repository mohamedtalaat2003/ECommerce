using CleanArchDemo.Domain.Entities;
using ECommerce.Application.Repositories.Contract.Common;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Infrastructure.Implementation.Common
{
    internal class UnitOfWork : IUnitOfWork
    {
        
        private readonly ECommerceDbContext _context;
        //(Cache) بنحط فيه كل الـ Repositories اللي اتعملت قبل كده
        private Dictionary<Type, object> _repositories = new();
        public UnitOfWork(ECommerceDbContext context)
        {
            _context = context;
        }

        public async Task<int> CompleteAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async ValueTask DisposeAsync()
        {
            await _context.DisposeAsync();
        }

        //Lazy Initialization
        public IGenericRepository<T> Repository<T>() where T : BaseClass
        {
            var type = typeof(T);

            if (!_repositories.ContainsKey(type))
            {
                var repo = new GenericRepository<T>(_context);
                _repositories[type] = repo;
            }

            return (IGenericRepository<T>)_repositories[type];
        }
    }
}
