


//this just an endpoint to test http endpoint from elsa
//basicly it send random object to elsa and infact it et it
//remember this exemple cuz u gonna need it later

using Microsoft.AspNetCore.Mvc;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Order.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ElsaController : ControllerBase
    {
        [HttpPost("forward-random")]
        public async Task<IActionResult> ForwardRandomObject()
        {
            var elsaUrl = "https://localhost:52344/api/workflows/endpoint";

            // Create a random object to send
            var randomObject = new
            {
                Id = Guid.NewGuid(),
                Timestamp = DateTime.UtcNow,
                Message = "Hello from ElsaController",
                Value = new Random().Next(1, 1000)
            };

            var json = JsonSerializer.Serialize(randomObject);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            using var httpClient = new HttpClient();
            try
            {
                var response = await httpClient.PostAsync(elsaUrl, content);
                response.EnsureSuccessStatusCode();
                var responseBody = await response.Content.ReadAsStringAsync();
                return Ok(new { sent = true, elsaResponse = responseBody, sentObject = randomObject });
            }
            catch (HttpRequestException ex)
            {
                return StatusCode(500, $"Failed to send to Elsa: {ex.Message}");
            }
        }
    }
}