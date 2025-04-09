
using System.ComponentModel.DataAnnotations;

namespace Order.API
{
    public class OrderDto
    {
        public int Id { get; set; }
        [Required]
        public required string Name { get; set; }
        [Required]
        public required string Email { get; set; }
        [Required]
        public required string Phone { get; set; }
        [Required]
        public required int OrderAmount { get; set; }
    }
}