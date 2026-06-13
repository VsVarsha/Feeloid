import { Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { MoodSelectorComponent } from './components/mood-selector/mood-selector.component';

export const routes: Routes = [
  { path: 'login', component: AuthComponent },
  { path: 'dashboard', component: MoodSelectorComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
  
];