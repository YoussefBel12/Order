using Order.API.Identity;

namespace Order.API.Entities.Purchase
{
    public class PurchaseList
    {
        public int Id { get; set; }
        public int PurchaseId { get; set; }
        public string UserId { get; set; } = string.Empty;

        // Navigation
        public Purchase Purchase { get; set; } = null!;
        public ApplicationUser User { get; set; } = null!;
    }
}