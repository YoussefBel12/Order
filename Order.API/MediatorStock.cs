
   // using global::Order.API.Entities.Stock;
    using MediatR;
    using Microsoft.EntityFrameworkCore;
    using Order.API.Entities.Stock;
    using System.ComponentModel.DataAnnotations;

    namespace Order.API
    {
        // Commands and Queries for Product
        public class AddProductCommand : IRequest<int>
        {
            [Required]
            public required string Name { get; set; }
            [Required]
            public required string SKU { get; set; }
            public string Description { get; set; } = string.Empty;
            [Required]
            public decimal Price { get; set; }
            public bool IsActive { get; set; } = true;
        }

        public class AddProductCommandHandler : IRequestHandler<AddProductCommand, int>
        {
            private readonly OrderDbContext _context;
            public AddProductCommandHandler(OrderDbContext context)
            {
                _context = context;
            }

            public async Task<int> Handle(AddProductCommand request, CancellationToken cancellationToken)
            {
                var product = new Product
                {
                    Name = request.Name,
                    SKU = request.SKU,
                    Description = request.Description,
                    Price = request.Price,
                    IsActive = request.IsActive
                };

                _context.Products.Add(product);
                await _context.SaveChangesAsync();
                return product.Id;
            }
        }


    /*
        public class GetAllProductsQuery : IRequest<List<Product>> { }

        public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, List<Product>>
        {
            private readonly OrderDbContext _context;
            public GetAllProductsQueryHandler(OrderDbContext context)
            {
                _context = context;
            }

            public async Task<List<Product>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
            {
                return await _context.Products.ToListAsync();
            }
        }
    */

    public class GetAllProductsQuery : IRequest<List<ProductDto>> { }
    public class GetAllProductsQueryHandler : IRequestHandler<GetAllProductsQuery, List<ProductDto>>
    {
        private readonly OrderDbContext _context;

        public GetAllProductsQueryHandler(OrderDbContext context)
        {
            _context = context;
        }

        public async Task<List<ProductDto>> Handle(GetAllProductsQuery request, CancellationToken cancellationToken)
        {
            var products = await _context.Products.ToListAsync();

            return products.Select(p => new ProductDto
            {
                Id = p.Id,
                Name = p.Name,
                SKU = p.SKU,
                Description = p.Description,
                Price = p.Price,
                IsActive = p.IsActive
            }).ToList();
        }
    }



    public class DeleteProductCommand : IRequest<int>
        {
            public int Id { get; set; }
        }

        public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, int>
        {
            private readonly OrderDbContext _context;
            public DeleteProductCommandHandler(OrderDbContext context)
            {
                _context = context;
            }

            public async Task<int> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
            {
                var product = await _context.Products.FindAsync(request.Id);
                if (product == null)
                {
                    throw new KeyNotFoundException("Product not found");
                }

                _context.Products.Remove(product);
                await _context.SaveChangesAsync();
                return product.Id;
            }
        }

        // Similar commands and queries for Warehouse and Stock
        public class AddWarehouseCommand : IRequest<int>
        {
            [Required]
            public required string Name { get; set; }
            [Required]
            public required string Location { get; set; }
            public bool IsActive { get; set; } = true;
        }

        public class AddWarehouseCommandHandler : IRequestHandler<AddWarehouseCommand, int>
        {
            private readonly OrderDbContext _context;
            public AddWarehouseCommandHandler(OrderDbContext context)
            {
                _context = context;
            }

            public async Task<int> Handle(AddWarehouseCommand request, CancellationToken cancellationToken)
            {
                var warehouse = new Warehouse
                {
                    Name = request.Name,
                    Location = request.Location,
                    IsActive = request.IsActive
                };

                _context.Warehouses.Add(warehouse);
                await _context.SaveChangesAsync();
                return warehouse.Id;
            }
        }

    /*
        public class GetAllWarehousesQuery : IRequest<List<Warehouse>> { }

        public class GetAllWarehousesQueryHandler : IRequestHandler<GetAllWarehousesQuery, List<Warehouse>>
        {
            private readonly OrderDbContext _context;
            public GetAllWarehousesQueryHandler(OrderDbContext context)
            {
                _context = context;
            }

            public async Task<List<Warehouse>> Handle(GetAllWarehousesQuery request, CancellationToken cancellationToken)
            {
                return await _context.Warehouses.ToListAsync();
            }
        }
    */


    public class GetAllWarehousesQuery : IRequest<List<WarehouseDto>> { }
    public class GetAllWarehousesQueryHandler : IRequestHandler<GetAllWarehousesQuery, List<WarehouseDto>>
    {
        private readonly OrderDbContext _context;

        public GetAllWarehousesQueryHandler(OrderDbContext context)
        {
            _context = context;
        }

        public async Task<List<WarehouseDto>> Handle(GetAllWarehousesQuery request, CancellationToken cancellationToken)
        {
            var warehouses = await _context.Warehouses.ToListAsync();

            return warehouses.Select(w => new WarehouseDto
            {
                Id = w.Id,
                Name = w.Name,
                Location = w.Location,
                IsActive = w.IsActive
            }).ToList();
        }
    }




    public class AddStockCommand : IRequest<int>
        {
            [Required]
            public int ProductId { get; set; }
            [Required]
            public int WarehouseId { get; set; }
            [Required]
            public int Quantity { get; set; }
        }

        public class AddStockCommandHandler : IRequestHandler<AddStockCommand, int>
        {
            private readonly OrderDbContext _context;
            public AddStockCommandHandler(OrderDbContext context)
            {
                _context = context;
            }

            public async Task<int> Handle(AddStockCommand request, CancellationToken cancellationToken)
            {
                var stock = new Stock
                {
                    ProductId = request.ProductId,
                    WarehouseId = request.WarehouseId,
                    Quantity = request.Quantity,
                    LastUpdated = DateTime.UtcNow
                };

                _context.Stocks.Add(stock);
                await _context.SaveChangesAsync();
                return stock.Id;
            }
        }

    /*   public class GetAllStocksQuery : IRequest<List<Stock>> { }

       public class GetAllStocksQueryHandler : IRequestHandler<GetAllStocksQuery, List<Stock>>
       {
           private readonly OrderDbContext _context;
           public GetAllStocksQueryHandler(OrderDbContext context)
           {
               _context = context;
           }

           public async Task<List<Stock>> Handle(GetAllStocksQuery request, CancellationToken cancellationToken)
           {
               return await _context.Stocks
                   .Include(s => s.Product)
                   .Include(s => s.Warehouse)
                   .ToListAsync();
           } 
       } */

    public class GetAllStocksQuery : IRequest<List<StockDto>> { }
    public class GetAllStocksQueryHandler : IRequestHandler<GetAllStocksQuery, List<StockDto>>
    {
        private readonly OrderDbContext _context;

        public GetAllStocksQueryHandler(OrderDbContext context)
        {
            _context = context;
        }

        public async Task<List<StockDto>> Handle(GetAllStocksQuery request, CancellationToken cancellationToken)
        {
            var stocks = await _context.Stocks
                .Include(s => s.Product)
                .Include(s => s.Warehouse)
                .ToListAsync();

            return stocks.Select(s => new StockDto
            {
                Id = s.Id,
                ProductId = s.ProductId,
                ProductName = s.Product.Name,
                WarehouseId = s.WarehouseId,
                WarehouseName = s.Warehouse.Name,
                Quantity = s.Quantity,
                LastUpdated = s.LastUpdated
            }).ToList();
        }
    }




    // new update queries to test with elsa

    public class UpdateStockCommand : IRequest<int>
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public int Quantity { get; set; }
    }

    public class UpdateStockCommandHandler : IRequestHandler<UpdateStockCommand, int>
    {
        private readonly OrderDbContext _context;

        public UpdateStockCommandHandler(OrderDbContext context)
        {
            _context = context;
        }

        public async Task<int> Handle(UpdateStockCommand request, CancellationToken cancellationToken)
        {
            var stock = await _context.Stocks.FindAsync(request.Id);
            if (stock == null)
            {
                throw new KeyNotFoundException("Stock not found");
            }

            stock.Quantity = request.Quantity;
            stock.LastUpdated = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return stock.Id;
        }
    }



    //search for product by name
    // In MediatorStock.cs or similar
    public class GetProductByNameQuery : IRequest<ProductDto?>
    {
        public string Name { get; set; }
    }

    public class GetProductByNameQueryHandler : IRequestHandler<GetProductByNameQuery, ProductDto?>
    {
        private readonly OrderDbContext _context;
        public GetProductByNameQueryHandler(OrderDbContext context) => _context = context;

        public async Task<ProductDto?> Handle(GetProductByNameQuery request, CancellationToken cancellationToken)
        {
            var product = await _context.Products
                .FirstOrDefaultAsync(p => p.Name == request.Name, cancellationToken);

            if (product == null)
                return null;

            return new ProductDto
            {
                Id = product.Id,
                Name = product.Name,
                SKU = product.SKU,
                Description = product.Description,
                Price = product.Price,
                IsActive = product.IsActive
            };
        }
    }

















}


