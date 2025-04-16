namespace Order.API.Entities.Stock
{
    public class Warehouse
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;

        // Navigation
        public ICollection<Stock> Stocks { get; set; } = new List<Stock>();
    }

}
