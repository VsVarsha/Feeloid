import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';


export interface Playlist {
  id: number;
  name: string;
  description: string;
  userId: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private apiUrl = 'http://localhost:5210/api/playlists';

  constructor(private http: HttpClient) {}


  getUserPlaylists(userId: number): Observable<Playlist[]> {
    return this.http.get<Playlist[]>(`${this.apiUrl}/user/${userId}`);
  }
  deletePlaylist(playlistId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${playlistId}`);
  }


  createPlaylist(playlist: Partial<Playlist>): Observable<Playlist> {
    return this.http.post<Playlist>(this.apiUrl, playlist);
  }


  addSongToPlaylist(playlistId: number, songId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${playlistId}/songs`, { songId });
  }


  getPlaylistSongs(playlistId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.apiUrl}/${playlistId}/songs`);
  }


  removeSongFromPlaylist(playlistId: number, songId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${playlistId}/songs/${songId}`);
  }
}