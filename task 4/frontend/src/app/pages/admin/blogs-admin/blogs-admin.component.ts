import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog.service';
import { ToastService } from '../../../core/services/toast.service';
import { Blog } from '../../../core/models';

@Component({
  selector: 'app-blogs-admin',
  standalone: true,
  imports: [RouterLink, DatePipe, FormsModule],
  templateUrl: './blogs-admin.component.html',
})
export class BlogsAdminComponent implements OnInit {
  private blogService = inject(BlogService);
  private toast = inject(ToastService);
  blogs = signal<Blog[]>([]);
  search = '';

  filteredBlogs = computed(() => {
    const q = this.search.toLowerCase().trim();
    if (!q) return this.blogs();
    return this.blogs().filter((b) => b.title.toLowerCase().includes(q));
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.blogService.getBlogs({ admin: true, limit: 50 }).subscribe((r) => this.blogs.set(r.data || []));
  }

  delete(id: string) {
    if (!confirm('Delete this blog permanently?')) return;
    this.blogService.delete(id).subscribe({
      next: () => {
        this.toast.success('Blog deleted');
        this.load();
      },
      error: () => this.toast.error('Delete failed'),
    });
  }
}
