using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
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
        public TokenService(IConfiguration config)
        {
            _config = config;
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Token:Key"]));//حول ال keysecret to bytes 
            //لأن التشفير بيشتغل بال bytes
            //SymmetricSecurityKey => convert bytes to a security key that can be used for signing the token , conver bytes to object to secure token
        }

        public string CreateToken(AppUser user)
        {
            //payload
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email,user.Email),
                new Claim(ClaimTypes.GivenName,user.DisplayName),
            };

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature); //kesecret + algorithm used to secure token

            //setting the token descriptor
            //وصفة بناء ال jwt
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims), //put claims in the token
                Expires = DateTime.Now.AddDays(7),//expiration time for the token
                SigningCredentials = creds, // key secret + hash
                Issuer = _config["Token:Issuer"], // من اصدر ال توكن
            };

            var tokenHandler = new JwtSecurityTokenHandler();// manage token read and analys and validation
            var token = tokenHandler.CreateToken(tokenDescriptor);// real token
            return tokenHandler.WriteToken(token);// convert token to string
        }
    }
}
