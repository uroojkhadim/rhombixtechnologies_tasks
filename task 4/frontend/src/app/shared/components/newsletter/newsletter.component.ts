import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-newsletter',
  standalone: true,
  imports: [FormsModule],
  template: `
    <section class="wp-widget border-brand-200 bg-brand-50/30 dark:border-brand-800 dark:bg-brand-950/20">
      <h2 class="wp-widget-title">Subscribe to our newsletter</h2>
      <p class="text-sm leading-relaxed text-wp-muted dark:text-slate-400">
        Get the latest articles in your inbox. No spam — unsubscribe anytime.
      </p>
      <form (ngSubmit)="subscribe()" class="mt-4 flex flex-col gap-2 sm:flex-row">
        <input type="email" [(ngModel)]="email" name="email" required placeholder="Email address" class="input-field flex-1" />
        <button type="submit" class="btn btn-primary shrink-0" [disabled]="loading()">
          {{ loading() ? '…' : 'Subscribe' }}
        </button>
      </form>
    </section>
  `,
})
export class NewsletterComponent {
  private toast = inject(ToastService);
  email = '';
  loading = signal(false);

  subscribe() {
    if (!this.email.trim()) return;
    this.loading.set(true);
    setTimeout(() => {
      this.toast.success('Thank you for subscribing!');
      this.email = '';
      this.loading.set(false);
    }, 600);
  }
}
