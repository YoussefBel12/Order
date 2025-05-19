namespace Order.API
{
   
        
        using Order.API.Entities.Stock;

        public interface INotificationService
        {
            void HandleNotification(RestockNotification notification);


        //i added other crud stuff here  

        IEnumerable<RestockNotification> GetAllNotifications();
        RestockNotification GetNotificationById(int id);
        bool UpdateNotification(RestockNotification notification);
        bool DeleteNotification(int id);




    }
    

}
