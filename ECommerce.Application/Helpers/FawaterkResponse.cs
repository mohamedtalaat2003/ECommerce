using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Helpers
{
    public class FawaterkResponse
    {
        public string Status { get; set; } // "success" or "error"
        public FawaterkData Data { get; set; }
    }
}
