using AutoMapper;
using ECommerce.Application.DTOs;
using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using static StackExchange.Redis.Role;

namespace ECommerce.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

    

        public AccountController(ITokenService tokenService , UserManager<AppUser> userManager,SignInManager<AppUser> signInManager, IMapper mapper)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user =await _userManager.FindByEmailAsync(loginDto.Email);
            if (user == null) return Unauthorized("Invalid Email");

            var result =await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password,false);
            if (!result.Succeeded) return Unauthorized("Invalid password");

            return new UserDto
            {
                Email = loginDto.Email,
                DisplayName = user.DisplayName,
                Token = _tokenService.CreateToken(user),
            };
        }

     
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _userManager.FindByEmailAsync(email);

            return new UserDto
            {
                Email = user.Email,
                Token = _tokenService.CreateToken(user),
                DisplayName = user.DisplayName
            };
        }
        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<ActionResult <UserDto>> Register(RegisterDto registerDto)
        {
            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result =await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded) return BadRequest("Registeration failed");

            return new UserDto
            {
                DisplayName = registerDto.DisplayName,
                Token = _tokenService.CreateToken(user),
                Email = registerDto.Email
            };
        }

        [HttpGet("emailExists")]
        public async Task<ActionResult<bool>> CheckEmailExistsAsync([FromQuery] string email)
        {
            return await _userManager.FindByEmailAsync(email) != null;
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetuserAddress()
        {
            var user = await _userManager.Users
                .Include(x => x.Address)
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user.Address == null) return Ok(new AddressDto());

            return Ok(_mapper.Map<Address, AddressDto>(user.Address));
        }

        [HttpPut]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto addressDto)
        {
            var user = await _userManager.Users
                .Include(x => x.Address)
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            user.Address = _mapper.Map<AddressDto, Address>(addressDto);

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded) return BadRequest("Problem updating the user");
            return Ok(_mapper.Map<Address, AddressDto>(user.Address));
            

        }
    }
}
