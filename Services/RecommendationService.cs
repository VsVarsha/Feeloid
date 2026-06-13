using MusicMoodApi.Models;


namespace MusicMoodApi.Services
{
    public class RecommendationService : IRecommendationService
    {
        private readonly AppDbContext _context;

        public RecommendationService(AppDbContext context)
        {
            _context = context;
        }

        public List<Song> GetRecommendations(int userId)
        {
            //Fetch user profile to get their current mood
            var user = _context.Users.FirstOrDefault(u => u.Id == userId);
            if (user == null) return new List<Song>();

            string currentMood = user.PreferredMood;

            var rawPreferences = _context.UserPreferences
                .Where(p => p.UserId == userId)
                .ToList();

            
            var genreAffinity = new Dictionary<string, double>();
            if (rawPreferences.Any())
            {
                double min = rawPreferences.Min(p => p.Weight);
                double max = rawPreferences.Max(p => p.Weight);
                double range = max - min;

                foreach (var pref in rawPreferences)
                {
                    genreAffinity[pref.Genre] = range > 0
                        ? (pref.Weight - min) / range
                        : 0.5; 
                }
            }

           
            
            var now = DateTime.UtcNow;

            var recentHistory = _context.ListeningHistory
                .Where(h => h.UserId == userId)
                .Join(_context.Songs,
                      h => h.SongId,
                      s => s.Id,
                      (h, s) => new { s.Genre, h.Timestamp })
                .ToList();

            var genreRecency = new Dictionary<string, List<double>>();
            foreach (var item in recentHistory)
            {
                if (!genreRecency.ContainsKey(item.Genre))
                    genreRecency[item.Genre] = new List<double>();

                double daysAgo = (now - item.Timestamp).TotalDays;

                // Decay factor
                double decayFactor = Math.Pow(0.5, daysAgo / 30.0);
                genreRecency[item.Genre].Add(decayFactor);
            }

            // Average decay across all interactions of  genre
            var recencyScores = genreRecency.ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value.Average()
            );

            //  Formula weights
            double wMood    = 5.0;
            double wGenre   = 2.0;
            double wRecency = 1.5;

           
            
            var allSongs = _context.Songs.ToList();
            var scoredSongs = new List<KeyValuePair<Song, double>>();

            foreach (var song in allSongs)
            {
                //  Mood Match: 1 if mood matches, 0 if not
                double M = song.MoodTag.Equals(currentMood,
                    StringComparison.OrdinalIgnoreCase) ? 1.0 : 0.0;

                //  Normalized genre affinity from UserPreferences (0.0 to 1.0)
                double G = genreAffinity.ContainsKey(song.Genre)
                    ? genreAffinity[song.Genre]
                    : 0.0;

                // Recency decay from ListeningHistory timestamps (0.0 to 1.0)
                double R = recencyScores.ContainsKey(song.Genre)
                    ? recencyScores[song.Genre]
                    : 0.0;

                // The formula
                double finalScore = (wMood * M) + (wGenre * G) + (wRecency * R);

                scoredSongs.Add(new KeyValuePair<Song, double>(song, finalScore));
            }

            // return top 10
            return scoredSongs
                .OrderByDescending(kvp => kvp.Value)
                .Select(kvp => kvp.Key)
                .Take(10)
                .ToList();
        }
    }
}