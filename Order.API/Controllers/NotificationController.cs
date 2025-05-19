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

        //more crud endpoints for testing


        // Read All
        [HttpGet]
        public IActionResult GetAll()
        {
            var notifications = _notificationService.GetAllNotifications();
            return Ok(notifications);
        }

        // Read Single
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var notification = _notificationService.GetNotificationById(id);
            if (notification == null)
                return NotFound();
            return Ok(notification);
        }

        // Update
        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] RestockNotification notification)
        {
            if (id != notification.Id)
                return BadRequest("ID mismatch"); 

            bool updated = _notificationService.UpdateNotification(notification);
            return updated ? NoContent() : NotFound();
        }

        // Delete
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            bool deleted = _notificationService.DeleteNotification(id);
            return deleted ? NoContent() : NotFound();
        }







    }
    


}
