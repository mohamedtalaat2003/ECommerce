using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.DTOs
{
    public class RegisterDto
    {
      
    [Required]
        public string DisplayName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        // بنحدد إنها باسورد عشان الـ Swagger يفهم
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Required]
        [DataType(DataType.Password)]
        // دي الزتونة: بتقول للسيستم قارنها بالـ Password
        [Compare("Password", ErrorMessage = "Password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

    }
}
