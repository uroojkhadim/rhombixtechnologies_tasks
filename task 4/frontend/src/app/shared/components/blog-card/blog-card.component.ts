import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Blog, Category, User } from '../../../core/models';
import { imageUrl } from '../../utils/image-url';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './blog-card.component.html',
})
export class BlogCardComponent {
  @Input({ required: true }) blog!: Blog;
  @Input() variant: 'default' | 'featured' | 'horizontal' | 'list' = 'default';

  get cover() {
    return imageUrl(this.blog.featuredImage);
  }

  get categoryName(): string {
    const c = this.blog.category as Category;
    return typeof c === 'object' ? c.name : '';
  }

  get categoryId(): string {
    const c = this.blog.category as Category;
    return typeof c === 'object' ? c._id : String(this.blog.category);
  }

  get authorName(): string {
    const a = this.blog.author as User;
    return typeof a === 'object' ? a.name : 'Author';
  }

  get likeCount(): number {
    return this.blog.likeCount ?? this.blog.likes?.length ?? 0;
  }
}
