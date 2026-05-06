using ECommerce.Domain.Entities;
using ECommerce.Domain.Enum;
using Microsoft.EntityFrameworkCore;

namespace ECommerce.Infrastructure;

public class ECommerceDbContext :DbContext
{
    public ECommerceDbContext(DbContextOptions<ECommerceDbContext> options) : base(options)
    {

    }
    public DbSet<Product> products { get; set; }
    public DbSet<ProductCategory> ProductCategories { get; set; }
    public DbSet<ProductBrand> ProductBrands { get; set; }

    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<DeliveryMethod> DeliveryMethods { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        //علشان ميحصلش خلط بين العنوان بتاع الحسان وعنوان اللي هيتشحن ليه الاوردر
        modelBuilder.Entity<Order>().OwnsOne(o => o.ShipToAddress, a => { a.WithOwner(); });

        // 2. حالة الأوردر تتخزن كـ String (Pending) مش رقم
        modelBuilder.Entity<Order>().Property(s => s.Status)
            .HasConversion(o => o.ToString(), o => (OrderStatus)Enum.Parse(typeof(OrderStatus), o));

        // 3. الـ Snapshot بتاع المنتج تابع للـ OrderItem
        modelBuilder.Entity<OrderItem>().OwnsOne(i => i.ItemOrdered, io => { io.WithOwner(); });
        modelBuilder.Entity<OrderItem>().Property(i => i.Price).HasColumnType("decimal(18,2)");
        modelBuilder.Entity<DeliveryMethod>().Property(d => d.Price).HasColumnType("decimal(18,2)");
    }

}
