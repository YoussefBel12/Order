﻿using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Order.API.Entities;
using Order.API.Entities.Bill;
using Order.API.Entities.Purchase;
using Order.API.Entities.Stock;
using Order.API.Identity;

namespace Order.API
{
    public class OrderDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, string>
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
        //new for purchase
        public DbSet<Purchase> Purchases { get; set; }
        public DbSet<PurchaseList> PurchaseLists { get; set; }
        //those for the Bills System
        public DbSet<Bill> Bills { get; set; }
        public DbSet<BillItem> BillItems { get; set; }




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


            //this is a new entity relations 

            modelBuilder.Entity<Purchase>()
       .HasMany(p => p.PurchaseLists)
       .WithOne(pl => pl.Purchase)
       .HasForeignKey(pl => pl.PurchaseId)
       .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PurchaseList>()
                .HasOne(pl => pl.User)
                .WithMany()
                .HasForeignKey(pl => pl.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            base.OnModelCreating(modelBuilder);



            //relationships for Bill and BillItem and application user
            modelBuilder.Entity<Bill>()
       .HasOne(b => b.User)
       .WithMany()
       .HasForeignKey(b => b.UserId)
       .OnDelete(DeleteBehavior.Restrict);




        }




    }
}
