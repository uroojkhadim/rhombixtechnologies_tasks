import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: true,
  template: `
    <div
      class="grid gap-6"
      [class.grid-cols-1]="columns === 1"
      [class.grid-cols-2]="columns === 2"
      [class.grid-cols-3]="columns === 3"
      [class.lg:grid-cols-3]="columns === 3"
      [class.md:grid-cols-2]="columns >= 2"
    >
      @for (i of items; track i) {
        <div class="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-surface-900">
          <div class="aspect-[16/10] animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
          <div class="space-y-3 p-5">
            <div class="h-3 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div>
            <div class="h-5 w-4/5 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"></div>
            <div class="h-4 w-full animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"></div>
            <div class="h-4 w-2/3 animate-pulse rounded-lg bg-slate-100 dark:bg-slate-800"></div>
          </div>
        </div>
      }
    </div>
  `,
})
export class SkeletonComponent {
  @Input() count = 6;
  @Input() columns = 3;
  get items() {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
