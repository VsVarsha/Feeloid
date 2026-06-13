namespace MusicMoodApi.DTOs
{
    public class MoodUpdateDto
    {
        public int UserId { get; set; }
        public string PreferredMood { get; set; } = string.Empty;
    }
}