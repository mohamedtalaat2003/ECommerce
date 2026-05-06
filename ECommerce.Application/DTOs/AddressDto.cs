using ECommerce.Domain.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class AddressDto
    {

        [Required(ErrorMessage = "First Name is Required")]
        public string FirstName { get; set; } // شيلنا الـ ? عشان الضمان

        [Required(ErrorMessage = "Last Name is Required")]
        public string LastName { get; set; }

        [Required(ErrorMessage = "Street address is required")]
        public string Street { get; set; }

        [Required(ErrorMessage = "City is required")]
        public string City { get; set; }

        [Required(ErrorMessage = "Zip Code is required")]
        public string ZipCode { get; set; }
    }


}
