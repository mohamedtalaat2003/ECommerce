using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class ProductCreateDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int ProductBrandId { get; set; }
        public int ProductCategoryId { get; set; }

        // الملف هنا عشان السيرفر يستلمه ويرفعه
        public IFormFile? Photo { get; set; }
    }
}
