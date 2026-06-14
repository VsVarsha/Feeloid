# Feeloid — AI Music Mood Recommendation Engine

A full-stack mood-based music web app that recommends songs based on how you're feeling right now and gets smarter the more you use it.

---

## How the Recommendation Works

Songs are scored using a three-factor weighted formula:

```
Score = (W_mood x M) + (W_genre x G) + (W_recency x R)
```

| Variable | Meaning | Range |
|---|---|---|
| M | Mood Match — does the song's mood tag match yours? | 1 or 0 |
| G | Genre Affinity — normalized score built from your like/skip history | 0.0 to 1.0 |
| R | Recency Decay — recent interactions count more than old ones | 0.0 to 1.0 |

- Weights: `W_mood = 5.0`, `W_genre = 2.0`, `W_recency = 1.5`
- Genre weights are pre-aggregated in the `UserPreferences` table and updated in real time on every like or skip
- Recency decay halves every 30 days using `0.5^(daysAgo/30)`

---

## Features

- 5 Mood Channels — Energetic, Calm, Sad, Happy, Focus
- Personalized Recommendations — adapts to your taste through listening history
- Like, Dislike, Skip — all feed back into the algorithm in real time
- Featured Artists — browse songs by artist directly
- Recently Played — fetched live from the database
- Playlist Library — create playlists, add songs, manage your collection
- Persistent Playback Dock — shows last played song on login
- Search — searches by artist first, then genre, then song title
- Auth — register and login with BCrypt password hashing

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21 |
| Backend | ASP.NET Core Web API (.NET 8) |
| Database | MySQL |
| ORM | Entity Framework Core |
| Auth | BCrypt.Net |
| Music Playback | YouTube IFrame Embed |

---

## Database Schema

```
Users             — Id, Username, PasswordHash, PreferredMood
Songs             — Id, Title, Artist, Genre, BPM, MoodTag, youTubeId
ListeningHistory  — UserId, SongId, MoodAtTime, IsSkip, Timestamp
UserPreferences   — UserId, Genre, Weight  (composite primary key)
Playlists         — Id, Name, Description, UserId, CreatedAt
PlaylistSongs     — PlaylistId, SongId, AddedAt
```

---

## Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [MySQL 8.0+](https://dev.mysql.com/downloads/)
- Angular CLI — `npm install -g @angular/cli`

---

### Backend Setup

```bash
# 1. Clone the repo
git clone https://github.com/VsVarsha/feeloid.git
cd feeloid

# 2. Set up your database config
cp appsettings.example.json appsettings.json
# Edit appsettings.json and fill in your MySQL credentials

# 3. Create the database in MySQL Workbench
CREATE DATABASE feeloid;

# 4. Run the backend — migrations and seeder run automatically
dotnet run
```

Backend runs at `http://localhost:5210`

---

### Frontend Setup

```bash
# 1. Navigate to frontend
cd feeloid-ui

# 2. Install dependencies
npm install

# 3. Start the dev server
ng serve
```

Frontend runs at `http://localhost:4200`

---

## Project Structure

```
MusicMoodApi/
├── Controllers/
│   ├── AuthController.cs            — register, login
│   ├── HistoryController.cs         — log plays/skips, fetch recent history
│   ├── PlaylistsController.cs       — playlist CRUD, artist/genre search
│   ├── RecommendationsController.cs — returns top 10 scored songs
│   └── UserController.cs            — update mood
├── Services/
│   ├── IRecommendationService.cs    — interface (contract)
│   └── RecommendationService.cs     — scoring formula implementation
├── Models/                           — EF Core entity classes
├── DTOs/                             — request/response shapes
├── AppDbContext.cs                   — EF Core database bridge
├── MusicSeeder.cs                    — seeds 200+ songs on first run
├── Program.cs                        — startup, dependency injection, CORS
├── appsettings.example.json          — config template
└── feeloid-ui/                       — Angular frontend
    └── src/app/
        ├── components/
        │   ├── mood-selector/        — main shell, all views, playback
        │   └── playlist-display/     — song rows, add to playlist
        ├── services/
        │   ├── auth.service.ts
        │   ├── mood.service.ts
        │   └── playlist.service.ts
        └── models/
            └── song.model.ts
```

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/users/update-mood` | Update preferred mood |
| GET | `/api/recommendations/{userId}` | Get top 10 recommended songs |
| POST | `/api/History` | Log a play or skip |
| GET | `/api/History/{userId}/recent` | Get recently played songs |
| GET | `/api/playlists/user/{userId}` | Get user playlists |
| POST | `/api/playlists` | Create playlist |
| POST | `/api/playlists/{id}/songs` | Add song to playlist |
| GET | `/api/playlists/{id}/songs` | Get songs in playlist |
| DELETE | `/api/playlists/{id}` | Delete playlist |
| DELETE | `/api/playlists/{id}/songs/{songId}` | Remove song from playlist |
| GET | `/api/playlists/artist/{name}` | Search songs by artist |
| GET | `/api/playlists/genre/{name}` | Search songs by genre |

---

## Author

Varsha VS
- GitHub: [VsVarsha](https://github.com/VsVarsha)

---
