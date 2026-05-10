using ECommerce.Application.DTOs;
using ECommerce.Application.Global_Error_Handling;
using ECommerce.Application.Repositories;
using ECommerce.Application.Repositories.Contract.Common;
using ECommerce.Application.Services;
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
        private readonly IPaymentService _paymentService;

        public PayementController(IUnitOfWork unitOfWork, IBasketRepository basketRepository, IPaymentService paymentService)
        {
            _unitOfWork = unitOfWork;
            _basketRepository = basketRepository;
            _paymentService = paymentService;
        }

        [HttpGet]
        public async Task<ActionResult> FawaterkWebhook(FawaterkWebhookDto webhookDto)
        {
            var spec = new OrderWithItemsByInvoiceIdSpecification(webhookDto.InvoiceId.ToString());
            var order = await _unitOfWork.Repository<Order>().GetEntitiesWithSpecAsync(spec);

            if (order == null) return NotFound(new ApiResponse(404, "Order not found"));

            if (webhookDto.OrderStatus == "paid")
            {
                order.Status = OrderStatus.PaymentReceived;
                await _basketRepository.DeleteBasketAsync(order.BuyerAuth0Id.ToString());
            }
            else if (webhookDto.OrderStatus == "failed")
            {
                order.Status = OrderStatus.PaymentFailed;
            }

            await _unitOfWork.CompleteAsync();
            return Ok();

        }

        [HttpPost("webhook")]
        public async Task<ActionResult> FawaterkWebhook()
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();
            var receivingSignature = Request.Headers["X-Fawaterk-Signature"];
            if(!_paymentService.VerifyHmacSignature(json, receivingSignature))
            {
                return Unauthorized();
            }

            var webhookDto = System.Text.Json.JsonSerializer.Deserialize<FawaterkWebhookDto>(json);

            var spec = new OrderWithItemsByInvoiceIdSpecification(webhookDto.InvoiceId.ToString());
            var order = await _unitOfWork.Repository<Order>().GetEntitiesWithSpecAsync(spec);

            if (webhookDto.OrderStatus == "paid")
            {
                order.Status = OrderStatus.PaymentReceived;
                await _basketRepository.DeleteBasketAsync(order.BuyerAuth0Id.ToString());
            }
            else if (webhookDto.OrderStatus == "failed"|| webhookDto.OrderStatus == "canceled")
            {
                order.Status = OrderStatus.PaymentFailed;
            }

            await _unitOfWork.CompleteAsync();

            return Ok();
        }
    }
}
