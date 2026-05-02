using ECommerce.Application.Heplers;
using ECommerce.Application.Services;
using ECommerce.Application.Repositories.Contract.Common;
using ECommerce.Infrastructure.Implementation.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ECommerce.Application.Repositories;
using ECommerce.Infrastructure.Implementation;
using StackExchange.Redis;
using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace ECommerce.Infrastructure
{
    public static class infraRegisteration
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IBasketRepository, BasketRepository>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IOrderService, OrderService>();


            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddDbContext<ECommerceDbContext>(
                options =>
                {
                    options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"));
                }
            );
            services.AddDbContext<AppIdentityDbContext>(
                options =>
                {
                    options.UseNpgsql(configuration.GetConnectionString("IdentityConnection"));
                }
            );

            services.AddIdentityCore<AppUser>(options =>
            {
                options.Password.RequireNonAlphanumeric = true;
                options.Password.RequiredLength = 8;
                options.Password.RequireUppercase = true;
                options.Password.RequireLowercase = true;
            }).AddEntityFrameworkStores<AppIdentityDbContext>()
            .AddSignInManager<SignInManager<AppUser>>();

            services.AddSingleton<IConnectionMultiplexer>(c =>
            {
                var Configuration = ConfigurationOptions.Parse(configuration.GetConnectionString("Redis"), true);
                return ConnectionMultiplexer.Connect(Configuration);
            });




            return services;
        }
    }
}
