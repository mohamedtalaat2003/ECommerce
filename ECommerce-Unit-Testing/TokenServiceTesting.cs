using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Moq;
using System.Security.Claims;

namespace ECommerce_Unit_Testing
{
    public class TokenServiceTesting
    {
        private readonly ITokenService _tokenService;
        public TokenServiceTesting(ITokenService tokenService)
        {
            _tokenService = tokenService;
        }

        [Fact]
        public async Task CreateToken_KeyNotConfigured_ThrowException()
        {
            var mockConfig = new Mock<IConfiguration>();
            mockConfig.Setup(config => config["JWT:Key"])
                .Returns((string)null);

            var mockUser = new Mock<AppUser>();
            var mockTokenService = _tokenService;

            await Assert.ThrowsAsync<InvalidOperationException>(async () =>
            {
               await mockTokenService.CreateToken(mockUser.Object);
            });
        }



        [Fact]
        public async Task GetJwtKey_KeyNotConfigured_ThrowsException()
        {
            var mockConfig = new Mock<IConfiguration>();

            mockConfig.Setup(config => config["Test_Configuations:Key"]).Returns((string)null);

            Assert.Throws<InvalidOperationException>(() =>
            {
                var actualKey = mockConfig.Object["Test_Configuations:Key"] ??
                    throw new InvalidOperationException("JWT key is not configured.");
            });
        }

        public async Task<string> CreateToken(AppUser user)
        {
            var key = _config["JWT:Key"] ??
                throw new InvalidOperationException("JWT key is not configured.");

            var issuer = _config["JWT:issuer"] ??
                throw new InvalidOperationException("JWT issuer is not configured.");

            var audience = _config["JWT:audience"] ??
                throw new InvalidOperationException("JWT audience is not configured.");

            //payload
            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(JwtRegisteredClaimNames.Email, user.Email??string.Empty),
                new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // unique identifier for the token)
            };

            var role = await _userManager.GetRolesAsync(user);
            claims.AddRange(role.Select(role => new Claim(ClaimTypes.Role, role)));

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature); //kesecret + algorithm used to secure token

            //setting the token descriptor
            //وصفة بناء ال jwt
            var tokenDescriptor =
               new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                notBefore: DateTime.UtcNow,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
                );


            return new JwtSecurityTokenHandler().WriteToken(tokenDescriptor); //convert the token to string
        }
    }
}
