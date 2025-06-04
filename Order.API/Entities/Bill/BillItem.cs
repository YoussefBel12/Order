namespace Order.API.Entities.Bill
{
    public class BillItem
    {
        public int Id { get; set; }
        public int BillId { get; set; }
        public string Description { get; set; } = string.Empty;
        public decimal Amount { get; set; }

        // Navigation
        public Bill Bill { get; set; }
    }
}