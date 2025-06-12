using System.Collections.Generic;

namespace Order.API.Entities.Purchase
{
    public class Purchase
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;
        public int Quantity { get; set; } = 1;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<PurchaseList> PurchaseLists { get; set; } = new List<PurchaseList>();
    }
}