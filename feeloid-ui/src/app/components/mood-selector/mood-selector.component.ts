import { Component, ChangeDetectorRef, ViewEncapsulation, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MoodService } from '../../services/mood.service';
import { PlaylistDisplayComponent } from '../playlist-display/playlist-display.component'; 
import { Song } from '../../models/song.model'; 
import { AuthService } from '../../services/auth.service';
import { PlaylistService, Playlist } from '../../services/playlist.service';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-mood-selector',
  standalone: true,
  imports: [CommonModule, PlaylistDisplayComponent], 
  templateUrl: './mood-selector.component.html',
  styleUrls: ['./mood-selector.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class MoodSelectorComponent implements OnInit {
  moods = [
    { text: 'Energetic', gradient: 'linear-gradient(180deg, #ff1f4b, #ff007f)' }, 
    { text: 'Calm',      gradient: 'linear-gradient(180deg, #00f2fe, #4facfe)' }, 
    { text: 'Sad',       gradient: 'linear-gradient(180deg, #7f00ff, #e100ff)' }, 
    { text: 'Happy',     gradient: 'linear-gradient(180deg, #ff9900, #ff5e62)' }, 
    { text: 'Focus',     gradient: 'linear-gradient(180deg, #00ff87, #60efff)' }  
  ];

  artists = [
    { name: 'The Weeknd', file: 'theweeknd.jpg' },
    { name: 'David Guetta', file: 'davidguetta.jpg' },
    { name: 'Kanye West', file: 'kanyewest.jpg' },
    { name: 'Dua Lipa', file: 'dualipa.jpg' },
    { name: 'Avicii', file: 'aviciii.jpg' },
    { name: 'Bruno Mars', file: 'brunomaars.jpg' },
    { name: 'Bob Marley', file: 'bobmarley.jpg' },
    { name: 'Lofi Girl', file: 'lofigirl.jpg' },
    { name: 'Billie Eilish', file: 'billieeilish.jpg' },
    { name: 'James Brown', file: 'jamesbrown.jpg' },
    { name: 'Adele', file: 'adele.jpg' },
    { name: 'Sam Smith', file: 'samsmith.jpg' },
  ];

  selectedArtist: string = ''; 
  genres = [
    { text: 'Pop',        gradient: 'linear-gradient(180deg, #b5179e, #7209b7)' },
    { text: 'Rock',       gradient: 'linear-gradient(180deg, #d90429, #ef233c)' },
    { text: 'EDM',        gradient: 'linear-gradient(180deg, #00f5d4, #00bbf9)' },
    { text: 'Hip Hop',    gradient: 'linear-gradient(180deg, #ffb703, #fb8500)' },
    { text: 'Trance',     gradient: 'linear-gradient(180deg, #9b5de5, #f15bb5)' },
    { text: 'Funk',       gradient: 'linear-gradient(180deg, #fee440, #fb5607)' },
    { text: 'Disco',      gradient: 'linear-gradient(180deg, #ff006e, #8338ec)' },
    { text: 'Indie',      gradient: 'linear-gradient(180deg, #38b000, #70e000)' },
    { text: 'Soul',       gradient: 'linear-gradient(180deg, #e63946, #457b9d)' },
    { text: 'Reggae',     gradient: 'linear-gradient(180deg, #52b788, #74c69d)' },
    { text: 'Classical',  gradient: 'linear-gradient(180deg, #a2d2ff, #bde0fe)' },
    { text: 'Ambient',    gradient: 'linear-gradient(180deg, #64dfdf, #7400b8)' },
    { text: 'Electronic', gradient: 'linear-gradient(180deg, #4ea8de, #56cfe1)' },
    { text: 'Lofi',       gradient: 'linear-gradient(180deg, #ffccd5, #ffb5a7)' },
    { text: 'Jazz',       gradient: 'linear-gradient(180deg, #9c6644, #7f5539)' },
    { text: 'Folk',       gradient: 'linear-gradient(180deg, #dda15e, #bc6c25)' },
    { text: 'Country',    gradient: 'linear-gradient(180deg, #adc178, #dde5b6)' },
    { text: 'Score',      gradient: 'linear-gradient(180deg, #6c757d, #343a40)' },
    { text: 'Synthwave',  gradient: 'linear-gradient(180deg, #f72585, #7209b7)' },
    { text: 'Synthpop',   gradient: 'linear-gradient(180deg, #3a0ca3, #4361ee)' }
  ];
  
  selectedMood: string = '';
  selectedGenre: string = ''; 
   
searchResultsLabel: string = '';

  statusMessage: string = '';
  recommendedTracks: Song[] = []; 

  currentView: 'home' | 'explore' | 'library' | 'playlist-detail' = 'home';
  userPlaylists: Playlist[] = [];
  activeSelectedPlaylist: Playlist | null = null;
  playlistTracks: Song[] = [];

  likedSongIds: number[] = [];

  currentPlayingTrack: Song | null = null;
  safePlayerUrl: SafeResourceUrl | null = null;
  isPlaybackSuspended: boolean = false; 

  constructor(
    private moodService: MoodService,
    private authService: AuthService, 
    private playlistService: PlaylistService,
    private router: Router,           
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer
  ) { 
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  onArtistSelect(artistName: string): void {
    this.selectedArtist = artistName;
    this.selectedMood = '';
    this.selectedGenre = '';
    this.recommendedTracks = [];
    this.statusMessage = `Loading tracks by ${artistName}...`;
    this.currentView = 'home'; 
    this.cdr.detectChanges();

    this.moodService.getSongsByStrictArtist(artistName).subscribe({
      next: (songs: Song[]) => {
        if (songs && songs.length > 0) {
          this.recommendedTracks = songs;
          this.statusMessage = '';
        } else {
          this.recommendedTracks = [];
          this.statusMessage = `No tracks found inside the database for "${artistName}".`;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Server error filtering artist catalog:', err);
        this.statusMessage = `Failed to fetch artist records.`;
        this.cdr.detectChanges();
      }
    });

    this.moodService.getSongsByStrictGenre(artistName).subscribe({
      next: (songs: Song[]) => {
        if (songs && songs.length > 0) {
          this.recommendedTracks = songs;
          this.statusMessage = '';
        } else {
          this.statusMessage = `No tracks found inside the database for "${artistName}".`;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Server error filtering artist catalog:', err);
        this.statusMessage = `Failed to fetch artist records.`;
        this.cdr.detectChanges();
      }
    });
  }

  clearSelectedArtist(): void {
    this.selectedArtist = '';
    this.recommendedTracks = [];
    this.navigateToHome();
  }
   
clearSearchResults(): void {
  this.searchResultsLabel = '';
  this.recommendedTracks = [];
  this.searchQuery = '';
  this.statusMessage = '';
  this.currentView = 'home';
  this.cdr.detectChanges();
}


  ngOnInit(): void {
    this.loadSidebarPlaylists();
    this.fetchListeningHistoryMetrics();
     this.restoreLastPlayedTrack();
  }
  restoreLastPlayedTrack(): void {
  this.moodService.getRecentlyPlayed(this.getActiveUserId(), 1).subscribe({
    next: (songs: Song[]) => {
      if (songs && songs.length > 0) {
        this.currentPlayingTrack = songs[0]; 
        this.isPlaybackSuspended = true;       
        this.safePlayerUrl = null;             
        this.cdr.detectChanges();
      }
    },
    error: () => {} // new users have no history
  });
}

  loadSidebarPlaylists(): void {
    this.playlistService.getUserPlaylists(this.getActiveUserId()).subscribe({
      next: (playlists) => {
        this.userPlaylists = playlists;
        
        // Find existing Liked Songs playlist and pull its tracks to initialize t
        const likedPlaylist = playlists.find(p => p.name.trim().toLowerCase() === 'liked songs');
        if (likedPlaylist) {
          this.playlistService.getPlaylistSongs(likedPlaylist.id).subscribe({
            next: (songs) => {
              this.likedSongIds = songs.map(s => s.id);
              this.cdr.detectChanges();
            }
          });
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to look up playlists for the navigation sidebar:', err)
    });
  }

  private getActiveUserId(): number {
    return this.authService.currentUserId() ?? 1;
  }

  navigateToHome(): void {
    this.currentView = 'home';
    this.selectedMood = '';
    this.selectedGenre = '';
    this.selectedArtist = '';
    this.recommendedTracks = [];
    this.statusMessage = '';
  }

  navigateToExplore(): void {
    this.currentView = 'explore';
    this.selectedMood = '';
    this.selectedGenre = '';
    this.recommendedTracks = [];
    this.statusMessage = '';
    this.cdr.detectChanges();
  }

  navigateToLibrary(): void {
    this.currentView = 'library';
    this.statusMessage = 'Loading your library folders...';
    this.playlistService.getUserPlaylists(this.getActiveUserId()).subscribe({
      next: (playlists) => {
        this.userPlaylists = playlists;
        this.statusMessage = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.statusMessage = 'Failed to load library playlists.';
        this.cdr.detectChanges();
      }
    });
  }

  onGenreSelect(genre: string): void {
    this.selectedGenre = genre;
    this.selectedMood = '';
    this.recommendedTracks = [];
    this.statusMessage = `Loading direct ${genre} catalog...`;
    this.cdr.detectChanges();

    this.moodService.getSongsByStrictGenre(genre).subscribe({
      next: (songs: Song[]) => {
        if (songs && songs.length > 0) {
          this.recommendedTracks = songs;
          this.statusMessage = '';
        } else {
          this.statusMessage = `No tracks currently matching "${genre}" found inside your Songs table rows.`;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Server tracking error filtering genres:', err);
        this.statusMessage = `Failed to fetch records. Ensure backend is rebuilt and listening.`;
        this.cdr.detectChanges();
      }
    });
  }

isProfileMenuOpen: boolean = false;


get currentUsername(): string {
  return this.authService.currentUsername() ?? 'User';
}


get currentUserInitial(): string {
  const name = this.currentUsername;
  return name.charAt(0).toUpperCase();
}


toggleProfileMenu(event: Event): void {
  event.stopPropagation();
  this.isProfileMenuOpen = !this.isProfileMenuOpen;
  this.cdr.detectChanges();
}


closeProfileMenu(): void {
  this.isProfileMenuOpen = false;
  this.cdr.detectChanges();
}
  clearSelectedGenre(): void {
    this.selectedGenre = '';
    this.recommendedTracks = [];
    this.navigateToExplore();
  }

  openPlaylistDetail(playlist: Playlist): void {
    this.currentView = 'playlist-detail';
    this.activeSelectedPlaylist = playlist;
    this.statusMessage = `Opening ${playlist.name}...`;
    
    this.playlistService.getPlaylistSongs(playlist.id).subscribe({
      next: (songs) => {
        this.playlistTracks = songs;
        this.statusMessage = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.statusMessage = 'Failed to fetch tracks for this playlist.';
        this.cdr.detectChanges();
      }
    });
  }

  isRemoveTrackModalOpen: boolean = false;
  trackTargetedForRemoval: Song | null = null;

  
  removeTrackFromActivePlaylist(track: Song): void {
    if (!this.activeSelectedPlaylist) return;
    
   
    this.trackTargetedForRemoval = track;
    this.isRemoveTrackModalOpen = true;
    this.cdr.detectChanges();
  }

  confirmAndExecuteTrackRemoval(): void {
    if (!this.activeSelectedPlaylist || !this.trackTargetedForRemoval) {
      this.closeRemoveTrackModal();
      return;
    }

    const track = this.trackTargetedForRemoval;

    this.playlistService.removeSongFromPlaylist(this.activeSelectedPlaylist.id, track.id).subscribe({
      next: () => {
        this.playlistTracks = this.playlistTracks.filter(s => s.id !== track.id);
        if (this.activeSelectedPlaylist?.name.trim().toLowerCase() === 'liked songs') {
          this.likedSongIds = this.likedSongIds.filter(id => id !== track.id);
        }
        this.closeRemoveTrackModal();
      },
      error: (err) => {
        console.error('Failed to remove track:', err);
        this.closeRemoveTrackModal();
      }
    });
  }

  closeRemoveTrackModal(): void {
    this.isRemoveTrackModalOpen = false;
    this.trackTargetedForRemoval = null;
    this.cdr.detectChanges();
  }



  isDeletePlaylistModalOpen: boolean = false;
  playlistTargetedForDeletion: Playlist | null = null;

  

handleDeleteWholePlaylist(playlist: Playlist, event: Event): void {
  event.stopPropagation();
 
  // Liked Songs can never be deleted
  if (this.isLikedSongsPlaylist(playlist)) {
    this.statusMessage = `"Liked Songs" can't be deleted.`;
    this.cdr.detectChanges();
    return;
  }
 
  this.playlistTargetedForDeletion = playlist;
  this.isDeletePlaylistModalOpen = true;
  this.cdr.detectChanges();
}


  confirmAndExecutePlaylistDeletion(): void {
    if (!this.playlistTargetedForDeletion) {
      this.closeDeletePlaylistModal();
      return;
    }

    const playlist = this.playlistTargetedForDeletion;

    this.playlistService.deletePlaylist(playlist.id).subscribe({
      next: () => {
        this.userPlaylists = this.userPlaylists.filter(p => p.id != playlist.id);
        if (this.activeSelectedPlaylist?.id === playlist.id) {
          this.navigateToLibrary();
        }
        if (playlist.name.trim().toLowerCase() === 'liked songs') {
          this.likedSongIds = [];
        }
        this.closeDeletePlaylistModal();
      },
      error: (err) => {
        console.error('Failed to delete playlist folder:', err);
        this.closeDeletePlaylistModal();
      }
    });
  }

  closeDeletePlaylistModal(): void {
    this.isDeletePlaylistModalOpen = false;
    this.playlistTargetedForDeletion = null;
    this.cdr.detectChanges();
  }

  isNewPlaylistModalOpen: boolean = false;
  newPlaylistNameInput: string = '';

  
  handleCreateNewPlaylistFromSidebar(): void {
  
    this.newPlaylistNameInput = '';
    this.isNewPlaylistModalOpen = true;
    this.cdr.detectChanges();
  }

  submitNewPlaylistWorkflow(): void {
    const cleanName = this.newPlaylistNameInput.trim();
    if (!cleanName) {
      this.closeNewPlaylistModal();
      return;
    }

    this.playlistService.createPlaylist({
      name: cleanName,
      description: 'Custom library playlist selection folder',
      userId: this.getActiveUserId()
    }).subscribe({
      next: () => {
        this.loadSidebarPlaylists(); 
        this.navigateToLibrary();
        this.closeNewPlaylistModal();
      },
      error: (err) => {
        console.error('Failed to create playlist:', err);
        this.closeNewPlaylistModal();
      }
    });
  }

  closeNewPlaylistModal(): void {
    this.isNewPlaylistModalOpen = false;
    this.newPlaylistNameInput = '';
    this.cdr.detectChanges();
  }

  getCustomPlaylistCoverPath(): string {
    if (this.currentView === 'playlist-detail' && this.activeSelectedPlaylist) {
      const id = this.activeSelectedPlaylist.id;
      const imageNumber = (id % 5) + 1; 
      return `assets/banners/${imageNumber}.jpeg`;
    }
    return 'assets/banners/default-playlist.jpeg';
  }
  get sortedPlaylistsForDisplay(): Playlist[] {
  const liked = this.userPlaylists.find(p => this.isLikedSongsPlaylist(p));
  const others = this.userPlaylists.filter(p => !this.isLikedSongsPlaylist(p));
  return liked ? [liked, ...others] : others;
}

isLikedSongsPlaylist(playlist: Playlist): boolean {
  return playlist.name.trim().toLowerCase() === 'liked songs';
}

  clearSelectedMood(): void {
    this.selectedMood = '';
    this.recommendedTracks = [];
    this.statusMessage = '';
    this.haltPlayback();
    this.navigateToHome();
  }

handleTrackPlay(track: Song): void {
    if (!track) return;

    try {
      const storageKey = `user_history_id_${this.getActiveUserId()}`;
      let playedIds: number[] = JSON.parse(localStorage.getItem(storageKey) || '[]');
      playedIds = playedIds.filter(id => id !== track.id);
      playedIds.unshift(track.id);
      if (playedIds.length > 30) playedIds.pop();
      localStorage.setItem(storageKey, JSON.stringify(playedIds));
    } catch (e) {
      console.error('LocalStorage history tracking execution failure:', e);
    }

    this.fetchListeningHistoryMetrics();

   
    this.moodService.logListeningEvent(
      this.getActiveUserId(),
      track.id,
      track.moodTag || this.activeSelectedPlaylist?.name || 'Calm',
      false 
    ).subscribe();

    this.currentPlayingTrack = track;
    this.isPlaybackSuspended = false;
    this.statusMessage = `Streaming "${track.title}" background deck...`;
    this.spinUpAudioStream(track.youTubeId);
  }
  private spinUpAudioStream(videoId: string): void {
    const nativeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1&controls=0&modestbranding=1&rel=0`;
    this.safePlayerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(nativeEmbedUrl);
    this.cdr.detectChanges();
  }

  togglePlayPauseState(): void {
    if (!this.currentPlayingTrack) return;
    if (!this.isPlaybackSuspended) {
      this.isPlaybackSuspended = true;
      this.safePlayerUrl = null; 
      this.statusMessage = `Playback paused: "${this.currentPlayingTrack.title}"`;
    } else {
      this.isPlaybackSuspended = false;
      this.statusMessage = `Resuming: "${this.currentPlayingTrack.title}"`;
      this.spinUpAudioStream(this.currentPlayingTrack.youTubeId);
    }
    this.cdr.detectChanges();
  }

  handleTrackLike(track: Song | null): void {
    if (!track) return;

  
    if (this.likedSongIds.includes(track.id)) {
      this.statusMessage = `Already liked "${track.title}"!`;
      this.cdr.detectChanges();
      return;
    }

    this.likedSongIds.push(track.id);
    this.statusMessage = `Liked "${track.title}"!`;
    this.cdr.detectChanges();


    this.moodService.logListeningEvent(this.getActiveUserId(), track.id, this.selectedMood || this.selectedGenre || 'Calm', false).subscribe();


    const targetPlaylist = this.userPlaylists.find(p => p.name.trim().toLowerCase() === 'liked songs');

    if (targetPlaylist) {
      // Add the song directly to the existing playlist container
      this.playlistService.addSongToPlaylist(targetPlaylist.id, track.id).subscribe({
        next: () => {
          if (this.currentView === 'playlist-detail' && this.activeSelectedPlaylist?.id === targetPlaylist.id) {
            this.playlistTracks.push(track);
          }
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Failed to append track to Liked Songs playlist:', err)
      });
    } else {
      // Create the "Liked Songs" playlist folder container fresh
      this.playlistService.createPlaylist({
        name: 'Liked Songs',
        description: 'Your favorite compilation entries',
        userId: this.getActiveUserId()
      }).subscribe({
        next: () => {

          this.playlistService.getUserPlaylists(this.getActiveUserId()).subscribe({
            next: (updatedList) => {
              this.userPlaylists = updatedList;
              const freshPlaylist = updatedList.find(p => p.name.trim().toLowerCase() === 'liked songs');
              if (freshPlaylist) {
                this.playlistService.addSongToPlaylist(freshPlaylist.id, track.id).subscribe({
                  next: () => this.cdr.detectChanges()
                });
              }
              this.cdr.detectChanges();
            }
          });
        },
        error: (err) => console.error('Failed auto-generating Liked Songs structural playlist:', err)
      });
    }
  }
searchQuery: string = '';

  handleSearch(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const rawQuery = inputElement.value.trim();
    this.searchQuery = rawQuery;

    if (!this.searchQuery) {
      this.statusMessage = '';
      this.recommendedTracks = [];
      this.selectedArtist = '';
      this.selectedGenre = '';
       this.searchResultsLabel = '';
      this.selectedMood = '';
      this.currentView = 'home';
      this.cdr.detectChanges();
      return;
    }

    this.statusMessage = `Searching for "${this.searchQuery}"...`;
    this.cdr.detectChanges();

    const lowerQuery = this.searchQuery.toLowerCase().trim();
    
   
    const matchedArtistDef = this.artists.find(a => a.name.toLowerCase().includes(lowerQuery));
    const matchedGenreDef = this.genres.find(g => g.text.toLowerCase().includes(lowerQuery));
    const matchedMoodDef = this.moods.find(m => m.text.toLowerCase().includes(lowerQuery));


    if (matchedMoodDef) {
      this.onMoodSelect(matchedMoodDef.text);
      return;
    }

    const finalArtistQuery = matchedArtistDef ? matchedArtistDef.name : this.searchQuery;
    const finalGenreQuery = matchedGenreDef ? matchedGenreDef.text : this.searchQuery;

    this.moodService.getSongsByStrictArtist(finalArtistQuery).subscribe({
      next: (artistSongs: Song[]) => {
        if (artistSongs && artistSongs.length > 0) {
          this.recommendedTracks = artistSongs;
          this.statusMessage = '';
          this.currentView = 'home';
          this.selectedArtist = matchedArtistDef ? matchedArtistDef.name : finalArtistQuery;
          this.selectedMood = '';
          this.selectedGenre = '';
          this.cdr.detectChanges();
        } else {
   

this.moodService.getSongsByStrictGenre(finalGenreQuery).subscribe({
  next: (genreSongs: Song[]) => {
    if (genreSongs && genreSongs.length > 0) {
      this.recommendedTracks = genreSongs;
      this.statusMessage = '';
      this.currentView = 'explore';
      this.selectedGenre = matchedGenreDef ? matchedGenreDef.text : finalGenreQuery;
      this.selectedMood = '';
      this.selectedArtist = '';
      this.cdr.detectChanges();
    } else {
      // FINAL FALLBACK — search song titles across the ENTIRE database
      this.moodService.getSongsByTitle(this.searchQuery).subscribe({
        next: (titleSongs: Song[]) => {
          if (titleSongs && titleSongs.length > 0) {
            this.recommendedTracks = titleSongs;
            this.statusMessage = '';
            this.currentView = 'home';
            this.selectedArtist = '';
            this.selectedMood = '';
            this.selectedGenre = '';
            this.searchResultsLabel = this.searchQuery;
          } else {
            this.recommendedTracks = [];
            this.statusMessage = `No tracks found matching "${this.searchQuery}".`;
          }
          this.cdr.detectChanges();
        },
        error: () => {
          this.recommendedTracks = [];
          this.statusMessage = `No tracks found matching "${this.searchQuery}".`;
          this.cdr.detectChanges();
        }
      });
    }
  },
  error: () => {

    this.moodService.getSongsByTitle(this.searchQuery).subscribe({
      next: (titleSongs: Song[]) => {
        if (titleSongs && titleSongs.length > 0) {
          this.recommendedTracks = titleSongs;
          this.statusMessage = '';
          this.currentView = 'home';
          this.selectedArtist = '';
          this.selectedMood = '';
          this.selectedGenre = '';
        } else {
          this.recommendedTracks = [];
          this.statusMessage = `No tracks found matching "${this.searchQuery}".`;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.recommendedTracks = [];
        this.statusMessage = `No tracks found matching "${this.searchQuery}".`;
        this.cdr.detectChanges();
      }
    });
  }
});
        }
      },
      error: (err) => {
        console.error('Search connection error:', err);
        this.statusMessage = 'An error occurred while communicating with the database.';
        this.cdr.detectChanges();
      }
    });
  }
  //  State parameters to support custom layout modal dialog boxes
  isPlaylistModalOpen: boolean = false;
  targetModalTrack: Song | null = null;
  modalPlaylistsAvailable: Playlist[] = [];

  openPlaylistModalWorkflow(track: Song): void {
    this.targetModalTrack = track;
    this.playlistService.getUserPlaylists(this.getActiveUserId()).subscribe({
      next: (playlists) => {
        this.modalPlaylistsAvailable = playlists || [];
        this.isPlaylistModalOpen = true;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed processing modal loading options framework:', err);
        alert('Could not pull your current playlists from the backend.');
      }
    });
  }

  closePlaylistModal(): void {
    this.isPlaylistModalOpen = false;
    this.targetModalTrack = null;
    this.modalPlaylistsAvailable = [];
    this.cdr.detectChanges();
  }

  handleModalAction(actionType: number, playlist: Playlist | null): void {
    if (!this.targetModalTrack) return;

    if (actionType === 0) {

      const playlistName = prompt('Enter a name for your new playlist folder:');
      if (!playlistName || !playlistName.trim()) return;

      this.playlistService.createPlaylist({
        name: playlistName.trim(),
        description: 'Custom library collection',
        userId: this.getActiveUserId()
      }).subscribe({
        next: (newPlaylist: any) => {
          const assignedId = newPlaylist?.id || newPlaylist?.Id || newPlaylist;
          if (assignedId) {
            this.playlistService.addSongToPlaylist(assignedId, this.targetModalTrack!.id).subscribe({
              next: () => {
                this.loadSidebarPlaylists(); 
                this.closePlaylistModal();
              }
            });
          }
        },
        error: (err) => console.error('Failed creating playlist via modal execution context:', err)
      });
    } else if (actionType === 1 && playlist) {
      // Append Song to Existing Selected Target Playlist row
      this.playlistService.addSongToPlaylist(playlist.id, this.targetModalTrack.id).subscribe({
        next: () => {
          this.closePlaylistModal();
        },
        error: () => alert('Could not save track. It might already belong to that playlist.')
      });
    }
  }
  handleTrackDislike(track: Song): void {
    this.statusMessage = `Disliked "${track.title}".`;
    this.cdr.detectChanges();
    this.moodService.logListeningEvent(this.getActiveUserId(), track.id, this.selectedMood || this.selectedGenre || 'Calm', true)
      .subscribe({ next: () => this.advanceToNextLogicalTrack() });
  }

  handleTrackSkip(track: Song): void {
    this.moodService.logListeningEvent(this.getActiveUserId(), track.id, this.selectedMood || this.selectedGenre || 'Relaxed', true)
      .subscribe({
        next: () => this.advanceToNextLogicalTrack(),
        error: () => this.advanceToNextLogicalTrack()
      });
  }

  private advanceToNextLogicalTrack(): void {
    const activeList = this.currentView === 'playlist-detail' ? this.playlistTracks : this.recommendedTracks;
    if (!this.currentPlayingTrack || activeList.length === 0) return;

    const currentIndex = activeList.findIndex(t => t.id === this.currentPlayingTrack?.id);
    const nextIndex = currentIndex + 1;

    if (nextIndex < activeList.length) {
      this.handleTrackPlay(activeList[nextIndex]);
    } else {
      this.handleTrackPlay(activeList[0]);
    }
  }

  handleTrackRewind(): void {
    const activeList = this.currentView === 'playlist-detail' ? this.playlistTracks : this.recommendedTracks;
    if (!this.currentPlayingTrack || activeList.length === 0) return;

    const currentIndex = activeList.findIndex(t => t.id === this.currentPlayingTrack?.id);
    const prevIndex = currentIndex - 1;

    if (prevIndex >= 0) {
      this.handleTrackPlay(activeList[prevIndex]);
    } else {
      this.handleTrackPlay(activeList[activeList.length - 1]);
    }
  }

  haltPlayback(): void {
    this.currentPlayingTrack = null;
    this.safePlayerUrl = null;
    this.isPlaybackSuspended = false;
    this.statusMessage = 'Playback session closed.';
    this.cdr.detectChanges();
  }

  triggerLogout(): void { this.authService.logout(); }

  onMoodSelect(mood: string): void {
    this.selectedMood = mood;
    this.selectedGenre = '';
    this.recommendedTracks = []; 
    this.currentView = 'home';
    this.statusMessage = `Updating profile to ${mood}...`;
    this.cdr.detectChanges(); 

    this.moodService.updateUserMood(this.getActiveUserId(), mood).subscribe({
      next: () => this.executeTripleFetchLoop(1),
      error: () => this.executeTripleFetchLoop(1)
    });
  }

  recentTracks: Song[] = [];
  isHistoryLoading: boolean = false;


fetchListeningHistoryMetrics(): void {
  this.isHistoryLoading = true;
  
  this.moodService.getRecentlyPlayed(this.getActiveUserId(), 10).subscribe({
    next: (songs: Song[]) => {
      this.recentTracks = songs;
      this.isHistoryLoading = false;
      this.cdr.detectChanges();
    },
    error: (err) => {
      console.warn('Failed to fetch listening history from DB:', err);
      this.recentTracks = [];
      this.isHistoryLoading = false;
      this.cdr.detectChanges();
    }
  });
}
 
  resolveTrackCoverAssetPath(track: Song): string {
    if (track && track.id) {
    
      const totalCoversAvailable = 19; 
      const imageNumber = (track.id % totalCoversAvailable) + 1;
      return `assets/cover/${imageNumber}.png`;
    }
    return 'assets/cover/1.png'; 
  }

 
 handleListenAgainCardClick(track: Song): void {
  
    this.handleTrackPlay(track);
    
    //  Refresh local state structures so the clicked track jumps to position 1
    this.fetchListeningHistoryMetrics();
    
    this.moodService.logListeningEvent(
      this.getActiveUserId(), 
      track.id, 
      this.selectedMood || this.selectedGenre || 'Calm', 
      false
    ).subscribe();
  }
  executeTripleFetchLoop(attempt: number): void {
    this.moodService.getRecommendations(this.getActiveUserId()).subscribe({
      next: (songs) => {
        if (songs && songs.length > 0) {
          this.recommendedTracks = songs;
          this.statusMessage = '';
          this.cdr.detectChanges(); 
        } else if (attempt < 3) {
          setTimeout(() => this.executeTripleFetchLoop(attempt + 1), 300);
        }
      },
      error: () => {
        if (attempt < 3) {
          setTimeout(() => this.executeTripleFetchLoop(attempt + 1), 300);
        }
      }
    });
  }
}