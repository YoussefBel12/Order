using Order.API.Entities;
namespace Order.API
{
    public interface IOrderRepository
    {
      
        Task<OrderClass> GetOrderByIdAsync(int id);
        Task<List<OrderClass>> GetAllOrdersAsync();
        Task AddOrderAsync(OrderClass order);
        Task UpdateOrderAsync(OrderClass order);
        Task DeleteOrderAsync(int id);
    }
}
