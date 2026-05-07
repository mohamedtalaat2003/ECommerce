using ECommerce.Domain.Entities;

namespace ECommerce.Application.Repositories
{
    public interface IBasketRepository
    {
        Task<CustomerBasket> GetBasketAsync(int basketId);
        Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket);
        Task<bool> DeleteBasketAsync(int basketId);
    }
}
