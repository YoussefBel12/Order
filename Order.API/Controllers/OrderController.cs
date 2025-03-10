using MediatR;
using Microsoft.AspNetCore.Mvc;
using Order.API.Entities;
using System;
using System.Threading.Tasks;

namespace Order.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly RulesEngineService _rulesEngineService;

        public OrderController(IMediator mediator, RulesEngineService rulesEngineService)
        {
            _mediator = mediator;
            _rulesEngineService = rulesEngineService;
        }

        [HttpPost]
        public async Task<ActionResult<int>> AddOrder([FromBody] AddOrderCommand command)
        {

            //json rules
            // Apply business rules using RulesEngineService
            var errors = await _rulesEngineService.ValidateOrder(command);
            if (errors.Count > 0)
            {
                return BadRequest(new { Errors = errors });
            }





            //the logic if json approved

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var orderId = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetOrderById), new { id = orderId }, orderId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Error creating the order.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            var order = await _mediator.Send(new GetOrderByIdQuery { Id = id });
            if (order == null)
            {
                return NotFound();
            }
            return Ok(order);
        }






        
        [HttpGet]
        /*      public async Task<ActionResult<List<OrderDto>>> GetAllOrdersAsync()
              {


                  var orders = await _mediator.Send(new GetAllOrders());
                  return Ok(orders);
              } */


        [HttpGet]
        public async Task<ActionResult<List<OrderClass>>> GetAllOrdersAsync()
        {
            var orders = await _mediator.Send(new GetAllOrders()); // Get all orders

            // ✅ Apply filtering using RulesEngine
            var filteredOrders = new List<OrderClass>();
            foreach (var order in orders)
            {
                bool shouldInclude = await _rulesEngineService.ShouldIncludeOrder(order);
                if (shouldInclude)
                {
                    filteredOrders.Add(order);
                }
            }

            return Ok(filteredOrders);
        }






        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderAsync(int id)
        {
            await _mediator.Send(new DeleteOrderCommand { Id = id }); // Use object initializer;
            return NoContent(); // Returns 204 status code
        }




    }
}
