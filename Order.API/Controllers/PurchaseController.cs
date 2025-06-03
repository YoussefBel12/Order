using System.Text;
using System.Text.Json;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Order.API.Controllers
{
   // [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class PurchaseController : ControllerBase
    {
        private readonly IPurchaseService _purchaseService;
        

        public PurchaseController(IPurchaseService purchaseService)
        {
            _purchaseService = purchaseService;
        }

        [HttpGet]
        public async Task<ActionResult<List<PurchaseDto>>> GetAllPurchases()
        {
            var purchases = await _purchaseService.GetAllPurchasesAsync();
            return Ok(purchases);
        }

     
        [HttpPost]
        public async Task<ActionResult<int>> AddPurchase([FromBody] AddPurchaseCommand command)
        {
            var id = await _purchaseService.AddPurchaseAsync(command);
            return CreatedAtAction(nameof(GetAllPurchases), new { id }, id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePurchase(int id)
        {
            await _purchaseService.DeletePurchaseAsync(id);
            return NoContent();
        }

        

        [HttpGet("lists")]
        public async Task<ActionResult<List<PurchaseListDto>>> GetAllPurchaseLists()
        {
            var lists = await _purchaseService.GetAllPurchaseListsAsync();
            return Ok(lists);
        }


        /* keep this 
         [HttpPost("lists")]
         public async Task<ActionResult<int>> AddPurchaseList([FromBody] AddPurchaseListCommand command)
         {

             // Get the authenticated user's ID from the claims
             var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
             if (string.IsNullOrEmpty(userId))
                 return Unauthorized();

             command.UserId = userId; // Set the user ID automatically

             var id = await _purchaseService.AddPurchaseListAsync(command);
             return CreatedAtAction(nameof(GetAllPurchaseLists), new { id }, id);
         }

         */
        [HttpPost("lists")]
        public async Task<ActionResult<int>> AddPurchaseList([FromBody] AddPurchaseListCommand command)
        {
            string? userId = null;

            if (User.Identity?.IsAuthenticated == true)
            {
                userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            }

            // If not authenticated, fall back to the value from the request body (e.g., from Elsa)
            if (string.IsNullOrEmpty(userId))
                userId = command.UserId;

            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            command.UserId = userId;

            var id = await _purchaseService.AddPurchaseListAsync(command);
            return CreatedAtAction(nameof(GetAllPurchaseLists), new { id }, id);
        }



























        //everything here is test for elsa and sepration 


        [HttpPost("purchase")]
        public async Task<IActionResult> CreatePurchase([FromBody] AddPurchaseCommand command)
        {
            var purchaseId = await _purchaseService.AddPurchaseAsync(command);

            // Get the authenticated user's ID
            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            // Fetch the full purchase details
            var purchases = await _purchaseService.GetAllPurchasesAsync();
            var purchase = purchases.FirstOrDefault(p => p.Id == purchaseId);

            if (purchase == null)
                return NotFound();

            // Build a payload with PurchaseId and UserId
            var payload = new
            {
                PurchaseId = purchase.Id,
                UserId = userId,
                purchase.Name,
                purchase.SKU,
                purchase.Description,
                purchase.Price,
                purchase.IsActive,
                Timestamp = DateTime.UtcNow
            };

            using var httpClient = new HttpClient();
            var elsaUrl = "https://localhost:52344/api/workflows/start-purchase";
            var content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");
            await httpClient.PostAsync(elsaUrl, content);

            return CreatedAtAction(nameof(GetAllPurchases), new { id = purchaseId }, purchaseId);
        }








    }
}
