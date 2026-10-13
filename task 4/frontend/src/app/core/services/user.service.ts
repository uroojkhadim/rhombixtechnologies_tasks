import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { User, DashboardStats } from '../models';

@Injectable({ providedIn: 'root' })
export class UserService {
  private api = inject(ApiService);

  getStats() {
    return this.api.get<DashboardStats>('/users/stats');
  }

  getAll() {
    return this.api.get<User[]>('/users');
  }

  blockUser(id: string, isBlocked: boolean) {
    return this.api.patch<User>(`/users/${id}/block`, { isBlocked });
  }

  deleteUser(id: string) {
    return this.api.delete(`/users/${id}`);
  }
}
