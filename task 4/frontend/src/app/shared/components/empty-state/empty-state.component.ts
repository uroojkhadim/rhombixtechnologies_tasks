import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `
    <div class="wp-widget py-12 text-center">
      <p class="text-4xl">{{ icon }}</p>
      <h3 class="mt-4 font-serif text-xl font-semibold text-wp-text dark:text-white">{{ title }}</h3>
      <p class="entry-meta mt-2">{{ message }}</p>
      <div class="mt-6">
        <ng-content />
      </div>
    </div>
  `,
})
export class EmptyStateComponent {
  @Input() icon = '📭';
  @Input() title = 'Nothing here yet';
  @Input() message = 'Check back later for new content.';
}
