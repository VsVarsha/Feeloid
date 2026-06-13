namespace MusicMoodApi.Models
{
    public class Song
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Artist { get; set; } = string.Empty;
        public string Genre { get; set; } = string.Empty;
        public int BPM { get; set; }
        public string MoodTag { get; set; } = string.Empty;
        
        public string youTubeId { get; set; } = string.Empty;
    }
}