import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  template: `
    @if (pages > 1) {
      <nav class="flex items-center justify-center gap-1.5 py-8">
        <button
          type="button"
          [disabled]="page <= 1"
          (click)="change(page - 1)"
          class="btn btn-secondary !rounded-xl !px-3 !py-2 disabled:opacity-40"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
        </button>
        @for (p of pageNumbers; track p) {
          <button
            type="button"
            (click)="change(p)"
            class="flex h-10 min-w-10 items-center justify-center rounded-xl text-sm font-semibold transition"
            [class]="p === page ? 'bg-brand-600 text-white shadow-md shadow-brand-600/25' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'"
          >{{ p }}</button>
        }
        <button
          type="button"
          [disabled]="page >= pages"
          (click)="change(page + 1)"
          class="btn btn-secondary !rounded-xl !px-3 !py-2 disabled:opacity-40"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </button>
      </nav>
    }
  `,
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() pages = 1;
  @Output() pageChange = new EventEmitter<number>();

  get pageNumbers(): number[] {
    const max = 5;
    let start = Math.max(1, this.page - 2);
    let end = Math.min(this.pages, start + max - 1);
    start = Math.max(1, end - max + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  change(p: number) {
    if (p >= 1 && p <= this.pages) this.pageChange.emit(p);
  }
}
