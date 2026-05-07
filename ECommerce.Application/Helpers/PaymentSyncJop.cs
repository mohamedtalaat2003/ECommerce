using ECommerce.Application.Repositories.Contract.Common;
using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enum;
using Quartz;
using Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Helpers
{
    public class PaymentSyncJop : IJob 
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPaymentService _paymentService;

        public PaymentSyncJop(IUnitOfWork unitOfWork,IPaymentService paymentService)
        {
            _unitOfWork = unitOfWork;
            _paymentService = paymentService;
        }

        public async Task Execute(IJobExecutionContext context)
        {
            var pendingOrder = await _unitOfWork.Repository<Order>()
    .GetByExpressionAsync(o => o.Status == OrderStatus.Pending);
            foreach(var order in pendingOrder)
            {
                var paymentStatus = await _paymentService.CheckPaymentStatusAsync(order.Fawaterk_InvoiceId);
                if(paymentStatus == "Paid")
                {
                    order.Status = OrderStatus.PaymentReceived;
                    _unitOfWork.Repository<Order>().Update(order);
                }
                else if(paymentStatus == "Expired")
                {
                    order.Status = OrderStatus.PaymentFailed;
                    _unitOfWork.Repository<Order>().Update(order);
                }
            }
            await _unitOfWork.CompleteAsync();
        }

    
    }
}
