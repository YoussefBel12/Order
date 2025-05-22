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
            // _notificationService.HandleNotification(notification);
            //return Ok(new { received = true });

            var saved = _notificationService.HandleNotification(notification);
            return Ok(new { id = saved.Id }); // ✅ 'saved' is now defined



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


      

        [HttpPost("api/notifications/{id}/confirm")]
        public async Task<IActionResult> ConfirmNotification(int id)
        {
            var notification = _notificationService.GetNotificationById(id);
            if (notification == null) return NotFound();

            notification.UserConfirmed = true;
            _notificationService.UpdateNotification(notification);

            // Call Elsa's HTTP Endpoint to resume the workflow
            using var httpClient = new HttpClient();
            try
            {
                var elsaResponse = await httpClient.GetAsync("https://localhost:52344/api/workflows/confirm-restock");
                elsaResponse.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                // Optionally log or handle the error
                return StatusCode(500, $"Failed to notify Elsa: {ex.Message}");
            }

            return Ok();
        }
        





        [HttpPost("api/notifications/confirm-latest")]
        public async Task<IActionResult> ConfirmLatestNotification()
        {
            var notification = _notificationService.GetLatestNotification();
            if (notification == null) return NotFound();

            notification.UserConfirmed = true;
            _notificationService.UpdateNotification(notification);

            using var httpClient = new HttpClient();
            try
            {
                var elsaResponse = await httpClient.GetAsync("https://localhost:52344/api/workflows/confirm-restock");
                elsaResponse.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Failed to notify Elsa: {ex.Message}");
            }

            return Ok();
        }












    }



}
