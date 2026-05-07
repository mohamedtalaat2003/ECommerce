using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Helpers
{
    public class FawaterkData
    {
        public int InvoiceId { get; set; } // اللي هنخزنه في الأوردر
        public string Url { get; set; }
        // لينك الدفع اللي هنحول اليوزر عليه
        public string Status { get; set; }
    }
}
