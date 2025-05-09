using Order.API.Entities.Stock;

namespace Order.API
{
    public interface IStockService
    {
        Task<List<Product>> GetAllProductsAsync();
        Task<List<Warehouse>> GetAllWarehousesAsync();
        Task<List<Stock>> GetAllStocksAsync();
        //this one is put added for ELsa
        Task<int> UpdateStockAsync(int id, int quantity);



    }
}
