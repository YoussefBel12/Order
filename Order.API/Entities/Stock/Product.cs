namespace Order.API.Entities.Stock
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string SKU { get; set; } = string.Empty; // Stock Keeping Unit
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<Stock> Stocks { get; set; } = new List<Stock>();
    }

}
