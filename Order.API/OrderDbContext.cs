using Microsoft.EntityFrameworkCore;
using Order.API.Entities;

namespace Order.API
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options)
        {
        }
        public DbSet<OrderClass> Orders { get; set; }
    }
}
