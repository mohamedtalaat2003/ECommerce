using ECommerce.Domain.Entities;
using ECommerce.Domain.Specifications;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure.Implementation.Common
{
    public class SpecificationEvaluator<TEntity> where TEntity : BaseClass
    {
        //convert to Sql
        //inputQuery query came from repo without filter
        public static IQueryable<TEntity> GetQuery(IQueryable<TEntity> inputQuery,ISpecification<TEntity> spec) //spec : Specifications contain criteria and include
        {
            var query = inputQuery;// بدل منشتغل علي الاصل نعمل نسخه علشان منبوظش حاجة

            if(spec.Criteria != null)
            {
                query = query.Where(spec.Criteria); //spec.Criteria like d=>d.Id == 5 then convert to SQlquery WHERE  id = 5
            }

            if(spec.OrderBy != null)
            {
                query = query.OrderBy(spec.OrderBy); //spec.OrderBy like d=>d.Name then convert to SQlquery ORDER BY Name
            }

            if(spec.OrderByDescending != null)
            {
                query = query.OrderByDescending(spec.OrderByDescending); //spec.OrderByDescending like d=>d.Name then convert to SQlquery ORDER BY Name DESC
            }

            if(spec.IsPagingEnabled)
            {
                query = query.Skip(spec.Skip).Take(spec.Take);
            }
            //use aggregate : thats function in LinQ to make simple without it we use foreach 
            // ex =>  first include query = query.Include(p => p.ProductBrand); / second include query = query.Include(p => p.ProductType);
            //final result context.Products.Where(x => x.Price > 100).Include(x => x.ProductBrand) .Include(x => x.ProductType)
            query = spec.Includes.Aggregate(query, (current,include) => current.Include(include));

            return query;
        }
    }
}
