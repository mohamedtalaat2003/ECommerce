using ECommerce.Application.Global_Error_Handling;
using ECommerce.Application.Heplers;
using ECommerce.Domain.Entities;
using ECommerce.Infrastructure;
using ECommerce.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddInfrastructureServices(builder.Configuration);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//ربط swagger with Jwt علشان ابعت التوكن واجرب عليها ال Apis Authorize
builder.Services.AddSwaggerGen( c=>
{
    var securitySchema = new OpenApiSecurityScheme //“التطبيق بتاعي بيستخدم Authentication (JWT)، وعايزك تضيف زرار أدخل فيه التوكن”
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header, // التوكن هيتبعت في الهيدر
        Type = SecuritySchemeType.Http,//نوع ال الAuthen
        Scheme = "bearer",
        Reference = new OpenApiReference
        {
            Type = ReferenceType.SecurityScheme, 
            Id = "Bearer" //اسم الاسكيما اللي فوق
        }
    };
    c.AddSecurityDefinition("Bearer", securitySchema);//اربط الاسكيما بالاسم دا
    var securityRequirment = new OpenApiSecurityRequirement
    {
        {securitySchema,new []{"Bearer"} }
    };
    c.AddSecurityRequirement(securityRequirment);
}
    );
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));

//validation token when came with reqeust
//AddAuth=> بفعل الAuth بستخدام ال Jwt
//JwtBearerDefaults => Bearer Toekn
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options => //شروط التحقق
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true, // علشان هي ترو فهتأكد من ال signature // خليها ديما ترو 
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Token:Key"])),
        ValidIssuer = builder.Configuration["Token:Issuer"],//مكان التوكن اللي طالع منه
        ValidateIssuer = true,//فعل التحقق من مكان صور التوكن هل هوا نفس الشخص ولا لا اللي طلعله التوكن من المكان دا 
        ValidateAudience = false,//التوكن معمول لمين 
        ValidateLifetime = true
    };
}
);

var app = builder.Build();
app.UseMiddleware<ExceptionMiddleware>();

#region Migrate and Seed Database to test connection with neon
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<ECommerceDbContext>();
    var loggerFactory = services.GetRequiredService<ILoggerFactory>();


    try
    {
        await context.Database.MigrateAsync();
        await ECommerceContextSeed.SeedAsync(context);

        var userManager = services.GetRequiredService<UserManager<AppUser>>();
        var identityContext = services.GetRequiredService<AppIdentityDbContext>();
        await identityContext.Database.MigrateAsync();
        await AppIdentityDbContext.SeeduserAsyn(userManager);
    }
    catch (Exception ex)
    {
        var logger = loggerFactory.CreateLogger<Program>();
        logger.LogError(ex, "An error occurred during migration or seeding");
    }
}


#endregion

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
