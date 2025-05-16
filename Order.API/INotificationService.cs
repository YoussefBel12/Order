namespace Order.API
{
   
        
        using Order.API.Entities.Stock;

        public interface INotificationService
        {
            void HandleNotification(RestockNotification notification);
        }
    

}
