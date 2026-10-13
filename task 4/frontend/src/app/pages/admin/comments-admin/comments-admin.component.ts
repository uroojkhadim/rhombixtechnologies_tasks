import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CommentService } from '../../../core/services/comment.service';
import { ToastService } from '../../../core/services/toast.service';
import { Comment, Blog, User } from '../../../core/models';

@Component({
  selector: 'app-comments-admin',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './comments-admin.component.html',
})
export class CommentsAdminComponent implements OnInit {
  private commentService = inject(CommentService);
  private toast = inject(ToastService);
  comments = signal<Comment[]>([]);

  ngOnInit() {
    this.load();
  }

  load() {
    this.commentService.getAll().subscribe((r) => this.comments.set(r.data || []));
  }

  blogTitle(c: Comment) {
    const b = c.blogId as Blog;
    return typeof b === 'object' ? b.title : '';
  }

  userName(c: Comment) {
    const u = c.user as User;
    return typeof u === 'object' ? u.name : '';
  }

  approve(id: string) {
    this.commentService.updateStatus(id, 'approved').subscribe({
      next: () => {
        this.toast.success('Comment approved');
        this.load();
      },
    });
  }

  remove(id: string) {
    if (!confirm('Delete comment?')) return;
    this.commentService.delete(id).subscribe({
      next: () => {
        this.toast.success('Comment deleted');
        this.load();
      },
    });
  }
}
