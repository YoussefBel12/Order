using Order.API.Entities.Stock;

namespace Order.API
{
    public interface IStockService
    {
        Task<List<Product>> GetAllProductsAsync();
        Task<List<Warehouse>> GetAllWarehousesAsync();
        Task<List<Stock>> GetAllStocksAsync();
    }
}
