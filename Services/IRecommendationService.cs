using MusicMoodApi.Models;


namespace MusicMoodApi.Services
{
    public interface IRecommendationService
    {
        //take a user ID and return the top 10 best-matched songs
        List<Song> GetRecommendations(int userId);
    }
}