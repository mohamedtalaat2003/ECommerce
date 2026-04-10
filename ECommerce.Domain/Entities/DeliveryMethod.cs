using CleanArchDemo.Domain.Entities;

namespace ECommerce.Domain.Entities
{
    public class DeliveryMethod:BaseClass
    {
        public string? ShortName { get; set; } // اسم الشركة  
        public string? DeliveryTime { get; set; } // الوقت المتوقع (مثلاً 2-3 أيام)
        public string? Description { get; set; } // وصف الخدمة
        public decimal Price { get; set; } // تكلفة الشحن

    }
}