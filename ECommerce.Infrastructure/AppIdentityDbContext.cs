using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Infrastructure
{
    public class AppIdentityDbContext : IdentityDbContext<AppUser>
    {
        public AppIdentityDbContext(DbContextOptions<AppIdentityDbContext> options) : base(options)
        {
        }

        override protected void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            //علشان لو تحب تغير الاسامي باستخدام fluentapi
        }
       public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<Address> Addresses { get; set; }

        public static async Task SeeduserAsyn(UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Mohamed",
                    Email = "mohamed@test.com",
                    UserName = "mohamed@test.com",
                    Address = new Address
                    {
                        FirstName = "Mohamed",
                        LastName = "Talaat",
                        Street = "123 Test St",
                        City = "Cairo",
                        ZipCode = "12345"
                    }
                };
               await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}
