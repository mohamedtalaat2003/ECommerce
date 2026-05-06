using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Specifications
{
    public class ProductsByIdsSpecification : BaseSpecification<Product>
    {
        public ProductsByIdsSpecification(int Id) :base(p=>p.Id == Id) 
        {
                AddInclude(p => p.ProductBrand);
                AddInclude(p => p.ProductCategory);
        }
    }
}
