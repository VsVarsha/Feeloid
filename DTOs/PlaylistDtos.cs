namespace MusicMoodApi.Models
{
   
    public class CreatePlaylistDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int UserId { get; set; }
    }

  
    public class PlaylistDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedAt { get; set; }
    }

   
    public class AddPlaylistSongDto
    {
        public int SongId { get; set; }
    }
}