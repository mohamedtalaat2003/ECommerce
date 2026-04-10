using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Specifications
{
    public class productWithBrandAndCategoriesSpecification : BaseSpecification<Product>
    {
        //when call List of products
        //specParams to make clean code and more readable
        public productWithBrandAndCategoriesSpecification(ProductSpecParams specParams) :base(x =>
        (string.IsNullOrEmpty(specParams.Search)||x.Name.ToLower().Contains(specParams.Search))&&
        (!specParams.BrandId.HasValue || x.ProductBrandId == specParams.BrandId) &&
        (!specParams.CategoryId.HasValue || x.ProductCategoryId == specParams.CategoryId))
        {
            AddInclude(p => p.ProductBrand);
            AddInclude(p => p.ProductCategory);

            AddOrderBy(x => x.Name);

            if(!string.IsNullOrEmpty(specParams.Sort))
            {
                switch(specParams.Sort)
                {
                    case "PriceAsc":
                        AddOrderBy(p => p.Price); 
                        break;
                    case "PriceDesc":
                        AddOrderByDescending(p => p.Price);
                        break;

                    default: AddOrderBy(n => n.Name);
                        break;
                }
            }
        }

        //when call one product
        public productWithBrandAndCategoriesSpecification(int id) :base(x=>x.Id==id) //that condition in constructor of parent
        {
            AddInclude(x => x.ProductBrand);
            AddInclude(p => p.ProductCategory);
        }

    }
}
