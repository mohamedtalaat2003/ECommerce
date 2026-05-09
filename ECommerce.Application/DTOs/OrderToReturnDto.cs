using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    // تفاصيل الاوردر لما اليوزر يحب يشوف تفاصيل الاودر الواحد بتاعه
    public class OrderToReturnDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LasttName { get; set; }
        public string BuyerEmail { get; set; }
        public DateTime OrderDate { get; set; }
        public string ShipToAddressStreet { get; set; }//autoMapper هيجمعهم
        public  string  Street { get; set; }
        public  string  City { get; set; }
        public  string  ZipCode { get; set; }
        public string DeliveryMethod { get; set; } // اسم شركة الشحن
        public decimal ShippingPrice { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Total { get; set; } //GetTotal الي عملناها
        public string Status { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new List<OrderItemDto>();
    }
}
