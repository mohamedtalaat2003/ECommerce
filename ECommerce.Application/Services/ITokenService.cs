using ECommerce.Domain.Entities;

namespace ECommerce.Application.Services
{
    public interface ITokenService
    {
        string CreateToken(AppUser user);
    }
}
