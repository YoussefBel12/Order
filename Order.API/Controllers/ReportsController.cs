using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Order.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReportsController : ControllerBase
    {
        private readonly OrderDbContext _context;

        public ReportsController(OrderDbContext context)
        {
            _context = context;
        }

        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var totalProducts = await _context.Products.CountAsync();
            var totalPurchases = await _context.Purchases.CountAsync();
            var totalBills = await _context.Bills.CountAsync();
            var totalRevenue = await _context.Bills.SumAsync(b => b.TotalAmount);

            return Ok(new
            {
                totalProducts,
                totalPurchases,
                totalBills,
                totalRevenue
            });
        }

        /*
        [HttpGet("purchases-per-product")]
        public async Task<IActionResult> GetPurchasesPerProduct()
        {
            var data = await _context.Purchases
                .GroupBy(p => p.Name)
                .Select(g => new { ProductName = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .ToListAsync();

            return Ok(data);
        }
        */

        [HttpGet("purchases-per-product")]
        public async Task<IActionResult> GetPurchasesPerProduct()
        {
            var data = await _context.Purchases
                .GroupBy(p => p.Name)
                .Select(g => new { ProductName = g.Key, Count = g.Count() })
                .OrderByDescending(x => x.Count)
                .ToListAsync();

            return Ok(data);
        }




        [HttpGet("purchases-per-day")]
        public async Task<IActionResult> GetPurchasesPerDay()
        {
            var data = await _context.Purchases

                 .Where(p => p.CreatedDate > DateTime.MinValue) // Filter out invalid dates
                .GroupBy(p => p.CreatedDate.Date)
                .Select(g => new { Date = g.Key, Count = g.Count() })
                .OrderBy(x => x.Date)
                .ToListAsync();

            return Ok(data);
        }
    }
}