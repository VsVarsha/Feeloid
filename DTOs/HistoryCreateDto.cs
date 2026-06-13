namespace MusicMoodApi.DTOs
{
    public class HistoryCreateDto
    {
        public int UserId { get; set; }
        public int SongId { get; set; }
        public string MoodAtTime { get; set; } = string.Empty;
        public bool IsSkip { get; set; } 
    }
}