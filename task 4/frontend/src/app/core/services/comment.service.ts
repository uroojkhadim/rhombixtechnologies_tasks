import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Comment } from '../models';

@Injectable({ providedIn: 'root' })
export class CommentService {
  private api = inject(ApiService);

  getAll(params?: Record<string, string>) {
    return this.api.get<Comment[]>('/comments', params);
  }

  create(data: { blogId: string; content: string }) {
    return this.api.post<Comment>('/comments', data);
  }

  updateStatus(id: string, status: 'approved' | 'pending') {
    return this.api.patch<Comment>(`/comments/${id}/status`, { status });
  }

  delete(id: string) {
    return this.api.delete(`/comments/${id}`);
  }
}
