using ECommerce.Domain.Entities;

namespace ECommerce.Application.Services
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}
