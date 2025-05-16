namespace Order.API.Controllers
{
    using Microsoft.AspNetCore.Mvc;
    using Order.API.Entities.Stock;


        [ApiController]
        [Route("api/notify")]
        public class NotificationController : ControllerBase
        {
            private readonly INotificationService _notificationService;

            public NotificationController(INotificationService notificationService)
            {
                _notificationService = notificationService;
            }

            [HttpPost]
            public IActionResult Receive([FromBody] RestockNotification notification)
            {
                _notificationService.HandleNotification(notification);
                return Ok(new { received = true });
            }
        }
    

}
