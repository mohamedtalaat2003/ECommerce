using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Entities
{
    public class CustomerBasket
    {

        public CustomerBasket() // to deserialize json to object
        {
        }
        public  CustomerBasket(string id)
        {
            Id = id;
        }
        public string Id { get; set; }
        public List<BasketItem>Items { get; set; } 
    }
}
