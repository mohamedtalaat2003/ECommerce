using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Heplers
{
    //علشان اجيب ال credetials in appsetting to convert to objects 
    //this process called configuration bindng
    public class CloudinarySettings
    {
        public string CloudName { get; set; }
        public string ApiKey { get; set; }
        public string ApiSecret { get; set; }
    }
}
