using CloudinaryDotNet;
using ECommerce.Application.Repositories;
using ECommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore.Storage;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ECommerce.Infrastructure.Implementation
{
    // convert object to json
    public class BasketRepository : IBasketRepository
    {
        private readonly StackExchange.Redis.IDatabase _database;

        //IConnectionMultiplexer => DI Created object to manage the connection to Redis server and get the database from it
        public BasketRepository(IConnectionMultiplexer redis)
        {
            _database = redis.GetDatabase() ; //GetDatabase =? return redisDb علشان تشتغل عليه
        }

        /*لما user يمسح basket:
ينادي DeleteBasketAsync
Redis يحذف key*/
        public Task<bool> DeleteBasketAsync(string basketId)
        {
            return _database.KeyDeleteAsync(basketId);// redis store data in key value pairs, so I can delete the basket by its id which is the key in redis
        }

        /*ينادي GetBasketAsync
          Redis يرجع JSON
يتحول object
          يرجع للـ client*/
        public async Task<CustomerBasket> GetBasketAsync(string basketId)
        {
            var data =await _database.StringGetAsync(basketId); // get the data from redis by its key which is the basketId  : this function return json or null
            return data.IsNullOrEmpty ? null : JsonSerializer.Deserialize<CustomerBasket>(data); /// convert json to the object
            //لان ال الريدس بيخزن الداتا ك جيسون وبيكون استرنج فبحول الاسترنج دا ل اوبجكت
        }


     
        //لما user يضيف منتج:
        //API يستقبل الطلب
        //ينادي UpdateBasketAsync
        //يتحول JSON
        //يتحفظ في Redis

        public async Task<CustomerBasket> UpdateBasketAsync(CustomerBasket basket)
        {
            //                            store in redis                          convert object t json           redis store temporary data for 30 days
            var created = await _database.StringSetAsync(basket.Id.ToString(), JsonSerializer.Serialize(basket), TimeSpan.FromDays(30));

            if (!created) return null; // if the basket is not created return null
            return await GetBasketAsync(basket.Id.ToString());
        }
    }
}
