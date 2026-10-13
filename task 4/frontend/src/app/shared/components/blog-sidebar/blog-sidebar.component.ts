import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { BlogService } from '../../../core/services/blog.service';
import { Category, Blog } from '../../../core/models';

@Component({
  selector: 'app-blog-sidebar',
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe],
  templateUrl: './blog-sidebar.component.html',
})
export class BlogSidebarComponent implements OnInit {
  @Input() showSearch = true;
  @Input() showCategories = true;
  @Input() showRecent = true;
  @Input() selectedCategory = '';

  private categoryService = inject(CategoryService);
  private blogService = inject(BlogService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  recentPosts = signal<Blog[]>([]);
  searchQuery = '';

  ngOnInit() {
    if (this.showCategories) {
      this.categoryService.getAll().subscribe((r) => this.categories.set(r.data || []));
    }
    if (this.showRecent) {
      this.blogService.getBlogs({ limit: 5 }).subscribe((r) => this.recentPosts.set(r.data || []));
    }
  }

  onSearch() {
    if (!this.searchQuery.trim()) return;
    this.router.navigate(['/search'], { queryParams: { q: this.searchQuery.trim() } });
  }
}
