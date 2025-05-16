using Microsoft.EntityFrameworkCore;
using Order.API.Entities;
using Order.API.Entities.Stock;

namespace Order.API
{
    public class OrderDbContext : DbContext
    {
        public OrderDbContext(DbContextOptions<OrderDbContext> options) : base(options)
        {
        }

        //Old Dbsets
        public DbSet<OrderClass> Orders { get; set; }
        public DbSet<RulesEngineConfigs> RulesEngineConfigs { get; set; }


        // New DbSets for Product, Warehouse, and Stock
        public DbSet<Product> Products { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        //new for notification

        public DbSet<RestockNotification> RestockNotifications { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure relationships for Stock
            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Product)
                .WithMany(p => p.Stocks)
                .HasForeignKey(s => s.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Stock>()
                .HasOne(s => s.Warehouse)
                .WithMany(w => w.Stocks)
                .HasForeignKey(s => s.WarehouseId)
                .OnDelete(DeleteBehavior.Cascade);


            


        }


       

    }
}
