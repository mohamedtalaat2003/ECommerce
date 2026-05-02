using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    //مش  محتاج هنا فالديشن لان لما بعمل create or update دا اللي ببعته لليوزر مش بستقبله علشان كدا مشمحتاج فالديشن
    public class UserDto
    {
        public string DisplayName { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
    }
}
