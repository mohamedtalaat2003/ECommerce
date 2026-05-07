using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class FawaterkWebhookDto
    {
        public string Event { get; set; } // مثل "invoice.paid"
        public int InvoiceId { get; set; } // الـ ID اللي خزناه في الأوردر
        public string OrderStatus { get; set; } // حالة الدفع الجديدة
    }
}
