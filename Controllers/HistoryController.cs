using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MusicMoodApi.DTOs;
using MusicMoodApi.Models;
using System;
using System.Linq;

namespace MusicMoodApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HistoryController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HistoryController(AppDbContext context)
        {
            _context = context;
        }

  
        [HttpPost]
        public IActionResult LogListeningEvent([FromBody] HistoryCreateDto historyDto)
        {
            if (historyDto == null)
                return BadRequest(new { error = "Incoming history payload was empty." });

            try
            {
                var historyRecord = new ListeningHistory
                {
                    UserId    = historyDto.UserId,
                    SongId    = historyDto.SongId,
                    MoodAtTime = historyDto.MoodAtTime ?? "Unknown",
                    IsSkip    = historyDto.IsSkip,
                    Timestamp = DateTime.UtcNow
                };
                _context.ListeningHistory.Add(historyRecord);

                var song = _context.Songs.FirstOrDefault(s => s.Id == historyDto.SongId);
                string targetGenre = song != null ? song.Genre : "Unknown";

                var preference = _context.UserPreferences
                    .FirstOrDefault(p => p.UserId == historyDto.UserId && p.Genre == targetGenre);

                if (preference == null)
                {
                    preference = new UserPreference
                    {
                        UserId = historyDto.UserId,
                        Genre  = targetGenre,
                        Weight = 0.0f
                    };
                    _context.UserPreferences.Add(preference);
                }

                if (historyDto.IsSkip)
                    preference.Weight -= 2.0f;
                else
                    preference.Weight += 1.0f;

                _context.SaveChanges();

                return Ok(new {
                    message    = "Dual-Write Complete!",
                    matchedGenre = targetGenre,
                    songFound  = (song != null)
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine("======= CRITICAL DUAL-WRITE ERROR =======");
                Console.WriteLine(ex.Message);
                Console.WriteLine(ex.InnerException?.Message);
                Console.WriteLine("=========================================");
                return StatusCode(500, new { error = "Database write failed.", details = ex.Message });
            }
        }

      
        [HttpGet("{userId}/recent")]
        public IActionResult GetRecentlyPlayed(int userId, [FromQuery] int limit = 10)
        {
            try
            {
               
 
                //  Raw history rows for this user, ordered by timestamp
                var rawHistory = _context.ListeningHistory
                    .Where(h => h.UserId == userId && !h.IsSkip)
                    .OrderByDescending(h => h.Timestamp)
                    .ToList();
 
                
 
                //  Join with Songs
                var joined = rawHistory
                    .Join(_context.Songs.ToList(),
                          h => h.SongId,
                          s => s.Id,
                          (h, s) => new {
                              s.Id, s.Title, s.Artist, s.Genre,
                              s.BPM, s.MoodTag, s.youTubeId,
                              h.Timestamp
                          })
                    .ToList();
 
                
                
 
                //  Group by song Id, pick most recent play
                var grouped = joined
                    .GroupBy(x => x.Id)
                    .Select(g => g.OrderByDescending(x => x.Timestamp).First())
                    .ToList();
 
               
 
                //  Final sort 
                var finalResult = grouped
                    .OrderByDescending(x => x.Timestamp)
                    .Take(limit)
                    .ToList();
 
               
               
                var result = finalResult.Select(s => new {
                    id        = s.Id,
                    title     = s.Title,
                    artist    = s.Artist,
                    genre     = s.Genre,
                    bpm       = s.BPM,
                    moodTag   = s.MoodTag,
                    youTubeId = s.youTubeId
                });
 
                return Ok(result);
            }
            catch (Exception ex)
            {
               
                return StatusCode(500, new { error = "Failed to fetch recent history.", details = ex.Message });
            }
        }
    }
}
