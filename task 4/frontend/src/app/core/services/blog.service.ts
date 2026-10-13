import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { Blog } from '../models';

@Injectable({ providedIn: 'root' })
export class BlogService {
  private api = inject(ApiService);

  getBlogs(params?: Record<string, string | number | boolean>) {
    return this.api.get<Blog[]>('/blogs', params);
  }

  getFeatured() {
    return this.api.get<Blog[]>('/blogs/featured');
  }

  getTrending() {
    return this.api.get<Blog[]>('/blogs/trending');
  }

  getBySlug(slug: string) {
    return this.api.get<Blog>(`/blogs/slug/${slug}`);
  }

  getById(id: string) {
    return this.api.get<Blog>(`/blogs/${id}`);
  }

  create(formData: FormData) {
    return this.api.upload<Blog>('/blogs', formData);
  }

  update(id: string, formData: FormData) {
    return this.api.uploadPut<Blog>(`/blogs/${id}`, formData);
  }

  delete(id: string) {
    return this.api.delete(`/blogs/${id}`);
  }

  toggleLike(id: string) {
    return this.api.post<{ likeCount: number; isLiked: boolean }>(`/blogs/${id}/like`, {});
  }
}
