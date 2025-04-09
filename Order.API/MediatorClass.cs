using MediatR;
using Microsoft.EntityFrameworkCore;
using Order.API.Entities;
using System.ComponentModel.DataAnnotations;
namespace Order.API
{
    public class AddOrderCommand : IRequest<int>
    {
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Phone { get; set; }
        [Required]
        public required int OrderAmount { get; set; }
    }
    

    public class AddOrderCommandHandler : IRequestHandler<AddOrderCommand, int>
    {
        private readonly OrderDbContext _context;
        public AddOrderCommandHandler(OrderDbContext context)
        {
            _context = context;
        }
        public async Task<int> Handle(AddOrderCommand request, CancellationToken cancellationToken)
        {
            var order = new OrderClass
            {
                Name = request.Name,
                Email = request.Email,
                Phone = request.Phone,
                OrderAmount = request.OrderAmount
            };
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order.Id;
        }
    }






    public class GetOrderByIdQuery : IRequest<OrderClass>
    {
        public int Id { get; set; }
    }


    public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, OrderClass>
    {
        private readonly OrderDbContext _context;
        public GetOrderByIdQueryHandler(OrderDbContext context)
        {
            _context = context;
        }
        public async Task<OrderClass> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
        {
            return await _context.Orders.FindAsync(request.Id);
        }
    }







    public class GetAllOrders : IRequest<List<OrderClass>>
    {
        public int Id { get; set; }
    }

    public class GetOrdersQueryHandler : IRequestHandler<GetAllOrders, List<OrderClass>>
    {
        private readonly OrderDbContext _context;
        public GetOrdersQueryHandler(OrderDbContext context)
        {
            _context = context;
        }
        public async Task<List<OrderClass>> Handle(GetAllOrders request, CancellationToken cancellationToken)
        {
            return await _context.Orders.ToListAsync();
        }
    }




    public class UpdateOrderCommand : IRequest<Unit>
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public int OrderAmount { get; set; }
    }



    public class UpdateOrderCommandHandler : IRequestHandler<UpdateOrderCommand , Unit>
    {
        private readonly OrderDbContext _context;
        public UpdateOrderCommandHandler(OrderDbContext context)
        {
            _context = context;
        }
        public async Task<Unit> Handle(UpdateOrderCommand request, CancellationToken cancellationToken)
        {
            var order = await _context.Orders.FindAsync(request.Id);
            if (order == null)
            {
                throw new NotFoundException("Order not found");
            }
            order.Name = request.Name;
            order.Email = request.Email;
            order.Phone = request.Phone;
            order.OrderAmount = request.OrderAmount;
            await _context.SaveChangesAsync();
            return Unit.Value;
        }
    }






    public class DeleteOrderCommand : IRequest<int>
    {
        public int Id { get; set; }
    }





    public class DeleteOrderCommandHandler : IRequestHandler<DeleteOrderCommand, int>
    {
        private readonly OrderDbContext _context;
        public DeleteOrderCommandHandler(OrderDbContext context)
        {
            _context = context;
        }
        public async Task<int> Handle(DeleteOrderCommand request, CancellationToken cancellationToken)
        {
            var order = await _context.Orders.FindAsync(request.Id);
            if (order == null)
            {
                throw new NotFoundException("Order not found");
            }
            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();
            return order.Id;
        }
    }
}
