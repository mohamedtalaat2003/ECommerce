using ECommerce.Application.DTOs;
using ECommerce.Application.Global_Error_Handling;
using ECommerce.Application.Repositories;
using ECommerce.Application.Repositories.Contract.Common;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Enum;
using ECommerce.Domain.Specifications;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PayementController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IBasketRepository _basketRepository;

        public PayementController(IUnitOfWork unitOfWork, IBasketRepository basketRepository)
        {
            _unitOfWork = unitOfWork;
            _basketRepository = basketRepository;
        }

        public async Task<ActionResult> FawaterkWebhook(FawaterkWebhookDto webhookDto)
        {
            var spec = new OrderWithItemsByInvoiceIdSpecification(webhookDto.InvoiceId.ToString());
            var order = await _unitOfWork.Repository<Order>().GetEntitiesWithSpecAsync(spec);

            if (order ==null) return NotFound(new ApiResponse(404, "Order not found"));

            if(webhookDto.OrderStatus == "paid")
            {
                order.Status = OrderStatus.PaymentReceived;
                await _basketRepository.DeleteBasketAsync(order.BuyerAuth0Id);
            }
            else if(webhookDto.OrderStatus == "failed")
            {
                order.Status = OrderStatus.PaymentFailed;
            }

            await _unitOfWork.CompleteAsync();
            return Ok();

        }
    }
}
