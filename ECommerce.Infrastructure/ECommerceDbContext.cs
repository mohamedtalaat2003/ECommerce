using CleanArchDemo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure;

public class ECommerceDbContext :DbContext
{
    public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options) : base(options)
    {

    }
    public DbSet<Product> products { get; set; }

}
