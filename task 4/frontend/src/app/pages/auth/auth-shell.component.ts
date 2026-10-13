import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-shell',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="flex min-h-[calc(100vh-8rem)] bg-wp-bg dark:bg-surface-950">
      <div class="hidden w-2/5 border-r border-wp-border bg-white p-12 lg:flex lg:flex-col lg:justify-between dark:border-slate-700 dark:bg-surface-900">
        <a routerLink="/" class="font-serif text-2xl font-bold text-wp-text dark:text-white">InkFlow</a>
        <blockquote class="font-serif text-2xl leading-snug text-wp-text dark:text-slate-200">"{{ quote }}"</blockquote>
        <p class="text-sm text-wp-muted">{{ subtitle }}</p>
      </div>
      <div class="flex w-full flex-col justify-center bg-white px-8 py-12 lg:w-3/5 dark:bg-surface-900">
        <div class="mx-auto w-full max-w-md">
          <ng-content />
        </div>
      </div>
    </div>
  `,
})
export class AuthShellComponent {
  @Input() quote = 'Reading is essential for those who seek to rise above the ordinary.';
  @Input() subtitle = 'Join our community of readers.';
}
