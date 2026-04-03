using CleanArchDemo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECommerce.Infrastructure.Data
{
    public class ECommerceContextSeed
    {
        public static async Task SeedAsync(ECommerceDbContext context)
        {
            if (!context.products.Any())
            {
                var product = new List<Product>
                {       
                    new Product { Name = "Product 1", Description = "Desc 1", Price = 100, Brand = "Brand A", cloudinaryUrl = "url1" },
                    new Product { Name = "Product 2", Description = "Desc 2", Price = 200, Brand = "Brand B", cloudinaryUrl = "url2" }
                };
               await context.products.AddRangeAsync(product);
               await context.SaveChangesAsync();
            }
        }
    }
}
