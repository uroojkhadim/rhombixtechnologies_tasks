import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { User } from '../models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private userSignal = signal<User | null>(this.loadUser());
  user = this.userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.userSignal());
  isAdmin = computed(() => this.userSignal()?.role === 'admin');
  token = signal<string | null>(localStorage.getItem('token'));

  private loadUser(): User | null {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  }

  register(data: { name: string; email: string; password: string }) {
    return this.api.post<User>('/auth/register', data).pipe(
      tap((res) => {
        if (res.token && res.user) this.setSession(res.token, res.user);
      })
    );
  }

  login(data: { email: string; password: string }) {
    return this.api.post<User>('/auth/login', data).pipe(
      tap((res) => {
        if (res.token && res.user) this.setSession(res.token, res.user);
      })
    );
  }

  fetchMe() {
    return this.api.get<User>('/auth/me').pipe(
      tap((res) => {
        if (res.user) {
          this.userSignal.set(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  updateProfile(formData: FormData) {
    return this.api.uploadPut<User>('/auth/profile', formData).pipe(
      tap((res) => {
        if (res.user) {
          this.userSignal.set(res.user);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  setSession(token: string, user: User) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.token.set(token);
    this.userSignal.set(user);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token.set(null);
    this.userSignal.set(null);
    this.router.navigate(['/']);
  }
}
