



namespace Order.API
 {


public class StockDto
{
public int Id { get; set; }
public int ProductId { get; set; }
public string ProductName { get; set; } = string.Empty;
public int WarehouseId { get; set; }
public string WarehouseName { get; set; } = string.Empty;
public int Quantity { get; set; }
public DateTime LastUpdated { get; set; }
}

public class ProductDto
{
public int Id { get; set; }
public string Name { get; set; } = string.Empty;
public string SKU { get; set; } = string.Empty;
public string Description { get; set; } = string.Empty;
        //added this
        public string? ImageUrl { get; set; }
        public decimal Price { get; set; }
public bool IsActive { get; set; }
}

public class WarehouseDto
{
public int Id { get; set; }
public string Name { get; set; } = string.Empty;
public string Location { get; set; } = string.Empty;
public bool IsActive { get; set; }
}



}