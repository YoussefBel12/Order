using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Order.API.Entities.Bill;

namespace Order.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BillController : ControllerBase
    {
        private readonly OrderDbContext _context;

        public BillController(OrderDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<BillDto>>> GetAllBills()
        {
            var bills = await _context.Bills
                .Include(b => b.Items)
                .Select(b => new BillDto
                {
                    Id = b.Id,
                    BillNumber = b.BillNumber,
                    Date = b.Date,
                    TotalAmount = b.TotalAmount,
                    Status = b.Status,
                    Items = b.Items.Select(i => new BillItemDto
                    {
                        Id = i.Id,
                        Description = i.Description,
                        Amount = i.Amount
                    }).ToList()
                })
                .ToListAsync();

            return Ok(bills);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BillDto>> GetBill(int id)
        {
            var bill = await _context.Bills
                .Include(b => b.Items)
                .Where(b => b.Id == id)
                .Select(b => new BillDto
                {
                    Id = b.Id,
                    BillNumber = b.BillNumber,
                    Date = b.Date,
                    TotalAmount = b.TotalAmount,
                    Status = b.Status,
                    Items = b.Items.Select(i => new BillItemDto
                    {
                        Id = i.Id,
                        Description = i.Description,
                        Amount = i.Amount
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (bill == null)
                return NotFound();

            return Ok(bill);
        }

        [HttpPost]
      //  [Authorize]
        public async Task<ActionResult<int>> CreateBill([FromBody] CreateBillDto dto)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            //this part tell if u didnt find user u get it from a payload in elsa
            if (string.IsNullOrEmpty(userId))
                userId = dto.UserId;

            if (string.IsNullOrEmpty(userId))
                return BadRequest("UserId is required.");

            // stop here 







            // Generate BillNumber (example: "INV-20240607-0001")
            var billNumber = $"INV-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString()[..8]}";

            var bill = new Bill
            {
                BillNumber = billNumber,
                Date = DateTime.UtcNow,
                TotalAmount = dto.Items.Sum(i => i.Amount),
                Status = dto.Status ?? "Pending",
                UserId = userId,
                Items = dto.Items.Select(i => new BillItem
                {
                    Description = i.Description,
                    Amount = i.Amount
                }).ToList()
            };

            _context.Bills.Add(bill);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBill), new { id = bill.Id }, bill.Id);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBill(int id)
        {
            var bill = await _context.Bills.Include(b => b.Items).FirstOrDefaultAsync(b => b.Id == id);
            if (bill == null)
                return NotFound();

            _context.BillItems.RemoveRange(bill.Items);
            _context.Bills.Remove(bill);
            await _context.SaveChangesAsync();
            return NoContent();
        }



        //bills to see in react for user
        [HttpGet("mybills")]
        [Authorize]
        public async Task<ActionResult<List<BillDto>>> GetMyBills()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized("UserId could not be determined from token.");

            var bills = await _context.Bills
                .Where(b => b.UserId == userId)
                .Include(b => b.Items)
                .Select(b => new BillDto
                {
                    Id = b.Id,
                    BillNumber = b.BillNumber,
                    Date = b.Date,
                    TotalAmount = b.TotalAmount,
                    Status = b.Status,
                    Items = b.Items.Select(i => new BillItemDto
                    {
                        Id = i.Id,
                        Description = i.Description,
                        Amount = i.Amount
                    }).ToList()
                })
                .ToListAsync();

            return Ok(bills);
        }






    }
}