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
        public string FirstName { get; set; }

        [Required(ErrorMessage = "Last Name is Required")]
        public string LastName { get; set; }

        [Required]
        public string Street { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string ZipCode { get; set; }
    }


}
