using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicMoodApi.Models; 


namespace MusicMoodApi.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context; 

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        //  REGISTER ENDPOINT
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto request)
        {
            // Check if username is already taken
            if (await _context.Users.AnyAsync(u => u.Username == request.Username))
            {
                return BadRequest("Username is already registered.");
            }

            // Securely hash the password string
            string saltAndHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

            var newUser = new User
            {
                Username = request.Username,
                PasswordHash = saltAndHash,
                PreferredMood = "Calm" // Default fallback mood assignment
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration successful!" });
        }

        // LOGIN ENDPOINT

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto request)
        {
            // Find user in MySQL database
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == request.Username);
            if (user == null)
            {
                // Return a structured JSON object instead of a raw text string
                return BadRequest(new { message = "Username does not exist." });
            }

            // Verify if the typed password matches the encrypted hash
            if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            {

                return BadRequest(new { message = "Incorrect password. Please try again." });
            }

            // Return the user session payload on success
            return Ok(new { 
                message = "Login successful!", 
                userId = user.Id, 
                username = user.Username 
            });
        }
    }
}