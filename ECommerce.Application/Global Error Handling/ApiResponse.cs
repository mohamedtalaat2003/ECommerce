using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Global_Error_Handling
{
    //used to unit response from api , Used in Exception middleware
    public class ApiResponse
    {
        public int StatusCode { get; set; }
        public string Message { get; set; }
        public ApiResponse(int statusCode, string message = null)
        {
            StatusCode = statusCode;
            // Null coalescing Operator
            //if message not null used it if null use default
            Message = message?? GetDefaultMessageForStatusCode(StatusCode);
        }

        private string GetDefaultMessageForStatusCode(int statusCode)
        {
            return statusCode switch
            {
                400 => "A bad request you have made",
                401 => "Authorized , you are not",
                404 => "Resource found , it was not",
                500 => "An unexpected error occurred on our server.",
                _ => null
            };
        }
    }
}

