import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Category } from '../models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private api = inject(ApiService);

  getAll() {
    return this.api.get<Category[]>('/categories');
  }

  create(data: { name: string }) {
    return this.api.post<Category>('/categories', data);
  }

  update(id: string, data: { name: string }) {
    return this.api.put<Category>(`/categories/${id}`, data);
  }

  delete(id: string) {
    return this.api.delete(`/categories/${id}`);
  }
}
