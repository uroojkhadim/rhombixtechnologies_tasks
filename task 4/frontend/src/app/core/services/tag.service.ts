import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Tag } from '../models';

@Injectable({ providedIn: 'root' })
export class TagService {
  private api = inject(ApiService);

  getAll() {
    return this.api.get<Tag[]>('/tags');
  }

  create(data: { name: string }) {
    return this.api.post<Tag>('/tags', data);
  }

  update(id: string, data: { name: string }) {
    return this.api.put<Tag>(`/tags/${id}`, data);
  }

  delete(id: string) {
    return this.api.delete(`/tags/${id}`);
  }
}
