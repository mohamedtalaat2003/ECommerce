using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class ProductToReturnDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? PictureUrl { get; set; }
        // دول بنستخدمهم في الـ GET (العرض)
        public string? BrandName { get; set; }
        public string CategoryName { get; set; }

        // دول بنستخدمهم في الـ POST (الإضافة)
        public int ProductBrandId { get; set; }
        public int ProductCategoryId { get; set; }
    }
}
