using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class ProductCreateDto
    {
        [Required(ErrorMessage = "Product name is required")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Name must be between 3 and 100 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Product description is required")]
        [MinLength(10, ErrorMessage = "Description must be at least 10 characters long")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Price is required")]
        [Range(0.1, double.MaxValue, ErrorMessage = "Price must be greater than zero")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "Product Brand is required")]
        public int ProductBrandId { get; set; }

        [Required(ErrorMessage = "Product Category is required")]
        public int ProductCategoryId { get; set; }

        [Required(ErrorMessage = "Product photo is required")]
        public IFormFile Photo { get; set; }
    }
}
