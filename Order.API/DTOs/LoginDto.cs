﻿namespace Order.API.DTOs
{
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }    
        public bool RememberMe { get; set; } = false; // Default to false
    }
}
