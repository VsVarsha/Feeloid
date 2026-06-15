import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5210/api/auth'; 
  private currentUserIdSignal = signal<number | null>(null);
  private currentUsernameSignal = signal<string | null>(null);


  currentUserId = computed(() => this.currentUserIdSignal());
  currentUsername = computed(() => this.currentUsernameSignal());
  isLoggedIn = computed(() => this.currentUserIdSignal() !== null);

  constructor(private http: HttpClient, private router: Router) {

    const savedId = localStorage.getItem('music_user_id');
    const savedName = localStorage.getItem('music_username');
    
    if (savedId && savedName) {
      this.currentUserIdSignal.set(parseInt(savedId, 10));
      this.currentUsernameSignal.set(savedName);
    }
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post<{ message: string, userId: number, username: string }>(`${this.apiUrl}/login`, { username, password })
      .pipe(
        tap(response => {

          localStorage.setItem('music_user_id', response.userId.toString());
          localStorage.setItem('music_username', response.username);
          

          this.currentUserIdSignal.set(response.userId);
          this.currentUsernameSignal.set(response.username);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('music_user_id');
    localStorage.removeItem('music_username');
    this.currentUserIdSignal.set(null);
    this.currentUsernameSignal.set(null);
    this.router.navigate(['/login']);
  }
}