import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode: boolean = true;
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {

    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']); 
    }
  }

  toggleAuthMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.successMessage = '';
  }

 handleSubmit(event: Event): void {
    event.preventDefault();
    if (!this.username || !this.password) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (this.isLoginMode) {
      this.authService.login(this.username, this.password).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          
        
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else if (typeof err.error === 'string') {
            this.errorMessage = err.error;
          } else {
            this.errorMessage = 'Authentication failure. Check database connection.';
          }
        }
      });
    } else {
      this.authService.register(this.username, this.password).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Account generated! Switching to Sign In...';
          setTimeout(() => {
            this.isLoginMode = true;
            this.successMessage = '';
          }, 1500);
        },
        error: (err) => {
          this.isLoading = false;
          
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            this.errorMessage = typeof err.error === 'string' ? err.error : 'Registration failed. Username may be taken.';
          }
        }
      });
    }
  }
}