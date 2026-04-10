using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace ECommerce.Domain.Entities
{
    public class Product :BaseClass
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? PictureUrl { get; set; }
        public string? PublicId { get; set; }

        [ForeignKey("ProductBrand")]
        public int ProductBrandId { get; set; }
        [ForeignKey("ProductCategory")]
        public int ProductCategoryId { get; set; }
        public ProductCategory? ProductCategory { get; set; }
        public ProductBrand? ProductBrand { get; set; }
    }
}
