using System;
using System.Collections.Generic;

namespace Order.API.Entities.Bill
{
    public class BillDto
    {
        public int Id { get; set; }
        public string BillNumber { get; set; }
        public DateTime Date { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public List<BillItemDto> Items { get; set; } = new();
    }

    public class BillItemDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
    }
}