using MediatR;

namespace Order.API
{
    public class PurchaseService : IPurchaseService
    {
        private readonly IMediator _mediator;
        public PurchaseService(IMediator mediator) => _mediator = mediator;

        public async Task<List<PurchaseDto>> GetAllPurchasesAsync() =>
            await _mediator.Send(new GetAllPurchasesQuery());

        public async Task<int> AddPurchaseAsync(AddPurchaseCommand command) =>
            await _mediator.Send(command);

        public async Task<int> DeletePurchaseAsync(int id) =>
            await _mediator.Send(new DeletePurchaseCommand { Id = id });

        public async Task<List<PurchaseListDto>> GetAllPurchaseListsAsync() =>
            await _mediator.Send(new GetAllPurchaseListsQuery());

        public async Task<int> AddPurchaseListAsync(AddPurchaseListCommand command) =>
            await _mediator.Send(command);
    }
}