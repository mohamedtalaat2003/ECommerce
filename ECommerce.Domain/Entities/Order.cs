using ECommerce.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class Order : BaseClass
    {

        public Order()
        {
        }

        // 2. الكونستركتور ده اللي بنستخدمه في الـ OrderService
        public Order(IReadOnlyList<OrderItem> orderItems, string buyerEmail,
            OrderAddress shipToAddress, DeliveryMethod deliveryMethod , decimal subtotal)
        {
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            Subtotal = subtotal;
        }
        public string? BuyerEmail { get; set; } //دا هنجيبه من لتوكن بتاعه
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public OrderAddress ShipToAddress { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public IReadOnlyList<OrderItem> OrderItems { get; set; }
        public decimal Subtotal { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string? PaymentIntentId { get; set; }

        public decimal GetTotal()
        {
            return OrderItems.Sum(item => item.Price * item.Quantity);
        }
    }
}
