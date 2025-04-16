using Microsoft.EntityFrameworkCore;
using Order.API.Entities.Stock;

namespace Order.API
{
    public class StockService : IStockService
    {
        private readonly OrderDbContext _context;

        public StockService(OrderDbContext context)
        {
            _context = context;
        }

        public async Task<List<Product>> GetAllProductsAsync()
        {
            return await _context.Products.ToListAsync();
        }

        public async Task<List<Warehouse>> GetAllWarehousesAsync()
        {
            return await _context.Warehouses.ToListAsync();
        }

        public async Task<List<Stock>> GetAllStocksAsync()
        {
            return await _context.Stocks
                .Include(s => s.Product)
                .Include(s => s.Warehouse)
                .ToListAsync();
        }
    }
}

