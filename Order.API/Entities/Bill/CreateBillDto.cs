using Order.API.Entities.Bill;

public class CreateBillDto
{
    public List<BillItemDto> Items { get; set; } = new();
    public string? Status { get; set; } // Optional, default to "Pending"

    //new to send userid since elsa cant authon request
    public string? UserId { get; set; }
}