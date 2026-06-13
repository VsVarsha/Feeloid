using Microsoft.AspNetCore.Mvc;
using MusicMoodApi.Services;

namespace MusicMoodApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecommendationsController : ControllerBase
    {
        private readonly IRecommendationService _recommendationService;


        public RecommendationsController(IRecommendationService recommendationService)
        {
            _recommendationService = recommendationService;
        }
        [HttpGet("{userId}")]
        public IActionResult GetCustomPlaylist(int userId)
        {
            var recommendedSongs = _recommendationService.GetRecommendations(userId);

            if (recommendedSongs == null || !recommendedSongs.Any())
            {
                return NotFound(new { message = "No recommendations available. Try updating your mood or history first!" });
            }

            return Ok(recommendedSongs);
        }
    }
}