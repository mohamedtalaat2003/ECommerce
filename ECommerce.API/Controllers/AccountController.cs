using AutoMapper;
using ECommerce.Application.DTOs;
using ECommerce.Application.Global_Error_Handling;
using ECommerce.Application.Repositories.Contract.Common;
using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Specifications;
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
        private readonly IUnitOfWork _unitOfWork;

    

        public AccountController(ITokenService tokenService , UserManager<AppUser> userManager,SignInManager<AppUser> signInManager, IMapper mapper,IUnitOfWork unitOfWork)
        {
            _tokenService = tokenService;
            _userManager = userManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _unitOfWork = unitOfWork;
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            if(loginDto == null) 
                return BadRequest(new ApiResponse(400));

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
                return BadRequest(new ApiResponse(400));

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
               return Ok(false);

            return Ok(true);
        }

        [Authorize]
        [HttpGet("address")]
        public async Task<ActionResult<AddressDto>> GetuserAddress()
        {
            var userWithAddress = _userManager.Users.Include(u => u.Address);
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await userWithAddress.SingleOrDefaultAsync(x => x.Email == email);

            if (user == null) 
                return Unauthorized(new ApiResponse(401, "User no longer exists"));

            if (user.Address == null) return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<Address, AddressDto>(user.Address));
        }

        [HttpPut]
        public async Task<ActionResult<AddressDto>> UpdateUserAddress([FromBody]AddressDto addressDto)
        {

            var userWithAddress = _userManager.Users.Include(u => u.Address);
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await userWithAddress.SingleOrDefaultAsync(x => x.Email == email);


            if (user == null) 
                return Unauthorized(new ApiResponse(401, "User no longer exists"));

            if (user.Address == null) 
                user.Address = _mapper.Map<AddressDto, Address>(addressDto);
            else
                _mapper.Map(addressDto, user.Address);

            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded) 
                return BadRequest(new ApiResponse(400, "probelm Update Address"));

            return Ok(_mapper.Map<Address, AddressDto>(user.Address));
            

        }
    }
}
