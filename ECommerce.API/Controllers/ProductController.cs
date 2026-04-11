using AutoMapper;
using ECommerce.Application.DTOs;
using ECommerce.Application.Repositories.Contract.Common;
using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Specifications;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ECommerce.API.Controllers
{
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
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<ProductToReturnDto>>> GetAll([FromQuery]ProductSpecParams sepcParams)
        {
            var spec = new productWithBrandAndCategoriesSpecification(sepcParams);
            var products = await _unitOfWork.Repository<Product>().ListSpecificationAsync(spec);
            return Ok(_mapper.Map<IReadOnlyList<Product>,IReadOnlyList<ProductToReturnDto>>(products));
        }
        [Authorize]
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductToReturnDto>> Get(int id)
        {
            if (id <= 0) return BadRequest();
            var product = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
            if (product == null) return NotFound();

            return Ok(_mapper.Map<Product, ProductToReturnDto>(product));
        }

        [HttpPost]
        public async Task<ActionResult> Creat([FromForm] ProductCreateDto productDto)
        {
            var product = _mapper.Map<ProductCreateDto, Product>(productDto);
            if (product == null) return BadRequest();

            // 2. ارفع الصورة الأول
            var photoResult = await _photoService.AddPhotoAsync(productDto.Photo);
            if (photoResult.Error != null) return BadRequest(photoResult.Error.Message);

            product.PublicId = photoResult.PublicId;
            product.PictureUrl = photoResult.SecureUrl.AbsoluteUri;

            await _unitOfWork.Repository<Product>().AddAsync(product);

            var result = await _unitOfWork.CompleteAsync();

            if (result <= 0)
            {
                await _photoService.DeletePhotoAsync(product.PublicId);
                return BadRequest("Problem saving product to database");
            }

            return CreatedAtAction(nameof(Get), new { id = product.Id }, productDto);
        }

        [HttpPut("{id}/photo")]
        public async Task<ActionResult> Update(int id , [FromForm] ProductToReturnDto productDto , IFormFile file)
        {
            if (id != productDto.Id) return BadRequest("ID mismatch");

            var productInDb = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
            if (productInDb == null) return NotFound();

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
            await _unitOfWork.CompleteAsync();

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(int id)
        {
            var productDeleted = await _unitOfWork.Repository<Product>().GetByIdAsync(id);
            if (productDeleted == null) return NotFound();
            if (!string.IsNullOrEmpty(productDeleted.PublicId))
            {
                await _photoService.DeletePhotoAsync(productDeleted.PublicId);
            }
            _unitOfWork.Repository<Product>().Delete(id);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}
