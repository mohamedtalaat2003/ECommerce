using AutoMapper;
using ECommerce.Application.DTOs;
using ECommerce.Application.Repositories;
using ECommerce.Application.Repositories.Contract.Common;
using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using ECommerce.Domain.Specifications;

namespace ECommerce.Infrastructure.Implementation
{
    public class OrderService : IOrderService
    {
        private readonly IBasketRepository _basketRepository;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public OrderService(IBasketRepository basketRepository, IUnitOfWork unitOfWork,IMapper mapper)
        {
            _basketRepository = basketRepository;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }



        public async Task<Order> CreateOrderAsync(string buyerEmail, string auth0Id ,int deliverymethodId, int basketId, AddressDto shippingAddress)
        {
            var basket = await _basketRepository.GetBasketAsync(basketId.ToString());//هاتب الباسكت من الريدس
            if (basket == null) return null;
            var items = new List<OrderItem>();

               
            var ProductIds = basket.Items.Select(i => i.Id).ToList();
            var spec = new ProductsByIdsSpecification(ProductIds);

            var products = await _unitOfWork.Repository<Product>().ListSpecificationAsync(spec);

            foreach (var item in basket.Items)
            { 
                var productItem = products.FirstOrDefault(p => p.Id == item.Id);
                if (productItem == null) return null;
                var itemOrder = new ProductItemOrdered(productItem.Id, productItem.Name, productItem.PictureUrl);
                var OrderItem = new OrderItem(itemOrder, productItem.Price, item.Quantity);
                if(OrderItem == null) return null;
                items.Add(OrderItem);
            }

            var deliveryMethod = await _unitOfWork.Repository<DeliveryMethod>().GetByIdAsync(deliverymethodId);
            var subtotal = items.Sum(item => item.Price * item.Quantity);
            var order = new Order( items, buyerEmail, _mapper.Map<AddressDto, OrderAddress>(shippingAddress), deliveryMethod,subtotal, auth0Id);

            await _unitOfWork.Repository<Order>().AddAsync(order);

            var result = await _unitOfWork.CompleteAsync();

            if (result <= 0) return null;

            await _basketRepository.DeleteBasketAsync(basketId.ToString());
            return order;
        }

        public async Task<IReadOnlyList<DeliveryMethod>> GetDeliveryMethodsAsync()
        {
            return await _unitOfWork.Repository<DeliveryMethod>().GetAllAsync();
        }

        public async Task<Order> GetOrderByIdAsync(int id, string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(id, buyerEmail);
            return await _unitOfWork.Repository<Order>().GetEntitiesWithSpecAsync(spec);
        }

        public async Task<IReadOnlyList<Order>> GetOrdersForUserAsync(string buyerEmail)
        {
            var spec = new OrdersWithItemsAndOrderingSpecification(buyerEmail);
            return await _unitOfWork.Repository<Order>().ListSpecificationAsync(spec);
        }
    }
}
