using ECommerce.Domain.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
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
            OrderAddress shipToAddress, DeliveryMethod deliveryMethod,decimal subtotal ,string BuyerAuth0Id)
        {
            BuyerEmail = buyerEmail;
            ShipToAddress = shipToAddress;
            DeliveryMethod = deliveryMethod;
            OrderItems = orderItems;
            Subtotal = subtotal;
            this.BuyerAuth0Id = int.Parse(BuyerAuth0Id);
        }
        public string? BuyerEmail { get; set; } //دا هنجيبه من لتوكن بتاعه
        public int BuyerAuth0Id { get; set; }
        public string BuyerName { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.UtcNow;
        public OrderAddress ShipToAddress { get; set; }
        public DeliveryMethod DeliveryMethod { get; set; }
        public List<OrderItem> OrderItems { get; set; }
        [NotMapped]
        //public decimal Subtotal => OrderItems?.Sum(item => item.Price * item.Quantity) ?? 0; 
        public decimal Subtotal { get; set; }
        public OrderStatus Status { get; set; } = OrderStatus.Pending;
        public string? Fawaterk_InvoiceId { get; set; }

        public decimal GetTotal() => Subtotal + (DeliveryMethod?.Price ?? 0);
    }
}
