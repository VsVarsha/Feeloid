using MusicMoodApi.Models; 


namespace MusicMoodApi 
{
    public static class MusicSeeder
    {
        public static void Seed(AppDbContext context)
        {
            if (context.Songs.Any()) return; 

            var songs = new List<Song>
            {
                // ENERGETIC
new Song { Title = "Blinding Lights", Artist = "The Weeknd", Genre = "Pop", BPM = 171, MoodTag = "Energetic", youTubeId = "XXpIpbxSBl0" },
new Song { Title = "Mr. Brightside", Artist = "The Killers", Genre = "Rock", BPM = 148, MoodTag = "Energetic", youTubeId = "gGdGFtwCNBE" },
new Song { Title = "Titanium", Artist = "David Guetta", Genre = "EDM", BPM = 126, MoodTag = "Energetic", youTubeId = "JRfuAukYTKg" },
new Song { Title = "Power", Artist = "Kanye West", Genre = "Hip Hop", BPM = 154, MoodTag = "Energetic", youTubeId = "L53gjP-TtGE" },
new Song { Title = "Don't Stop Me Now", Artist = "Queen", Genre = "Rock", BPM = 156, MoodTag = "Energetic", youTubeId = "HgzGwKwLmgM" },
new Song { Title = "Sandstorm", Artist = "Darude", Genre = "Trance", BPM = 136, MoodTag = "Energetic", youTubeId = "y6120QOlsfU" },
new Song { Title = "Levitating", Artist = "Dua Lipa", Genre = "Pop", BPM = 103, MoodTag = "Energetic", youTubeId = "TUVcZfQe-Kw" },
new Song { Title = "Seven Nation Army", Artist = "The White Stripes", Genre = "Rock", BPM = 124, MoodTag = "Energetic", youTubeId = "0J2QdDbelmY" },
new Song { Title = "Wake Me Up", Artist = "Avicii", Genre = "EDM", BPM = 124, MoodTag = "Energetic", youTubeId = "IcrbM1l_BoI" },
new Song { Title = "Sabotage", Artist = "Beastie Boys", Genre = "Hip Hop", BPM = 168, MoodTag = "Energetic", youTubeId = "z5rRZdiu1UE" },

// HAPPY
new Song { Title = "Happy", Artist = "Pharrell Williams", Genre = "Pop", BPM = 160, MoodTag = "Happy", youTubeId = "ZbZSe6N_BXs" },
new Song { Title = "Good Vibrations", Artist = "The Beach Boys", Genre = "Rock", BPM = 151, MoodTag = "Happy", youTubeId = "Eab_beh07HU" },
new Song { Title = "Uptown Funk", Artist = "Bruno Mars", Genre = "Funk", BPM = 115, MoodTag = "Happy", youTubeId = "OPf0YbXqDm0" },
new Song { Title = "Walking On Sunshine", Artist = "Katrina & The Waves", Genre = "Pop", BPM = 110, MoodTag = "Happy", youTubeId = "iPUmE-tne5U" },
new Song { Title = "September", Artist = "Earth, Wind & Fire", Genre = "Disco", BPM = 126, MoodTag = "Happy", youTubeId = "Gs069dndIYk" },
new Song { Title = "Best Day Of My Life", Artist = "American Authors", Genre = "Indie", BPM = 100, MoodTag = "Happy", youTubeId = "Y66j_BUCBMY" },
new Song { Title = "Lovely Day", Artist = "Bill Withers", Genre = "Soul", BPM = 98, MoodTag = "Happy", youTubeId = "bEeaS6fuUoA" },
new Song { Title = "Shake It Off", Artist = "Taylor Swift", Genre = "Pop", BPM = 160, MoodTag = "Happy", youTubeId = "nfWlot6h_JM" },
new Song { Title = "I Got You (I Feel Good)", Artist = "James Brown", Genre = "Soul", BPM = 144, MoodTag = "Happy", youTubeId = "X4W26I7jzO8" },
new Song { Title = "Sun Is Shining", Artist = "Bob Marley", Genre = "Reggae", BPM = 103, MoodTag = "Happy", youTubeId = "fbBFJJiSEMY" },

// CALM
new Song { Title = "Clair de Lune", Artist = "Debussy", Genre = "Classical", BPM = 60, MoodTag = "Calm", youTubeId = "CvFH_6DNRCY" },
new Song { Title = "Weightless", Artist = "Marconi Union", Genre = "Ambient", BPM = 60, MoodTag = "Calm", youTubeId = "UfcAVejslrU" },
new Song { Title = "Sunset Lover", Artist = "Petit Biscuit", Genre = "Electronic", BPM = 91, MoodTag = "Calm", youTubeId = "irkZCnhGFaQ" },
new Song { Title = "Coffee", Artist = "Lofi Girl", Genre = "Lofi", BPM = 80, MoodTag = "Calm", youTubeId = "jfKfPfyJRdk" },
new Song { Title = "Blue in Green", Artist = "Miles Davis", Genre = "Jazz", BPM = 55, MoodTag = "Calm", youTubeId = "zmGnAOoN7vY" },
new Song { Title = "Gymnopédie No. 1", Artist = "Erik Satie", Genre = "Classical", BPM = 72, MoodTag = "Calm", youTubeId = "S-Xm7s9eGxU" },
new Song { Title = "Landslide", Artist = "Fleetwood Mac", Genre = "Folk", BPM = 159, MoodTag = "Calm", youTubeId = "WM7-PYtXtJM" },
new Song { Title = "Ocean Eyes", Artist = "Billie Eilish", Genre = "Pop", BPM = 145, MoodTag = "Calm", youTubeId = "viimfQi_pUw" },
new Song { Title = "Holocene", Artist = "Bon Iver", Genre = "Indie", BPM = 74, MoodTag = "Calm", youTubeId = "TWcyIpul8OE" },
new Song { Title = "Sparks", Artist = "Coldplay", Genre = "Indie", BPM = 103, MoodTag = "Calm", youTubeId = "9Sc-ir2UwGU" },

// SAD
new Song { Title = "Someone Like You", Artist = "Adele", Genre = "Soul", BPM = 67, MoodTag = "Sad", youTubeId = "hLQl3WQQoQ0" },
new Song { Title = "Fix You", Artist = "Coldplay", Genre = "Rock", BPM = 138, MoodTag = "Sad", youTubeId = "k4V3Mo61fJM" },
new Song { Title = "Yesterday", Artist = "The Beatles", Genre = "Rock", BPM = 97, MoodTag = "Sad", youTubeId = "NrgmdOz227I" },
new Song { Title = "Hurt", Artist = "Johnny Cash", Genre = "Country", BPM = 93, MoodTag = "Sad", youTubeId = "8AHCfZTRGiI" },
new Song { Title = "Stay With Me", Artist = "Sam Smith", Genre = "Pop", BPM = 84, MoodTag = "Sad", youTubeId = "pB-5XG-DbAA" },
new Song { Title = "Skinny Love", Artist = "Birdy", Genre = "Indie", BPM = 167, MoodTag = "Sad", youTubeId = "ZC6hBqFFFyE" },
new Song { Title = "Liability", Artist = "Lorde", Genre = "Pop", BPM = 76, MoodTag = "Sad", youTubeId = "TK_dMHPQ_xI" },
new Song { Title = "The Night We Met", Artist = "Lord Huron", Genre = "Indie", BPM = 87, MoodTag = "Sad", youTubeId = "KtlgYxa6BMU" },
new Song { Title = "Everybody Hurts", Artist = "R.E.M.", Genre = "Rock", BPM = 94, MoodTag = "Sad", youTubeId = "ijZRCIrTgQc" },
new Song { Title = "Fast Car", Artist = "Tracy Chapman", Genre = "Folk", BPM = 104, MoodTag = "Sad", youTubeId = "AnoFSBQKW0s" },



// FOCUS
new Song { Title = "Lose Yourself", Artist = "Eminem", Genre = "Hip Hop", BPM = 171, MoodTag = "Focus", youTubeId = "_Yhyp-_hX2s" },
new Song { Title = "The Grid", Artist = "Daft Punk", Genre = "Electronic", BPM = 125, MoodTag = "Focus", youTubeId = "6sOaAuGRBEc" },
new Song { Title = "Time", Artist = "Hans Zimmer", Genre = "Score", BPM = 124, MoodTag = "Focus", youTubeId = "RxabLA7UQ9k" },
new Song { Title = "Intro", Artist = "The xx", Genre = "Indie", BPM = 120, MoodTag = "Focus", youTubeId = "xMV6B26Vpus" },
new Song { Title = "Nightcall", Artist = "Kavinsky", Genre = "Synthwave", BPM = 80, MoodTag = "Focus", youTubeId = "MV_3Dpw-BRY" },
new Song { Title = "Starboy", Artist = "The Weeknd", Genre = "Pop", BPM = 186, MoodTag = "Focus", youTubeId = "34Na4j8AVgA" },
new Song { Title = "Midnight City", Artist = "M83", Genre = "Synthpop", BPM = 105, MoodTag = "Focus", youTubeId = "dX3k_QDnAnw" },
new Song { Title = "Voodoo Child", Artist = "Jimi Hendrix", Genre = "Rock", BPM = 175, MoodTag = "Energetic", youTubeId = "TM4BqQVjxME" },
new Song { Title = "Back In Black", Artist = "AC/DC", Genre = "Rock", BPM = 91, MoodTag = "Energetic", youTubeId = "pAgnJDJN4VA" },
new Song { Title = "Stressed Out", Artist = "Twenty One Pilots", Genre = "Pop", BPM = 170, MoodTag = "Sad", youTubeId = "pXRviuL6vMY" },
            };

            context.Songs.AddRange(songs);
            context.SaveChanges();
        }
    }
}