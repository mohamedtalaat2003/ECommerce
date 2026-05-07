using ECommerce.Application.Helpers;
using ECommerce.Application.Repositories.Contract.Common;
using ECommerce.Application.Services;
using ECommerce.Domain.Entities;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Infrastructure.Implementation
{
    public class PaymentService : IPaymentService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _config;
        private IUnitOfWork _unitOfWork;
        public PaymentService(HttpClient httpClient, IConfiguration config, IUnitOfWork unitOfWork)
        {
            _httpClient = httpClient;
            _config = config;
            _unitOfWork = unitOfWork;
        }

        public async Task<string> CreateOrUpdatePaymentIntent(Order order)
        {
            var invioceData = new
            {
                cartTotal = order.GetTotal(),
                currency = "EGP",
                customer = new
                {
                    firstName = order.BuyerName,
                    email = order.BuyerEmail,
                },
                redirectionUrls = new
                {
                    successUrl = _config["Fawaterk:SuccessUrl"],
                    failUrl = _config["Fawaterk:FailUrl"],
                },
                cartItems = order.OrderItems.Select(i => new
                {
                    id = i.ItemOrdered.ProductItemId,
                    quantity = i.Quantity,
                    price = i.Price
                })
            };

            _httpClient.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _config["Fawaterk:ApiKey"]);

            var response =await _httpClient.PostAsJsonAsync("createInvioce", invioceData);

            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<FawaterkResponse>();
                order.Fawaterk_InvoiceId = result.Data.InvoiceId.ToString();
                await _unitOfWork.CompleteAsync();
                return result.Data.Url;
            }

            return null;
        }

        public async Task<string> CheckPaymentStatusAsync(string invoiceId)
        {
            var response = await _httpClient.GetAsync($"getInvoice/{invoiceId}");
            if(response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<FawaterkResponse>();
                return result.Data.Status;
            }
            return "Failed";
        }


    }
}
