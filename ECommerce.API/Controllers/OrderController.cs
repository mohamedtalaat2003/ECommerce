using AutoMapper;
using ECommerce.Application.DTOs;
using ECommerce.Application.Global_Error_Handling;
using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ECommerce.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        
        
        public OrderController(IOrderService orderService,IMapper mapper)
        {
            _orderService = orderService;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<OrderToReturnDto>> CreateOrder(orderDto orderDto)
        {
            if(orderDto == null) 
                NotFound(new ApiResponse(404));

                var email = User.FindFirstValue(ClaimTypes.Email);
            if(email == null) 
                NotFound(new ApiResponse(404));

            var address = _mapper.Map<AddressDto, OrderAddress>(orderDto.ShipToAddress);
            if (address == null)
                NotFound(new ApiResponse(404));

                    var order = await _orderService.CreateOrderAsync(email, orderDto.DeliveryMethodId, orderDto.BasketId, address);
            if (order == null) return BadRequest(new ApiResponse(400, "probelm creating order"));
            
            return Ok(_mapper.Map<Order, OrderToReturnDto>(order));
        }
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<OrderToReturnDto>>> GetOrderForUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null)
                NotFound(new ApiResponse(404));

            var orders = await _orderService.GetOrdersForUserAsync(email);
            if (orders == null)
                NotFound(new ApiResponse(404));

                return Ok(_mapper.Map<IReadOnlyList<Order>, IReadOnlyList<OrderToReturnDto>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderToReturnDto>>GetOrderByIdForUser(int id)
        {
            if(id <= 0) return BadRequest(new ApiResponse(400, "Invalid Id"));

            var email = User.FindFirstValue(ClaimTypes.Email);
            if (email == null)
                NotFound(new ApiResponse(404));

                var order = await _orderService.GetOrderByIdAsync(id, email);

            if (order == null) return NotFound(new ApiResponse(404));
            return Ok(_mapper.Map<Order,OrderToReturnDto>(order));
        }

        [HttpGet("deliveryMethods")]
        public async Task<ActionResult<IReadOnlyList<DeliveryMethod>>> GetDeliveryMethods()
        {
            return Ok(await _orderService.GetDeliveryMethodsAsync());
        }

    }
}
