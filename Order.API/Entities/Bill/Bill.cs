using System;
using System.Collections.Generic;
using Order.API.Identity;

namespace Order.API.Entities.Bill
{
    public class Bill
    {
        public int Id { get; set; }
        public string BillNumber { get; set; } = string.Empty;
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = "Pending"; // e.g., Pending, Paid, Cancelled

        // User relationship
        public string UserId { get; set; }
        public ApplicationUser User { get; set; }

        public ICollection<BillItem> Items { get; set; }
    }
}