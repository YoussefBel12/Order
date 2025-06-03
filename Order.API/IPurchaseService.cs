using Order.API.Entities.Purchase;

namespace Order.API
{
    public interface IPurchaseService
    {
        Task<List<PurchaseDto>> GetAllPurchasesAsync();
        Task<int> AddPurchaseAsync(AddPurchaseCommand command);
        Task<int> DeletePurchaseAsync(int id);
        Task<List<PurchaseListDto>> GetAllPurchaseListsAsync();
        Task<int> AddPurchaseListAsync(AddPurchaseListCommand command);
    }
}