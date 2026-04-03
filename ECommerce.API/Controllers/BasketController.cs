using ECommerce.Application.Repositories;
using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BasketController : ControllerBase
    {
        private readonly IBasketRepository _basketRepository;
        public BasketController(IBasketRepository basketRepository)
        {
            _basketRepository = basketRepository;
        }

        [HttpGet]
        public async Task<ActionResult<CustomerBasket>> GetBasketById(string Id)
        {
            var basket = await _basketRepository.GetBasketAsync(Id);
            return Ok(basket ?? new CustomerBasket(Id));// لو مش موجود رجع سلة فاضية بال Id والفرونت هو يشتغل بقا
        }

        /*. ليه الـ UpdateBasket بتاخد الـ Object كامل؟
دي نقطة احترافية؛ ال        ـ Basket في الـ Redis مش زي الـ SQL بنعدل سطر 
        (Row) واحد. إحنا في الـ Redis بنعمل Replace
        (استبدال) للـ JSON القديم بالـ JSON الجديد اللي فيه التعديلات.
        ده أسرع بكتير لأن الـ Redis "Key-Value Store".*/
        [HttpPost]
        public async Task<ActionResult<CustomerBasket>> UpdateBasket(CustomerBasket basket)
        {
            var updatedBasket = await _basketRepository.UpdateBasketAsync(basket);
            if (updatedBasket == null) return BadRequest("Problem updating the basket");
            return Ok(updatedBasket);
        }
        [HttpDelete]
        public async Task<ActionResult> DeleteBasket(string Id)
        {
            var result = await _basketRepository.DeleteBasketAsync(Id);
            return NoContent();
        }
    }
}
