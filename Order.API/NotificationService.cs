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



    public RestockNotification? GetLatestNotification()
    {
        return _context.RestockNotifications
            .OrderByDescending(n => n.Id)
            .FirstOrDefault();
    }








    public RestockNotification HandleNotification(RestockNotification restockNotification)
    {
        var entity = new RestockNotification
        {
            Message = restockNotification.Message,
            StockIds = restockNotification.StockIds,
            //i added this here and entity
            UserConfirmed = restockNotification.UserConfirmed ,
            //i added this too
            WorkflowInstanceId = restockNotification.WorkflowInstanceId
        };

        _context.RestockNotifications.Add(entity);
        _context.SaveChanges();
        //i removeed void from interface and made it restocknotification
        return entity;
    }


    //i added more crud here 













    public IEnumerable<RestockNotification> GetAllNotifications()
    {
        return _context.RestockNotifications.ToList();
    }

    public RestockNotification GetNotificationById(int id)
    {
        return _context.RestockNotifications.Find(id);
    }

    public bool UpdateNotification(RestockNotification notification)
    {
        var existing = _context.RestockNotifications.Find(notification.Id);
        if (existing == null)
            return false;

        // Update ONLY the UserConfirmed property
        existing.UserConfirmed = notification.UserConfirmed;
        _context.SaveChanges();
        return true;
    }

    public bool DeleteNotification(int id)
    {
        var existing = _context.RestockNotifications.Find(id);
        if (existing == null)
            return false;

        _context.RestockNotifications.Remove(existing);
        _context.SaveChanges();
        return true;
    }









}

