namespace Order.API
{
   
        
        using Order.API.Entities.Stock;

        public interface INotificationService
        {
        // void HandleNotification(RestockNotification notification);
        RestockNotification HandleNotification(RestockNotification restockNotification);



        //i added other crud stuff here  

        RestockNotification? GetLatestNotification();

        IEnumerable<RestockNotification> GetAllNotifications();
        RestockNotification GetNotificationById(int id);
        bool UpdateNotification(RestockNotification notification);
        bool DeleteNotification(int id);




    }
    

}
