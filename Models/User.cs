namespace MusicMoodApi.Models{
    
public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PreferredMood { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    
}
}