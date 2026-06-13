using Microsoft.AspNetCore.Mvc;
using MusicMoodApi.DTOs;
using MusicMoodApi.Models;
using System.Linq;

namespace MusicMoodApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("update-mood")]
        public IActionResult UpdateMood(MoodUpdateDto moodDto)
        {
            //  Find the user in the database
            var user = _context.Users.FirstOrDefault(u => u.Id == moodDto.UserId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            //  Update their preferred mood
            user.PreferredMood = moodDto.PreferredMood;

            //  Save changes
            _context.SaveChanges();

            return Ok(new { message = $"Mood updated to {moodDto.PreferredMood}!" });
        }
    }
}