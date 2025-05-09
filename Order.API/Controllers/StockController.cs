
using MediatR;
using Microsoft.AspNetCore.Mvc;


namespace Order.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StockController : ControllerBase
    {
        private readonly IMediator _mediator;
       

        public StockController(IMediator mediator )
        {
            _mediator = mediator;
            
        }

        [HttpPost("product")]
        public async Task<ActionResult<int>> AddProduct([FromBody] AddProductCommand command)
        {
            var productId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetAllProducts), new { id = productId }, productId);
        }

        [HttpGet("product")]
        public async Task<ActionResult<List<ProductDto>>> GetAllProducts()
        {
            var products = await _mediator.Send(new GetAllProductsQuery());
            return Ok(products);
        }

        [HttpPost("warehouse")]
        public async Task<ActionResult<int>> AddWarehouse([FromBody] AddWarehouseCommand command)
        {
            var warehouseId = await _mediator.Send(command);
            return CreatedAtAction(nameof(GetAllWarehouses), new { id = warehouseId }, warehouseId);
        }

        [HttpGet("warehouse")]
        public async Task<ActionResult<List<WarehouseDto>>> GetAllWarehouses()
        {
            var warehouses = await _mediator.Send(new GetAllWarehousesQuery());
            return Ok(warehouses);
        }

        [HttpPost("stock")]
        public async Task<ActionResult<int>> AddStock([FromBody] AddStockCommand command)
        {
            var stockId = await _mediator.Send(command);





            return CreatedAtAction(nameof(GetAllStocks), new { id = stockId }, stockId);
        }

        [HttpGet("stock")]
        public async Task<ActionResult<List<StockDto>>> GetAllStocks()
        {
            var stocks = await _mediator.Send(new GetAllStocksQuery());
            return Ok(stocks);
        }


        //PUT Endpoint To test Elsa

        [HttpPut("stock/{id}")]
        public async Task<ActionResult<int>> UpdateStock(int id, [FromBody] UpdateStockCommand command)
        {
            if (id != command.Id)
            {
                return BadRequest("Stock ID mismatch");
            }

            var updatedStockId = await _mediator.Send(command);
            return Ok(updatedStockId);
        }









    }
}
