import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../core/services/category.service';
import { TagService } from '../../../core/services/tag.service';
import { ToastService } from '../../../core/services/toast.service';
import { Category, Tag } from '../../../core/models';

@Component({
  selector: 'app-taxonomy-admin',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './taxonomy-admin.component.html',
})
export class TaxonomyAdminComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private tagService = inject(TagService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  tags = signal<Tag[]>([]);

  catForm = this.fb.group({ name: ['', Validators.required] });
  tagForm = this.fb.group({ name: ['', Validators.required] });

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.categoryService.getAll().subscribe((r) => this.categories.set(r.data || []));
    this.tagService.getAll().subscribe((r) => this.tags.set(r.data || []));
  }

  addCategory() {
    if (this.catForm.invalid) return;
    this.categoryService.create({ name: this.catForm.value.name! }).subscribe({
      next: () => {
        this.toast.success('Category added');
        this.catForm.reset();
        this.reload();
      },
      error: () => this.toast.error('Failed to add category'),
    });
  }

  addTag() {
    if (this.tagForm.invalid) return;
    this.tagService.create({ name: this.tagForm.value.name! }).subscribe({
      next: () => {
        this.toast.success('Tag added');
        this.tagForm.reset();
        this.reload();
      },
      error: () => this.toast.error('Failed to add tag'),
    });
  }

  deleteCategory(id: string) {
    this.categoryService.delete(id).subscribe({
      next: () => {
        this.toast.success('Category deleted');
        this.reload();
      },
      error: (err) => this.toast.error(err.error?.message || 'Delete failed'),
    });
  }

  deleteTag(id: string) {
    this.tagService.delete(id).subscribe({
      next: () => {
        this.toast.success('Tag deleted');
        this.reload();
      },
      error: () => this.toast.error('Delete failed'),
    });
  }
}
