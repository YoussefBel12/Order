/*
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Order.API.Entities;
using System;
using System.Threading.Tasks;

namespace Order.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiVersion("2.0")]
    public class OrderController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly RulesEngineService _rulesEngineService;

        public OrderController(IMediator mediator, RulesEngineService rulesEngineService)
        {
            _mediator = mediator;
            _rulesEngineService = rulesEngineService;
        }

        // Version 1.0 - AddOrder without Rules Engine
        [HttpPost]
        [MapToApiVersion("1.0")]
        public async Task<ActionResult<int>> AddOrderV1([FromBody] AddOrderCommand command)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var orderId = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetOrderById), new { id = orderId }, orderId);
            }
            catch (Exception)
            {
                return StatusCode(500, "Error creating the order.");
            }
        }

        // Version 2.0 - AddOrder with Rules Engine
        [HttpPost]
        [MapToApiVersion("2.0")]
        public async Task<ActionResult<int>> AddOrderV2([FromBody] AddOrderCommand command)
        {
            var errors = await _rulesEngineService.ValidateOrder(command);
            if (errors.Count > 0)
            {
                return BadRequest(new { Errors = errors });
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var orderId = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetOrderById), new { id = orderId }, orderId);
            }
            catch (Exception)
            {
                return StatusCode(500, "Error creating the order.");
            }
        }

        // Common GetOrderById action for both versions
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

        // Version 1.0 - GetAllOrders without Rules Engine
        [HttpGet]
        [MapToApiVersion("1.0")]
        public async Task<ActionResult<List<OrderClass>>> GetAllOrdersV1()
        {
            var orders = await _mediator.Send(new GetAllOrders());
            return Ok(orders);
        }

        // Version 2.0 - GetAllOrders with Rules Engine
        [HttpGet]
        [MapToApiVersion("2.0")]
        public async Task<ActionResult<List<OrderClass>>> GetAllOrdersV2()
        {
            var orders = await _mediator.Send(new GetAllOrders());

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

        // Common DeleteOrder action for both versions
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderAsync(int id)
        {
            await _mediator.Send(new DeleteOrderCommand { Id = id });
            return NoContent();
        }
    }
}
*/