using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECommerce.Infrastructure.Data
{
    public class ECommerceContextSeed
    {
        public static async Task SeedAsync(ECommerceDbContext context)
        {
            if (!context.ProductBrands.Any())
            {
                var brands = new List<ProductBrand>
                {
                    new ProductBrand { Name = "Brand 1" },
                    new ProductBrand { Name = "Brand 2" },
                    new ProductBrand { Name = "Brand 3" }
                };
                await context.ProductBrands.AddRangeAsync(brands);
                await context.SaveChangesAsync();
            }

            if (!context.ProductCategories.Any())
            {
                var categories = new List<ProductCategory>
                {
                    new ProductCategory { Name = "Category 1" },
                    new ProductCategory { Name = "Category 2" },
                    new ProductCategory { Name = "Category 3" }
                };
                await context.ProductCategories.AddRangeAsync(categories);
                await context.SaveChangesAsync();
            }

            if (!context.products.Any())
            {
                var product = new List<Product>
                {       
                    new Product { Name = "Product 1", Description = "Desc 1", Price = 100, ProductBrandId =1 ,ProductCategoryId = 1, PictureUrl = "url1" },
                    new Product { Name = "Product 2", Description = "Desc 2", Price = 200, ProductBrandId = 1, ProductCategoryId =1,PictureUrl = "url2" }
                };
               await context.products.AddRangeAsync(product);
               await context.SaveChangesAsync();
            }

            if (!context.DeliveryMethods.Any())
            {
                var methods = new List<DeliveryMethod>
    {
        new DeliveryMethod { ShortName = "UPS", DeliveryTime = "1-2 Days", Description = "Fastest delivery service", Price = 10 },
        new DeliveryMethod { ShortName = "Aramex", DeliveryTime = "2-5 Days", Description = "Get your order in a week", Price = 5 },
        new DeliveryMethod { ShortName = "Post", DeliveryTime = "7-10 Days", Description = "Cheapest way to ship", Price = 2 },
        new DeliveryMethod { ShortName = "Free", DeliveryTime = "1-2 Weeks", Description = "Free shipping for orders over $100", Price = 0 }
    };

                await context.DeliveryMethods.AddRangeAsync(methods);
                await context.SaveChangesAsync();
            }
        }


    }
}
