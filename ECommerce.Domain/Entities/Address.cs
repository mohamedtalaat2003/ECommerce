using CleanArchDemo.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace ECommerce.Domain.Entities
{
    public class Address: BaseClass
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string ZipCode { get; set; }
        [Required]
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }


    }
}