import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Song } from '../../models/song.model';
import { PlaylistService, Playlist } from '../../services/playlist.service';

@Component({
  selector: 'app-playlist-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './playlist-display.component.html',
  styleUrls: ['./playlist-display.component.css']
})
export class PlaylistDisplayComponent {
  @Input() tracks: Song[] = []; 
  @Input() currentUserId: number = 1;
  
  @Output() onPlayTrack = new EventEmitter<Song>();
  @Output() onLikeTrack = new EventEmitter<Song>();
  @Output() onSkipTrack = new EventEmitter<Song>(); 
  @Output() onDislikeTrack = new EventEmitter<Song>();

  constructor(
    private playlistService: PlaylistService,
    private cdr: ChangeDetectorRef
  ) {}

  triggerPlay(track: Song): void { this.onPlayTrack.emit(track); }
  triggerLike(track: Song): void { this.onLikeTrack.emit(track); }
  triggerSkip(track: Song): void { this.onSkipTrack.emit(track); } 
  triggerDislike(track: Song): void { this.onDislikeTrack.emit(track); }


  handleAddTrackWorkflow(track: Song): void {
    this.playlistService.getUserPlaylists(this.currentUserId).subscribe({
      next: (playlists: any[]) => {
        
        //  If database returns an empty array
        if (!playlists || playlists.length === 0) {
          const createNew = confirm(`You do not have any playlists right now.\n\nWould you like to build a new collection folder for "${track.title}"?`);
          if (createNew) {
            this.createNewPlaylistAndAddTrack(track);
          }
          return;
        }

        //  Build the list block prompt string, fallback checking both C# casing variations
        let selectionPrompt = `Select a playlist number to save "${track.title}":\n\n`;
        selectionPrompt += `0. [Create New Playlist]\n`;
        
        playlists.forEach((playlist, index) => {
          const currentName = playlist.name || playlist.Name || `Playlist #${index + 1}`;
          selectionPrompt += `${index + 1}. ${currentName}\n`;
        });

        const userInput = prompt(selectionPrompt);
        
        // If user closes prompt or clicks cancel
        if (userInput === null) return; 

        const cleanInput = userInput.trim();
        if (cleanInput === '') {
          alert('Input cannot be empty.');
          return;
        }

        const selectedIndex = parseInt(cleanInput, 10);

        // Validate type boundaries
        if (isNaN(selectedIndex)) {
          alert('Invalid option choice. Digits only.');
          return;
        }

        if (selectedIndex < 0 || selectedIndex > playlists.length) {
          alert(`Invalid option selected. Out of bounds range.`);
          return;
        }

        //  Process matching index actions
        if (selectedIndex === 0) {
          this.createNewPlaylistAndAddTrack(track);
        } else {
          const targetPlaylist = playlists[selectedIndex - 1];
          const targetPlaylistId = targetPlaylist.id || targetPlaylist.Id;

          if (targetPlaylistId) {
            this.saveTrackToDatabaseJunction(targetPlaylistId, track);
          } else {
            alert('Could not parse database key ID reference mapping attributes.');
          }
        }
      },
      error: (err) => {
        console.error('Error fetching playlists:', err);
        alert('Could not pull your current playlists from the backend.');
      }
    });
  }

  private saveTrackToDatabaseJunction(playlistId: number, track: Song): void {
    this.playlistService.addSongToPlaylist(playlistId, track.id).subscribe({
      next: () => {
        alert(`Successfully added "${track.title}" to your playlist!`);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Junction table save failed:', err);
        alert('Could not save track. It might already belong to that playlist.');
      }
    });
  }

  private createNewPlaylistAndAddTrack(track: Song): void {
    const playlistName = prompt('Enter a name for your new playlist folder:');
    if (!playlistName || !playlistName.trim()) return;

    const payload = {
      name: playlistName.trim(),
      description: 'Custom library collection',
      userId: this.currentUserId
    };

    this.playlistService.createPlaylist(payload).subscribe({
      next: (newPlaylist: any) => {
   
        const assignedId = newPlaylist?.id || newPlaylist?.Id || newPlaylist;
        if (assignedId) {
          this.saveTrackToDatabaseJunction(assignedId, track);
        } else {
          alert('Playlist registered successfully! Re-add the song into it.');
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed creating playlist row:', err);
        alert('Could not register a new playlist folder.');
      }
    });
  }
}