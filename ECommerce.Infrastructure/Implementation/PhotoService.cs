using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using ECommerce.Application.Helpers;
using ECommerce.Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Infrastructure.Implementation
{
    public class PhotoService : IPhotoService
    {
        private readonly Cloudinary _cloudinary;

        // بسجل دخولي يعتبر خطوة أساسية عشان أقدر أستخدم خدمات كلاودناري، لازم يكون عندي حساب وأجيب بياناته
        public PhotoService(IOptions<CloudinarySettings> config) // connect to cloudinary account
        {
            var acc = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
                );
            _cloudinary = new Cloudinary(acc); 
            _cloudinary.Api.Secure = true; // عشان الصور تكون محمية
            // to generate https no http
        }

        //ImageUploadParams => يمثل الداتا اللي هيعتها لل ال Cloudinary  , يعني هو الريكويست بمعلومات الصورة بحطها فيه 
        //ImageUploadResult => response from Cloudinary علشان اخزن ال URl بتاع الصورة

        public async Task<ImageUploadResult> AddPhotoAsync(IFormFile file) // to upload photo to cloudinary and get the result of the upload
        {
            var uploadResult = new ImageUploadResult();
            if(file.Length > 0)
            {
                if (file.Length > 2 * 1024 * 1024) throw new Exception("File exceeds 2MB limit");
                var allowExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif" };
                var extensionPath = Path.GetExtension(file.FileName).ToLower();
                if(!allowExtensions.Contains(extensionPath))
                    throw new Exception("Invalid file type. Only JPG, PNG, and GIF are allowed.");

                using var stream = file.OpenReadStream(); // read photo as bytes to send it to Api
                //لأن كل صورة ببتتبعت بتتفكك ل packets صغيرة وكل packet بيمثل bytes فيه ففببعت البايتس دي تتجمع في ال Cloudinary
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream), //this photo that upload it to cloudinary
                    Transformation = new Transformation().Height(500).Width(500) // to make the photo 500*500 and crop it to focus on face
                };
                uploadResult = await _cloudinary.UploadAsync(uploadParams);
            }
            return uploadResult;
        }

        public async Task<DeletionResult> DeletePhotoAsync(string publiId)
        {
            var deleteParams = new DeletionParams(publiId);
            return await _cloudinary.DestroyAsync(deleteParams);
        }
    }
}
