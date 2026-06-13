namespace MusicMoodApi.Models
{
//IsSkip

public class ListeningHistory
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int SongId { get; set; }
    public string MoodAtTime { get; set; } = string.Empty;
    public bool IsSkip { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.Now;
}
}