using AutoMapper;
using ECommerce.Application.DTOs;
using ECommerce.Application.Global_Error_Handling;
using ECommerce.Application.Repositories.Contract.Common;
using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
        [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        public ProductController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
        }

        //FromQuery بتخلي swigger يفك الاوبجكت أكن حاطط parameters بال props اللي في ال params
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetAll([FromQuery]ProductSpecParams sepcParams)
        {
            if(sepcParams == null) 
                return BadRequest(new ApiResponse(400, "Invalid parameters"));

            var spec = new productWithBrandAndCategoriesSpecification(sepcParams);

            var products = await _unitOfWork.Repository<Product>().ListSpecificationAsync(spec);
    
            if(products == null)
                return NotFound(new ApiResponse(404));

            return Ok(_mapper.Map<IReadOnlyList<Product>,IReadOnlyList<ProductToReturnDto>>(products));
        }
        [AllowAnonymous]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> Get(int id)
        {
            if (id <= 0)
                return BadRequest(new ApiResponse(400, "Invalid ID"));

            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);

            if (product == null) 
                return NotFound(new ApiResponse(404)); 

            return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        }

        [HttpPost]
        public async Task<ActionResult> Create([FromForm]ProductCreateDto productDto)
        {
            if(productDto == null) 
                return BadRequest(new ApiResponse(400,"Invalid product data"));

            var photoResult = await _photoService.AddPhotoAsync(productDto.Photo);

            if (photoResult.Error != null) 
                return BadRequest(photoResult.Error.Message);

            var product = _mapper.Map<ProductCreateDto, Product>(productDto);

            if (product == null) 
                return NotFound(new ApiResponse(404));

            product.PublicId = photoResult.PublicId;
            product.PictureUrl = photoResult.SecureUrl.AbsoluteUri;

            await _unitOfWork.Repository<Product>().AddAsync(product);

            int result;
            try 
            {
                result = await _unitOfWork.CompleteAsync();
            }
            catch(Exception ex)
            {
                await _photoService.DeletePhotoAsync(photoResult.PublicId);
                var innerMsg = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return BadRequest(new ApiResponse(400, "DB Error: " + innerMsg));
            }

            if(result <=0)
            {
                await _photoService.DeletePhotoAsync(photoResult.PublicId);
                return BadRequest(new ApiResponse(400,"Failed to create product"));
            }

            return CreatedAtAction(nameof(Get),new {id = product.Id} , productDto);
        }

        [HttpPut("{id}/photo")]
        public async Task<ActionResult> Update(int id , [FromForm] ProductToReturnDto productDto , IFormFile file)
        {
            if (id != productDto.Id || id <= 0) 
                return BadRequest(new ApiResponse(400,"ID mismatch"));

            var productInDb = await _unitOfWork.Repository<Product>().GetByIdAsync(id);

            if (productInDb == null)
                return NotFound(new ApiResponse(404));

            _mapper.Map(productDto, productInDb);

            if(!string.IsNullOrEmpty(productInDb.PublicId))
            {
                var deletionResult = await _photoService.DeletePhotoAsync(productInDb.PublicId);
                if(deletionResult.Error != null) return BadRequest(deletionResult.Error.Message);
            }

            var uploadResult = await _photoService.AddPhotoAsync(file);
            if(uploadResult.Error != null) return BadRequest(uploadResult.Error.Message);

            productInDb.PictureUrl = uploadResult.SecureUrl.AbsoluteUri;
            productInDb.PublicId = uploadResult.PublicId;


            _unitOfWork.Repository<Product>().Update(productInDb);
            var result = await _unitOfWork.CompleteAsync();
            if (result <= 0)
            {
                await _photoService.DeletePhotoAsync(uploadResult.PublicId);
                return BadRequest(new ApiResponse(400, "Failed to update product"));
            }

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            if (id <= 0)
                return BadRequest(new ApiResponse(400, "Invalid ID"));

            var productDeleted = await _unitOfWork.Repository<Product>().GetByIdAsync(id);

            if (productDeleted == null) 
                return NotFound(new ApiResponse(404));

            if (!string.IsNullOrEmpty(productDeleted.PublicId))
            {
                await _photoService.DeletePhotoAsync(productDeleted.PublicId);
            }

            await _unitOfWork.Repository<Product>().Delete(id);

           var result =  await _unitOfWork.CompleteAsync();
            if (result <= 0)
            {
                return BadRequest(new ApiResponse(400, "Failed to delete product"));
            }

            return NoContent();
        }
    }
}
