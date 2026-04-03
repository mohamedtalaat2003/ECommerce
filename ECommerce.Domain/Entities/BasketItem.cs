using CleanArchDemo.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class BasketItem :BaseClass
    {
        //public string Id { get; set; }
        public string? ProductName { get; set; }
        public decimal Price { get; set; }
        public int Quantity { get; set; }
         public string? PictureUrl { get; set; }
         public string? Brand { get; set; }
        public string? Category { get; set; }

    }
}
