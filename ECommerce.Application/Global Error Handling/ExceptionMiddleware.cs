using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Serilog;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Hosting;
using System.Net;
using System.Text.Json;

namespace ECommerce.Application.Global_Error_Handling
{
    public class ExceptionMiddleware 
    {
        //روح للي بعدك في ال pipeline
        private readonly RequestDelegate _next;
        //سجل كل الاخطاء
        private readonly ILogger <ExceptionMiddleware> _logger;
        //بتعرف منه هل انت on develop or in production
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next , ILogger<ExceptionMiddleware>logger,IHostEnvironment env)
        {  
            _next = next; 
            _logger = logger; 
            _env = env; 
        }
        //بتشتغل مع كل request
        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                //خش علي اللي بعده لو مفيش error
                await _next(context);
            }
            catch(Exception ex)
            {
                //لو لقي ايرور اول حاجة يسجله
                _logger.LogError(ex, "An uhandled exception has occured : {Message}", ex.Message);
                //جهز ال response
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;


                var response = _env.IsDevelopment()
                    ? new ApiException(500, ex.Message, ex.StackTrace?.ToString())
                    : new ApiResponse(500);

                var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
                var json = JsonSerializer.Serialize(response, options);

                await context.Response.WriteAsync(json);
            }
        }

    }
}
