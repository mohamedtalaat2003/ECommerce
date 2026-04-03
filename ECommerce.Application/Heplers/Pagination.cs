using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ECommerce.Application.Heplers
{
    public class Pagination<T> where T :class
    {
        public Pagination( int pageIndex , int pageSize , int count , IReadOnlyList<T> data) 
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            Data = data;
        }

        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int Count { get; set; }
        public IReadOnlyList<T> Data { get; set; }


        public int TotalPages => (int)Math.Ceiling(Count / (double)PageSize);
    }
}
