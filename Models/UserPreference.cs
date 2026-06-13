namespace MusicMoodApi.Models
{
    public class UserPreference
    {
        public int UserId { get; set; }
        public string Genre { get; set; } = string.Empty;
        public float Weight { get; set; } 
    }
}