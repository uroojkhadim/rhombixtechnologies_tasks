import { Component, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-reading-progress',
  standalone: true,
  template: `
    <div class="fixed left-0 right-0 top-0 z-[60] h-1 bg-slate-200/50 dark:bg-slate-800/50">
      <div
        class="h-full bg-gradient-to-r from-brand-600 to-violet-500 transition-[width] duration-150 ease-out"
        [style.width.%]="progress()"
      ></div>
    </div>
  `,
})
export class ReadingProgressComponent {
  progress = signal(0);

  @HostListener('window:scroll')
  onScroll() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const height = doc.scrollHeight - doc.clientHeight;
    this.progress.set(height > 0 ? Math.min(100, (scrollTop / height) * 100) : 0);
  }
}
