import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';
import { CategoryService } from '../../core/services/category.service';
import { Blog, Category } from '../../core/models';
import { BlogCardComponent } from '../../shared/components/blog-card/blog-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { BlogSidebarComponent } from '../../shared/components/blog-sidebar/blog-sidebar.component';
import { fadeIn } from '../../shared/animations/fade.animation';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, BlogCardComponent, SkeletonComponent, BlogSidebarComponent],
  templateUrl: './home.component.html',
  animations: [fadeIn],
})
export class HomeComponent implements OnInit {
  private blogService = inject(BlogService);
  private categoryService = inject(CategoryService);

  latest = signal<Blog[]>([]);
  featured = signal<Blog[]>([]);
  trending = signal<Blog[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);

  heroBlog = computed(() => this.featured()[0] || this.latest()[0] || null);

  ngOnInit() {
    this.categoryService.getAll().subscribe((r) => this.categories.set(r.data || []));
    this.blogService.getFeatured().subscribe((r) => this.featured.set(r.data || []));
    this.blogService.getTrending().subscribe((r) => this.trending.set(r.data || []));
    this.blogService.getBlogs({ page: 1, limit: 6 }).subscribe({
      next: (res) => {
        this.latest.set(res.data || []);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
