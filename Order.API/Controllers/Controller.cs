using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("1.0")]
public class ProductsController : ControllerBase
{
    [HttpGet]
    public IActionResult GetV1()
    {
        return Ok(new { message = "This is version 1.0" });
    }
}

[ApiController]
[Route("api/v{version:apiVersion}/[controller]")]
[ApiVersion("2.0")]
//controller with numbs just the num dont show in swagger cuz of versioning
public class Products2Controller : ControllerBase
{
    [HttpGet]
    public IActionResult GetV2()
    {
        return Ok(new { message = "This is version 2.0" });
    }
}