using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Infrastructure.Implementation
{
    public class TokenService : ITokenService
    {
        private readonly IConfiguration _config; // علشان اقدر اوصل ل ال appsetting
        private readonly SymmetricSecurityKey _key;// تقدر تقول عليه الختم اللي هيميز التوكن بتاع اليوزر عن غيره 
        private readonly UserManager<AppUser> _userManager;
        public TokenService(IConfiguration config, UserManager<AppUser> userManager)
        {
            _config = config;
            _userManager = userManager;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));//حول ال keysecret to bytes 
            //لأن التشفير بيشتغل بال bytes
            //SymmetricSecurityKey => convert bytes to a security key that can be used for signing the token , conver bytes to object to secure token
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
