namespace Order.API.Entities
{
    public class OrderClass
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public  string Email { get; set; }
        public string Phone { get; set; }
        public int OrderAmount { get; set; }
    }
}
