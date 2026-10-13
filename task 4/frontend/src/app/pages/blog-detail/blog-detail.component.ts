import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BlogService } from '../../core/services/blog.service';
import { CommentService } from '../../core/services/comment.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Blog, Category, Comment, User } from '../../core/models';
import { BlogCardComponent } from '../../shared/components/blog-card/blog-card.component';
import { SkeletonComponent } from '../../shared/components/skeleton/skeleton.component';
import { ReadingProgressComponent } from '../../shared/components/reading-progress/reading-progress.component';
import { BlogSidebarComponent } from '../../shared/components/blog-sidebar/blog-sidebar.component';
import { imageUrl } from '../../shared/utils/image-url';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [
    RouterLink,
    DatePipe,
    FormsModule,
    BlogCardComponent,
    SkeletonComponent,
    ReadingProgressComponent,
    BlogSidebarComponent,
  ],
  templateUrl: './blog-detail.component.html',
})
export class BlogDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private blogService = inject(BlogService);
  private commentService = inject(CommentService);
  private sanitizer = inject(DomSanitizer);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  blog = signal<Blog | null>(null);
  loading = signal(true);
  commentText = '';
  submitting = false;
  toc = signal<TocItem[]>([]);
  safeContent = signal<SafeHtml>('');

  ngOnInit() {
    this.route.params.subscribe((p) => {
      this.loading.set(true);
      this.blogService.getBySlug(p['slug']).subscribe({
        next: (res) => {
          const b = res.data || null;
          this.blog.set(b);
          if (b?.content) {
            const { html, headings } = this.processContent(b.content);
            this.safeContent.set(this.sanitizer.bypassSecurityTrustHtml(html));
            this.toc.set(headings);
          }
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    });
  }

  processContent(content: string) {
    const headings: TocItem[] = [];
    let index = 0;
    const html = content.replace(/<h([23])>(.*?)<\/h\1>/gi, (_, level, text) => {
      const id = `section-${index++}`;
      const plain = text.replace(/<[^>]*>/g, '').trim();
      headings.push({ id, text: plain, level: parseInt(level, 10) });
      return `<h${level} id="${id}">${text}</h${level}>`;
    });
    return { html, headings };
  }

  cover(path?: string) {
    return imageUrl(path);
  }

  categoryName(b: Blog) {
    const c = b.category as Category;
    return typeof c === 'object' ? c.name : '';
  }

  authorName(b: Blog) {
    const a = b.author as User;
    return typeof a === 'object' ? a.name : 'Author';
  }

  authorInitial(b: Blog) {
    return this.authorName(b).charAt(0);
  }

  share(platform: string) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(this.blog()?.title || '');
    const links: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
    };
    window.open(links[platform], '_blank', 'width=600,height=400');
  }

  toggleLike() {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please sign in to like posts');
      return;
    }
    const b = this.blog();
    if (!b) return;
    this.blogService.toggleLike(b._id).subscribe({
      next: (res) => {
        this.blog.update((blog) =>
          blog ? { ...blog, likeCount: res.data?.likeCount, isLiked: res.data?.isLiked } : blog
        );
      },
    });
  }

  submitComment() {
    if (!this.auth.isLoggedIn()) {
      this.toast.error('Please sign in to comment');
      return;
    }
    const b = this.blog();
    if (!b || !this.commentText.trim()) return;
    this.submitting = true;
    this.commentService.create({ blogId: b._id, content: this.commentText.trim() }).subscribe({
      next: (res) => {
        this.toast.success(this.auth.isAdmin() ? 'Comment posted' : 'Comment submitted for approval');
        if (res.data && this.auth.isAdmin()) {
          this.blog.update((blog) => ({ ...blog!, comments: [res.data!, ...(blog?.comments || [])] }));
        }
        this.commentText = '';
        this.submitting = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to post');
        this.submitting = false;
      },
    });
  }

  commentAuthor(c: Comment) {
    const u = c.user as User;
    return typeof u === 'object' ? u.name : 'User';
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
