namespace Order.API.Entities.Stock
{
    
        public class RestockNotification
        {
         public int Id { get; set; }
        public List<int> StockIds { get; set; } = new();
            public string? Message { get; set; }
        //i added this below 
        public bool UserConfirmed { get; set; }

    }
    

}
