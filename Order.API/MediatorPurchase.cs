using MediatR;
using Microsoft.EntityFrameworkCore;
using Order.API.Entities.Purchase;
using Order.API.Identity;
using System.ComponentModel.DataAnnotations;

namespace Order.API
{
    // DTOs
    public class PurchaseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsActive { get; set; }
        //added Quantity property
        public int Quantity { get; set; }

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    }

    public class PurchaseListDto
    {
        public int Id { get; set; }
        public int PurchaseId { get; set; }
        public string PurchaseName { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
    }

    // Add Purchase
    public class AddPurchaseCommand : IRequest<int>
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string SKU { get; set; }
        public string Description { get; set; } = string.Empty;
        [Required]
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;
        public int Quantity { get; set; }  // Added Quantity property
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

    }

    public class AddPurchaseCommandHandler : IRequestHandler<AddPurchaseCommand, int>
    {
        private readonly OrderDbContext _context;
        public AddPurchaseCommandHandler(OrderDbContext context) => _context = context;

        public async Task<int> Handle(AddPurchaseCommand request, CancellationToken cancellationToken)
        {
            var purchase = new Purchase
            {
                Name = request.Name,
                SKU = request.SKU,
                Description = request.Description,
                Price = request.Price,
                IsActive = request.IsActive,
                Quantity = request.Quantity  ,// Set Quantity 
                CreatedDate = request.CreatedDate
            };
            _context.Purchases.Add(purchase);
            await _context.SaveChangesAsync(cancellationToken);
            return purchase.Id;
        }
    }

    // Get All Purchases
    public class GetAllPurchasesQuery : IRequest<List<PurchaseDto>> { }

    public class GetAllPurchasesQueryHandler : IRequestHandler<GetAllPurchasesQuery, List<PurchaseDto>>
    {
        private readonly OrderDbContext _context;
        public GetAllPurchasesQueryHandler(OrderDbContext context) => _context = context;

        public async Task<List<PurchaseDto>> Handle(GetAllPurchasesQuery request, CancellationToken cancellationToken)
        {
            var purchases = await _context.Purchases.ToListAsync(cancellationToken);
            return purchases.Select(p => new PurchaseDto
            {
                Id = p.Id,
                Name = p.Name,
                SKU = p.SKU,
                Description = p.Description,
                Price = p.Price,
                IsActive = p.IsActive,
                Quantity = p.Quantity ,// Include Quantity in DTO
                CreatedDate = p.CreatedDate
            }).ToList();
        }
    }

    // Delete Purchase
    public class DeletePurchaseCommand : IRequest<int>
    {
        public int Id { get; set; }
    }

    public class DeletePurchaseCommandHandler : IRequestHandler<DeletePurchaseCommand, int>
    {
        private readonly OrderDbContext _context;
        public DeletePurchaseCommandHandler(OrderDbContext context) => _context = context;

        public async Task<int> Handle(DeletePurchaseCommand request, CancellationToken cancellationToken)
        {
            var purchase = await _context.Purchases.FindAsync(new object[] { request.Id }, cancellationToken);
            if (purchase == null)
                throw new KeyNotFoundException("Purchase not found");

            _context.Purchases.Remove(purchase);
            await _context.SaveChangesAsync(cancellationToken);
            return purchase.Id;
        }
    }

    // Add PurchaseList
    public class AddPurchaseListCommand : IRequest<int>
    {
        [Required]
        public int PurchaseId { get; set; }
      //  [Required]
        public string UserId { get; set; } = string.Empty;
    }

    public class AddPurchaseListCommandHandler : IRequestHandler<AddPurchaseListCommand, int>
    {
        private readonly OrderDbContext _context;
        public AddPurchaseListCommandHandler(OrderDbContext context) => _context = context;

        public async Task<int> Handle(AddPurchaseListCommand request, CancellationToken cancellationToken)
        {
            var purchaseList = new PurchaseList
            {
                PurchaseId = request.PurchaseId,
                UserId = request.UserId
            };
            _context.PurchaseLists.Add(purchaseList);
            await _context.SaveChangesAsync(cancellationToken);
            return purchaseList.Id;
        }
    }

    // Get All PurchaseLists
    public class GetAllPurchaseListsQuery : IRequest<List<PurchaseListDto>> { }

    public class GetAllPurchaseListsQueryHandler : IRequestHandler<GetAllPurchaseListsQuery, List<PurchaseListDto>>
    {
        private readonly OrderDbContext _context;
        public GetAllPurchaseListsQueryHandler(OrderDbContext context) => _context = context;

        public async Task<List<PurchaseListDto>> Handle(GetAllPurchaseListsQuery request, CancellationToken cancellationToken)
        {
            var lists = await _context.PurchaseLists
                .Include(pl => pl.Purchase)
                .Include(pl => pl.User)
                .ToListAsync(cancellationToken);

            return lists.Select(pl => new PurchaseListDto
            {
                Id = pl.Id,
                PurchaseId = pl.PurchaseId,
                PurchaseName = pl.Purchase.Name,
                UserId = pl.UserId,
                UserName = $"{pl.User.FirstName} {pl.User.LastName}"
            }).ToList();
        }
    }
}