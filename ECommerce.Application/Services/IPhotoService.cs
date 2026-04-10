using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;

namespace ECommerce.Application.Services
{
    //use interface to open to extenstion if iwant to alter to aws or auzerBlob
    public interface IPhotoService
    {
        //ImageUploadResult: this is the result of the upload process, it contains information about the uploaded image, such as its URL and public ID.
        //came from cloudinary
        Task<ImageUploadResult> AddPhotoAsync(IFormFile file); //upload photo
        Task<DeletionResult> DeletePhotoAsync(string publiId);
        
    }
}
