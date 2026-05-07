using ECommerce.Domain.Entities;

namespace ECommerce.Application.Services
{
    public interface IOrderService
    {
        //buyerEmail: هنجيبه من الـ HttpContext.User (يعني الـ Current User من التوكن).
        //deliveryMethodId: اليوزر هيختاره من لستة شركات الشحن اللي لسه ضايفينها فوق.
        //shippingAddress: هناخده من الـ AddressDto اللي اليوزر هيدخله في شاشة الـ Checkout.
        //basketId: هتبعته من الـ Frontend(اللي هو الـ GUID بتاع Redis).
        Task<Order> CreateOrderAsync(string buyerEmail, int deliverymethodId, int basketId, OrderAddress shippingAddress);
        Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail);
        Task<Order> GetOrderByIdAsync(int id, string buyerEmail);

        Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync();

    }
}
