import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { QuillModule } from 'ngx-quill';
import { BlogService } from '../../../core/services/blog.service';
import { CategoryService } from '../../../core/services/category.service';
import { TagService } from '../../../core/services/tag.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category, Tag } from '../../../core/models';

@Component({
  selector: 'app-blog-form',
  standalone: true,
  imports: [ReactiveFormsModule, QuillModule, RouterLink],
  templateUrl: './blog-form.component.html',
})
export class BlogFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private blogService = inject(BlogService);
  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);
  private toast = inject(ToastService);

  editId = signal<string | null>(null);
  categories = signal<Category[]>([]);
  tags = signal<Tag[]>([]);
  selectedTags = signal<string[]>([]);
  imageFile: File | null = null;
  loading = signal(false);

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ header: [1, 2, 3, false] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  form = this.fb.group({
    title: ['', Validators.required],
    excerpt: [''],
    content: ['', Validators.required],
    category: ['', Validators.required],
    status: ['published'],
    isFeatured: [false],
  });

  ngOnInit() {
    this.categoryService.getAll().subscribe((r) => this.categories.set(r.data || []));
    this.tagService.getAll().subscribe((r) => this.tags.set(r.data || []));

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(id);
      this.blogService.getById(id).subscribe((res) => {
        const b = res.data;
        if (!b) return;
        this.form.patchValue({
          title: b.title,
          excerpt: b.excerpt,
          content: b.content,
          category: typeof b.category === 'object' ? b.category._id : String(b.category),
          status: b.status || 'published',
          isFeatured: b.isFeatured || false,
        });
        this.selectedTags.set(
          (b.tags || []).map((t) => (typeof t === 'object' ? t._id : String(t)))
        );
      });
    }
  }

  toggleTag(id: string) {
    this.selectedTags.update((list) =>
      list.includes(id) ? list.filter((t) => t !== id) : [...list, id]
    );
  }

  onImage(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) this.imageFile = input.files[0];
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const fd = new FormData();
    const v = this.form.getRawValue();
    fd.append('title', v.title!);
    fd.append('excerpt', v.excerpt || '');
    fd.append('content', v.content!);
    fd.append('category', v.category!);
    fd.append('status', v.status!);
    fd.append('isFeatured', String(v.isFeatured));
    fd.append('tags', JSON.stringify(this.selectedTags()));
    if (this.imageFile) fd.append('featuredImage', this.imageFile);

    this.loading.set(true);
    const req = this.editId()
      ? this.blogService.update(this.editId()!, fd)
      : this.blogService.create(fd);

    req.subscribe({
      next: () => {
        this.toast.success(this.editId() ? 'Blog updated' : 'Blog created');
        this.router.navigate(['/admin/blogs']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Save failed');
        this.loading.set(false);
      },
    });
  }
}
