using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Enum
{
    public enum OrderStatus
    {
        [EnumMember(Value = "Pending")]
        Pending,// اليوزر لسه مخلصش دفع
        [EnumMember(Value = "Payment Received")]
        PaymentReceived,// الفلوس وصلت
        [EnumMember(Value ="Payment Failed")]
        PaymentFailed,// الفيزا رفضت
        [EnumMember(Value ="Shipped")]
        Shipped// الأوردر خرج للشحن
    }
}
