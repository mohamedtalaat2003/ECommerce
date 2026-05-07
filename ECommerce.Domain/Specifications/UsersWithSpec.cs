using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Domain.Specifications
{
    public class UsersWithSpec:BaseSpecification<AppUser>
    {
        public UsersWithSpec(string email):base(e => e.Email == email)
        {
            AddInclude(u =>u.Address);
        }
    }
}
