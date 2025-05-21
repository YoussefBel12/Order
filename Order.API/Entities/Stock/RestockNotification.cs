namespace Order.API.Entities.Stock
{
    
        public class RestockNotification
        {
         public int Id { get; set; }
        public List<int> StockIds { get; set; } = new();
            public string? Message { get; set; }
        //i added this below 2 now*
        public bool UserConfirmed { get; set; }
        public string WorkflowInstanceId { get; set; }
    }
    

}
