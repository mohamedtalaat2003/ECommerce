using System;
using System.Collections.Generic;
using System.Text;

namespace CleanArchDemo.Domain.Entities
{
    public class Product :BaseClass
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public string? cloudinaryUrl { get; set; }
        public string? Brand { get; set; }
        public string? Type { get; set; }
    }
}
