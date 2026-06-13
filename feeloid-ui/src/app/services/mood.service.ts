import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Song } from '../models/song.model';

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  private baseUrl = 'http://localhost:5210/api'; 

  constructor(private http: HttpClient) { }


  updateUserMood(userId: number, preferredMood: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/users/update-mood`, { userId, preferredMood });
  }



  getSongsByStrictArtist(artistName: string): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.baseUrl}/playlists/artist/${encodeURIComponent(artistName)}`);
  }


  getSongsByStrictGenre(genreName: string): Observable<Song[]> {
  
    return this.http.get<Song[]>(`${this.baseUrl}/playlists/genre/${encodeURIComponent(genreName)}`);
  }

  getRecommendations(userId: number): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.baseUrl}/recommendations/${userId}`);
  }
    getRecentlyPlayed(userId: number, limit: number = 10): Observable<Song[]> {
    return this.http.get<Song[]>(`${this.baseUrl}/History/${userId}/recent?limit=${limit}`);
  }

 


logListeningEvent(userId: number, songId: number, moodAtTime: string, isSkip: boolean): Observable<any> {
  const payload = {
    userId: userId,
    songId: songId,
    moodAtTime: moodAtTime,
    isSkip: isSkip
  };

  return this.http.post(`${this.baseUrl}/History`, payload);
}
}