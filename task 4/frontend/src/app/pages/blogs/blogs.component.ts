import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../core/services/blog.service';
import { CategoryService } from '../../core/services/category.service';
import { TagService } from '../../core/services/tag.service';
import { Blog, Category, Tag, Pagination } from '../../core/models';
import { BlogCardComponent } from '../../shared/components/blog-card/blog-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { BlogSidebarComponent } from '../../shared/components/blog-sidebar/blog-sidebar.component';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    BlogCardComponent,
    BlogSidebarComponent,
    SkeletonComponent,
    PaginationComponent,
    EmptyStateComponent,
  ],
  templateUrl: './blogs.component.html',
})
export class BlogsComponent implements OnInit {
  private blogService = inject(BlogService);
  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  blogs = signal<Blog[]>([]);
  categories = signal<Category[]>([]);
  tags = signal<Tag[]>([]);
  pagination = signal<Pagination>({ page: 1, limit: 9, total: 0, pages: 1 });
  loading = signal(true);

  selectedCategory = '';
  selectedTag = '';
  search = '';
  sort = 'newest';
  viewMode: 'grid' | 'list' = 'grid';

  ngOnInit() {
    this.categoryService.getAll().subscribe((r) => this.categories.set(r.data || []));
    this.tagService.getAll().subscribe((r) => this.tags.set(r.data || []));

    this.route.queryParams.subscribe((params) => {
      this.selectedCategory = params['category'] || '';
      this.selectedTag = params['tag'] || '';
      this.search = params['search'] || '';
      this.sort = params['sort'] || 'newest';
      this.load(+(params['page'] || 1));
    });
  }

  getParams(page: number): Record<string, string | number | boolean> {
    const params: Record<string, string | number | boolean> = { page, limit: 9 };
    if (this.selectedCategory) params['category'] = this.selectedCategory;
    if (this.selectedTag) params['tag'] = this.selectedTag;
    if (this.search) params['search'] = this.search;
    if (this.sort === 'trending') params['sort'] = 'trending';
    if (this.route.snapshot.queryParams['featured']) params['featured'] = true;
    return params;
  }

  load(page = 1) {
    this.loading.set(true);
    this.blogService.getBlogs(this.getParams(page)).subscribe({
      next: (res) => {
        this.blogs.set(res.data || []);
        if (res.pagination) this.pagination.set(res.pagination);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  applyFilters() {
    this.router.navigate([], {
      queryParams: {
        category: this.selectedCategory || null,
        tag: this.selectedTag || null,
        search: this.search || null,
        sort: this.sort !== 'newest' ? this.sort : null,
        page: 1,
      },
      queryParamsHandling: 'merge',
    });
  }

  filterCategory(id: string) {
    this.selectedCategory = this.selectedCategory === id ? '' : id;
    this.applyFilters();
  }

  filterTag(id: string) {
    this.selectedTag = this.selectedTag === id ? '' : id;
    this.applyFilters();
  }

  clearFilters() {
    this.selectedCategory = '';
    this.selectedTag = '';
    this.search = '';
    this.sort = 'newest';
    this.router.navigate(['/blogs']);
  }

  onPageChange(page: number) {
    this.router.navigate([], { queryParams: { page }, queryParamsHandling: 'merge' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
