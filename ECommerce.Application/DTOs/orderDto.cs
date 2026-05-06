using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    //دا المعلومات اللي اليوزر هيبعتها
    public class orderDto
    {
            [Required(ErrorMessage = "Basket ID is required")]
            public string BasketId { get; set; }

            [Required(ErrorMessage = "Delivery Method is required")]
            [Range(1, int.MaxValue, ErrorMessage = "Please select a valid delivery method")]
            public int DeliveryMethodId { get; set; }

            [Required(ErrorMessage = "Shipping address is required")]
            public AddressDto ShipToAddress { get; set; }
      }
}
