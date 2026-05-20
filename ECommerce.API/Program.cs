using ECommerce.Application.Global_Error_Handling;
using ECommerce.Application.Helpers;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using ECommerce.Infrastructure.Data;

using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

#region Services

builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddInfrastructureServices(builder.Configuration);

#region DbContexts

builder.Services.AddDbContext<ECommerceDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddDbContext<AppIdentityDbContext>(options =>
{
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("IdentityConnection"));
});

#endregion

#region Cloudinary

builder.Services.Configure<CloudinarySettings>(
    builder.Configuration.GetSection("CloudinarySettings"));

#endregion

#region Authentication

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = "localJwt";
    options.DefaultChallengeScheme = "localJwt";
})
.AddJwtBearer("localJwt", options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,

        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Token:Key"])
        ),

        ValidIssuer = builder.Configuration["Token:Issuer"],
        ValidateIssuer = true,

        ValidateAudience = false,

        ValidateLifetime = true
    };
})
.AddJwtBearer("Auth0", options =>
{
    options.Authority =
        $"https://{builder.Configuration["Auth0:Domain"]}/";

    options.Audience =
        builder.Configuration["Auth0:Audience"];

    options.TokenValidationParameters =
        new TokenValidationParameters
        {
            NameClaimType = ClaimTypes.NameIdentifier
        };
});

#endregion

#region CORS

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins(
                  "http://localhost:4200",
                  "http://localhost:3000",
                  "https://aura-e-commerce.vercel.app",
                  "https://aura-e-commerce-adel-mahmoud10s-projects.vercel.app"
              )
              .SetIsOriginAllowedToAllowWildcardSubdomains();
    });
});

#endregion

#region Swagger

builder.Services.AddSwaggerGen(c =>
{
    var securitySchema = new OpenApiSecurityScheme
    {
        Description =
            "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",

        Name = "Authorization",

        In = ParameterLocation.Header,

        Type = SecuritySchemeType.Http,

        Scheme = "bearer",

        BearerFormat = "JWT",

        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };

    c.AddSecurityDefinition("Bearer", securitySchema);

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            securitySchema,
            Array.Empty<string>()
        }
    });
});

#endregion

#endregion

var app = builder.Build();

#region Middlewares

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("CorsPolicy");

app.UseAuthentication();

app.UseAuthorization();

#endregion

#region Migrate & Seed Database

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context =
        services.GetRequiredService<ECommerceDbContext>();

    var identityContext =
        services.GetRequiredService<AppIdentityDbContext>();

    var userManager =
        services.GetRequiredService<UserManager<AppUser>>();

    var loggerFactory =
        services.GetRequiredService<ILoggerFactory>();

    try
    {
        await identityContext.Database.MigrateAsync();

        await AppIdentityDbContext.SeeduserAsyn(userManager);

        await context.Database.MigrateAsync();

        await ECommerceContextSeed.SeedAsync(context);
    }
    catch (Exception ex)
    {
        var logger = loggerFactory.CreateLogger<Program>();

        logger.LogError(
            ex,
            "An error occurred during migration or seeding");
    }
}

#endregion

app.MapControllers();

app.Run();