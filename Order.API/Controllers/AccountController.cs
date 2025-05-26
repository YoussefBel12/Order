using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Order.API.DTOs;
using Order.API.Entities;
using Order.API.Identity;

namespace Order.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]


    public class AccountController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<ApplicationRole> _roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly IConfiguration _configuration;


        public AccountController(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto model)
        {
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {


                await _userManager.AddToRoleAsync(user, "User");
                //    await _userManager.AddToRoleAsync(user, "Admin");

                return Ok(new { message = "User registered successfully" });
            }

            return BadRequest(result.Errors);
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            var user = await _userManager.GetUserAsync(User); // This fetches the current user

            if (user == null)
            {
                return Unauthorized(new { message = "User not found" });
            }



            await _signInManager.SignOutAsync(); // Signs out the user
            return Ok(new { message = "User logged out successfully" });
        }




        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null) return Unauthorized(new { message = "Invalid credentials" });

            var result = await _signInManager.PasswordSignInAsync(user, model.Password, false, false);
            if (!result.Succeeded) return Unauthorized(new { message = "Invalid credentials" });

            // Generate JWT using configuration for SecretKey
            //this line one bellow i addedd
            var userRoles = await _userManager.GetRolesAsync(user); // Get user roles

            // var claims = new[]
            var claims = new List<Claim>

           {
        new Claim(JwtRegisteredClaimNames.Sub, user.Id),
        new Claim(JwtRegisteredClaimNames.Email, user.Email),
        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
    };

            // i addedd this line below just one
            claims.AddRange(userRoles.Select(role => new Claim(ClaimTypes.Role, role))); // Add roles as claims!


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JwtSettings:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
             //   expires: DateTime.UtcNow.AddHours(1),
             expires: model.RememberMe ? DateTime.UtcNow.AddDays(7) : DateTime.UtcNow.AddHours(1), // Set expiration based on RememberMe
                signingCredentials: creds
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(token);





            return Ok(new
            {
                token = tokenString,

            });

        }




        [HttpGet("validate-token")]

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme, Roles = "admin , supervisor")]
        public IActionResult ValidateToken()
        {
            return Ok(new { message = "Token is valid" });
        }


        [HttpPut("change-password")]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] // Ensure the user is authenticated
        public async Task<IActionResult> ChangePassword(ChangePasswordDto model)
        {
            // Validate new password and confirmation password match
            if (model.NewPassword != model.ConfirmNewPassword)
            {
                return BadRequest(new { message = "New password and confirmation password do not match." });
            }

            // Get the currently authenticated user
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found or not authenticated." });
            }

            // Attempt to change the password
            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);

            if (!result.Succeeded)
            {
                // Return the identity errors
                return BadRequest(result.Errors);
            }

            return Ok(new { message = "Password changed successfully." });
        }






        [HttpGet("me")] // Correct endpoint for fetching user data
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)] // Protect with JWT authentication
        public async Task<IActionResult> GetCurrentUser()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null) return Unauthorized(); // More appropriate to return 401 Unauthorized

            var roles = await _userManager.GetRolesAsync(user);
            return Ok(new
            {
                email = user.Email,
                role = roles.FirstOrDefault(),
                firstName = user.FirstName, // Include other properties as needed
                lastName = user.LastName,
                username = user.FirstName + " " + user.LastName,
                id = user.Id
            });
        }
    }
}