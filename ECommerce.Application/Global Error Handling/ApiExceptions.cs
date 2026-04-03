using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Global_Error_Handling
{
    // advanced from apiResponse to handle exceptions and error , apiResponse handle just error not exception 
    //Used in Exception middleware
    public class ApiException  : ApiResponse
    {
        public string Details { get; set; }
        public ApiException(int statusCode, string message = null ,string details =null):base(statusCode,message)
        {
            Details = details;
        }
    }
}
