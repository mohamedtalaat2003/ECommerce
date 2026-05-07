using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Services
{
    public interface IPaymentService
    {
        Task<string> CreateOrUpdatePaymentIntent(Order order);
        Task<string> CheckPaymentStatusAsync(string invoiceId);
    }
}
