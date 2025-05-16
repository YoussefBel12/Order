/*

namespace Order.API
{
    using Order.API.Entities.Stock;
    using System;

    public class NotificationService : INotificationService
        {
            public void HandleNotification(RestockNotification notification)
            {
                // For demo: just log to console. Replace with your logic.
                Console.WriteLine($"[Notification] StockIds: {string.Join(", ", notification.StockIds)} | Message: {notification.Message}");
            }
        }
    

}
*/



using Order.API;
using Order.API.Entities.Stock;

public class NotificationService : INotificationService
{
    private readonly OrderDbContext _context;

    public NotificationService(OrderDbContext context)
    {
        _context = context;
    }

    public void HandleNotification(RestockNotification restockNotification)
    {
        var entity = new RestockNotification
        {
            Message = restockNotification.Message,
            StockIds = restockNotification.StockIds,
            //i added this here and entity
            UserConfirmed = restockNotification.UserConfirmed
        };

        _context.RestockNotifications.Add(entity);
        _context.SaveChanges();
    }
}

