using Microsoft.EntityFrameworkCore;
using MusicMoodApi.Models;

namespace MusicMoodApi
{
    
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

       
        public DbSet<Song> Songs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ListeningHistory> ListeningHistory { get; set; }
        public DbSet<UserPreference> UserPreferences { get; set; }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
            modelBuilder.Entity<UserPreference>()
                .HasKey(up => new { up.UserId, up.Genre });
        }
    }
}