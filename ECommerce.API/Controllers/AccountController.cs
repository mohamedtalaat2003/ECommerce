using AutoMapper;
using ECommerce.Application.DTOs;
using ECommerce.Application.Global_Error_Handling;
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
            if(loginDto == null) 
                return NotFound(new ApiResponse(404));

            var user =await _userManager.FindByEmailAsync(loginDto.Email);

            if (user == null)
                return Unauthorized("Invalid Email");

            var result =await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password,false);

            if (!result.Succeeded)
                return Unauthorized(new ApiResponse(401,"Invalid password"));

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

            if(email == null) 
                return NotFound(new ApiResponse(404));

            var user = await _userManager.FindByEmailAsync(email);

            if(user == null)
                return 
                    Unauthorized(new ApiResponse(401, "User no longer exists"));

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
            if (registerDto == null)
                return NotFound(new ApiResponse(404));

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Email
            };

            var result =await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded)
                return BadRequest(new ApiResponse(400, "problem in registertion"));

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
            if (email == null)
                return NotFound(new ApiResponse(404));

            var user = await _userManager.FindByEmailAsync(email);

            if(user == null)
                NotFound(new ApiResponse(404));

            return Ok(user);
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetuserAddress()
        {
            var user = await _userManager.Users
                .Include(x => x.Address)
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user == null) 
                return Unauthorized(new ApiResponse(401, "User no longer exists"));

            if (user.Address == null || user==null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<Address, AddressDto>(user.Address));
        }

        [HttpPut]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress(AddressDto addressDto)
        {
            if (addressDto == null) 
                return NotFound(new ApiResponse(404));

            var user = await _userManager.Users
                .Include(x => x.Address)
                .SingleOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            if (user == null) 
                return Unauthorized(new ApiResponse(401, "User no longer exists"));

            if (user.Address == null) 
                return NotFound(new ApiResponse(404));

            user.Address = _mapper.Map<AddressDto, Address>(addressDto);

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded) 
                return BadRequest(new ApiResponse(400, "probelm Updateي Address"));

            return Ok(_mapper.Map<Address, AddressDto>(user.Address));
            

        }
    }
}
