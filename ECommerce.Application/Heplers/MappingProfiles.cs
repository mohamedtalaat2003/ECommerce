using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using CleanArchDemo.Domain.Entities;
using ECommerce.Application.DTOs;
using ECommerce.Domain.Entities;
namespace ECommerce.Application.Heplers
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles() 
        {
            CreateMap<Product, ProductToReturnDto>()
            .ForMember(d => d.BrandName, o => o.MapFrom(s => s.ProductBrand.Name))
            .ForMember(d => d.CategoryName, o => o.MapFrom(s => s.ProductCategory.Name))
            .ReverseMap()
            // بنقول للمابر: وأنت راجع للـ Entity، استخدم الـ IDs اللي مبعوتة
            // ومتحاولش تحول الـ String لأوبجكت كامل
            .ForMember(dest => dest.ProductBrand, opt => opt.Ignore())
            .ForMember(dest => dest.ProductCategory, opt => opt.Ignore());


            CreateMap<ProductCreateDto, Product>()
                .ForMember(dest => dest.PictureUrl, opt => opt.Ignore())
                .ForMember(dest => dest.PublicId, opt => opt.Ignore());


            // بنقول للمابر: وأنت راجع للـ Entity، استخدم الـ IDs اللي مبعوتة
            // ومتحاولش تحول الـ String لأوبجكت كامل

            CreateMap<Address, AddressDto>().ReverseMap();
            CreateMap<AddressDto, OrderAddress>().ReverseMap();
            CreateMap<Order, OrderToReturnDto>()
                .ForMember(d => d.DeliveryMethod, o => o.MapFrom(s => s.DeliveryMethod.ShortName))
                .ForMember(d => d.ShippingPrice, o => o.MapFrom(s => s.DeliveryMethod.Price))
                .ForMember(d => d.Subtotal, o => o.MapFrom(s => s.GetTotal()));

            //تجاهلنا حاجات علشان مش مهم اليوزر يشوفها
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(d => d.ProductId, o => o.MapFrom(s => s.ItemOrdered.ProductItemId))
                .ForMember(d => d.ProductName, o => o.MapFrom(s => s.ItemOrdered.Name))
                .ForMember(d => d.PictureUrl, o => o.MapFrom(s => s.ItemOrdered.PictureUrl));
        }
    }
}
