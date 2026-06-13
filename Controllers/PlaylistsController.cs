using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicMoodApi.Models;

namespace MusicMoodApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PlaylistsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PlaylistsController(AppDbContext context)
        {
            _context = context;
        }

        
        [HttpGet("artist/{artistName}")]
        public async Task<IActionResult> GetTracksStrictlyByArtist(string artistName)
        {
            try
            {
                var sql = "SELECT * FROM Songs WHERE LOWER(Artist) = LOWER({0});";
                var tracks = await _context.Songs.FromSqlRaw(sql, artistName).ToListAsync();
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Database artist filtering failed: {ex.Message}");
            }
        }

        
        [HttpGet("genre/{genreName}")]
        public async Task<IActionResult> GetTracksStrictlyByGenre(string genreName)
        {
            try
            {
                var sql = "SELECT * FROM Songs WHERE LOWER(Genre) = LOWER({0});";
                var tracks = await _context.Songs.FromSqlRaw(sql, genreName).ToListAsync();
                return Ok(tracks);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[EXPLORE GENRE ERROR]: {ex.Message}");
                return StatusCode(500, $"Database genre filtering failed: {ex.Message}");
            }
        }

     
        [HttpPost]
        public async Task<IActionResult> CreatePlaylist([FromBody] CreatePlaylistDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                return BadRequest("Playlist name cannot be empty.");


            var description = dto.Description ?? string.Empty;

            var sql = "INSERT INTO Playlists (Name, Description, UserId, CreatedAt) VALUES ({0}, {1}, {2}, NOW());";
            await _context.Database.ExecuteSqlRawAsync(sql, dto.Name, description, dto.UserId);

            var latestId = await _context.Database
                .SqlQueryRaw<int>("SELECT LAST_INSERT_ID();")
                .FirstOrDefaultAsync();

            return Ok(new { id = latestId, message = "Playlist created successfully." });
        }


        [HttpGet("user/{userId}")]
        public async Task<IActionResult> GetUserPlaylists(int userId)
        {
            var playlists = await _context.Database
                .SqlQueryRaw<PlaylistDto>(
                    "SELECT Id, Name, Description, UserId, CreatedAt FROM Playlists WHERE UserId = {0} ORDER BY CreatedAt DESC;",
                    userId)
                .ToListAsync();

            return Ok(playlists);
        }


        [HttpPost("{playlistId}/songs")]
        public async Task<IActionResult> AddSongToPlaylist(int playlistId, [FromBody] AddPlaylistSongDto dto)
        {
            try
            {
                var sql = "INSERT INTO PlaylistSongs (PlaylistId, SongId, AddedAt) VALUES ({0}, {1}, NOW());";
                await _context.Database.ExecuteSqlRawAsync(sql, playlistId, dto.SongId);
                return Ok(new { message = "Track added to playlist successfully." });
            }
            catch (Exception)
            {
                return BadRequest("Track already exists in this playlist.");
            }
        }


        [HttpGet("{playlistId}/songs")]
        public async Task<IActionResult> GetPlaylistSongs(int playlistId)
        {
            var sql = @"
                SELECT s.* FROM Songs s
                INNER JOIN PlaylistSongs ps ON s.Id = ps.SongId
                WHERE ps.PlaylistId = {0}
                ORDER BY ps.AddedAt DESC;";

            var tracks = await _context.Songs.FromSqlRaw(sql, playlistId).ToListAsync();
            return Ok(tracks);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePlaylist(int id)
        {

            var clearJunctionSql = "DELETE FROM PlaylistSongs WHERE PlaylistId = {0};";
            await _context.Database.ExecuteSqlRawAsync(clearJunctionSql, id);

            var deletePlaylistSql = "DELETE FROM Playlists WHERE Id = {0};";
            var affectedRows = await _context.Database.ExecuteSqlRawAsync(deletePlaylistSql, id);

            if (affectedRows == 0)
                return NotFound(new { message = "Playlist not found." });

            return Ok(new { message = "Playlist deleted successfully." });
        }


        [HttpDelete("{playlistId}/songs/{songId}")]
        public async Task<IActionResult> RemoveSongFromPlaylist(int playlistId, int songId)
        {
            var sql = "DELETE FROM PlaylistSongs WHERE PlaylistId = {0} AND SongId = {1};";
            var affectedRows = await _context.Database.ExecuteSqlRawAsync(sql, playlistId, songId);

            if (affectedRows == 0)
                return NotFound(new { message = "Song not found in this playlist." });

            return Ok(new { message = "Song removed from playlist successfully." });
        }
    }
}