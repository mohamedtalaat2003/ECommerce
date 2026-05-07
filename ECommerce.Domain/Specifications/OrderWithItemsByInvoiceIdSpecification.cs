using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Specifications
{
    public class OrderWithItemsByInvoiceIdSpecification : BaseSpecification<Order>
    {
        public OrderWithItemsByInvoiceIdSpecification(string invoiceId)
            : base(o => o.Fawaterk_InvoiceId == invoiceId)
        {
            AddInclude(o => o.OrderItems);
        }
    }
}
