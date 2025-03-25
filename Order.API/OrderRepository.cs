using Microsoft.EntityFrameworkCore;
using Order.API.Entities;

namespace Order.API
{
    public class OrderRepository : IOrderRepository
    {
        private readonly OrderDbContext _context;
        public OrderRepository(OrderDbContext context)
        {
            _context = context;
        }
        // Order CRUD operations
        public async Task<OrderClass> GetOrderByIdAsync(int id)
        {
            return await _context.Orders.FindAsync(id);
        }

        public async Task<List<OrderClass>> GetAllOrdersAsync()
        {
            //  return await _context.Orders.ToListAsync();
            return await _context.Orders.ToListAsync();


        }

        public async Task AddOrderAsync(OrderClass order)
        {
           
            await _context.Orders.AddAsync(order);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateOrderAsync(OrderClass order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteOrderAsync(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
            }
        }
    }
}
