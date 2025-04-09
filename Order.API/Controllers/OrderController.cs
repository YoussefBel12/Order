/*
using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Order.API.Entities;


namespace Order.API.Controllers
{
    [ApiController]
   
           [Route("api/[controller]")]
        public class OrderController : ControllerBase
        {
            private readonly IMediator _mediator;
            private readonly RulesEngineService _rulesEngineService;
            private readonly OrderDbContext _dbContext;

            public OrderController(IMediator mediator, RulesEngineService rulesEngineService, OrderDbContext dbContext )
            {
                _mediator = mediator;
                _rulesEngineService = rulesEngineService;
                _dbContext = dbContext;
            }

   
    [HttpPost]
  
        public async Task<ActionResult<int>> AddOrder([FromBody] AddOrderCommand command, [FromQuery] string version)
        {


            // Initialize the rules engine with the given version
            try
            {
                _rulesEngineService.InitializeRules(_dbContext, version); // Pass the version here
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }

            // Validate the order using the rules engine
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

        public async Task<ActionResult<List<OrderClass>>> GetAllOrders([FromQuery] string version)
        {
            // Initialize the rules engine with the given version
            try
            {
                _rulesEngineService.InitializeRules(_dbContext, version); // Pass the version here
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }

            var orders = await _mediator.Send(new GetAllOrders());

            var filteredOrders = new List<OrderClass>();
            foreach (var order in orders)
            {
               
                bool shouldInclude = await _rulesEngineService.ShouldIncludeOrder(order, version);
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
            await _mediator.Send(new DeleteOrderCommand { Id = id });
            return NoContent();
        }
    }
}
*/

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Order.API.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Order.API;

namespace Order.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrderController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly RulesEngineService _rulesEngineService;
        private readonly OrderDbContext _dbContext;

        public OrderController(IMediator mediator, RulesEngineService rulesEngineService, OrderDbContext dbContext)
        {
            _mediator = mediator;
            _rulesEngineService = rulesEngineService;
            _dbContext = dbContext;
        }

        /*
        private async Task<string?> GetActiveVersionForWorkflow(string workflowName)
        {
            var config = await _dbContext.RulesEngineConfigs
                .FirstOrDefaultAsync(r => r.WorkflowName == workflowName && r.IsActive);
            return config?.Version;
        }
        */

        private async Task<string?> GetActiveVersionForWorkflow(string workflowName)
        {
            var config = await _dbContext.RulesEngineConfigs
                .FirstOrDefaultAsync(r =>
                    r.WorkflowName == workflowName &&
                    r.IsActive &&
                    !r.IsArchived &&
                    (r.ExpirationDate == null || r.ExpirationDate > DateTime.UtcNow)
                );
            return config?.Version;
        }






        [HttpPost]
        public async Task<ActionResult<int>> AddOrder([FromBody] AddOrderCommand command)
        {
            var validationWorkflow = "OrderValidationRules";
            var version = await GetActiveVersionForWorkflow(validationWorkflow);

            if (string.IsNullOrEmpty(version))
                return BadRequest(new { Error = $"No active version for {validationWorkflow}" });

            try
            {
                await _rulesEngineService.InitializeRulesAsync(_dbContext, version, validationWorkflow);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }

            var errors = await _rulesEngineService.ValidateOrder(command);
            if (errors.Count > 0)
                return BadRequest(new { Errors = errors });

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var orderId = await _mediator.Send(command);
                return CreatedAtAction(nameof(GetOrderById), new { id = orderId }, orderId);
            }
            catch
            {
                return StatusCode(500, "Error creating the order.");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrderById(int id)
        {
            var order = await _mediator.Send(new GetOrderByIdQuery { Id = id });
            return order == null ? NotFound() : Ok(order);
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderClass>>> GetAllOrders()
        {
            var filterWorkflow = "OrderFilterRules";
            var version = await GetActiveVersionForWorkflow(filterWorkflow);

            if (string.IsNullOrEmpty(version))
                return BadRequest(new { Error = $"No active version for {filterWorkflow}" });

            var orders = await _mediator.Send(new GetAllOrders());
            var filteredOrders = new List<OrderClass>();

            foreach (var order in orders)
            {
                bool include = await _rulesEngineService.ShouldIncludeOrder(order, version, filterWorkflow);
                if (include)
                    filteredOrders.Add(order);
            }

            return Ok(filteredOrders);
        }


        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderAsync(int id)
        {
            await _mediator.Send(new DeleteOrderCommand { Id = id });
            return NoContent();
        }
                



       

    }

}
