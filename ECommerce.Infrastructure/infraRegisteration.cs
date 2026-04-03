using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Text;

namespace ECommerce.Infrastructure
{
    public static class infraRegisteration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext < ECommerceDbContext> (
                options => {
                    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
                }
            );

            return services;
        }
    }
}
