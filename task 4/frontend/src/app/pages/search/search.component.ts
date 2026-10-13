import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../core/services/blog.service';
import { Blog } from '../../core/models';
import { BlogCardComponent } from '../../shared/components/blog-card/blog-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [FormsModule, RouterLink, BlogCardComponent, EmptyStateComponent],
  templateUrl: './search.component.html',
})
export class SearchComponent {
  private blogService = inject(BlogService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  query = '';
  results = signal<Blog[]>([]);
  searched = signal(false);
  loading = signal(false);

  constructor() {
    this.route.queryParams.subscribe((p) => {
      this.query = p['q'] || '';
      if (this.query) this.search();
    });
  }

  search() {
    if (!this.query.trim()) return;
    this.router.navigate([], { queryParams: { q: this.query.trim() } });
    this.loading.set(true);
    this.blogService.getBlogs({ search: this.query.trim(), limit: 12 }).subscribe({
      next: (res) => {
        this.results.set(res.data || []);
        this.searched.set(true);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
