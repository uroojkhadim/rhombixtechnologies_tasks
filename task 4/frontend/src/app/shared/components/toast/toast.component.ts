import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div class="pointer-events-none fixed right-4 top-4 z-[100] flex w-full max-w-sm flex-col gap-2 sm:right-6 sm:top-6">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          (click)="toastService.remove(toast.id)"
          class="pointer-events-auto flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-card backdrop-blur-xl transition animate-[slideIn_0.35s_ease]"
          [class]="toastClasses(toast.type)"
        >
          <span class="mt-0.5 text-lg">{{ icon(toast.type) }}</span>
          <p class="flex-1 text-sm font-medium">{{ toast.message }}</p>
        </div>
      }
    </div>
  `,
  styles: `
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(100%); }
      to { opacity: 1; transform: translateX(0); }
    }
  `,
})
export class ToastComponent {
  toastService = inject(ToastService);

  toastClasses(type: string) {
    const map: Record<string, string> = {
      success: 'border-emerald-200/80 bg-emerald-50/95 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-950/90 dark:text-emerald-200',
      error: 'border-red-200/80 bg-red-50/95 text-red-800 dark:border-red-500/30 dark:bg-red-950/90 dark:text-red-200',
      info: 'border-brand-200/80 bg-white/95 text-slate-800 dark:border-brand-500/30 dark:bg-surface-900/95 dark:text-slate-200',
    };
    return map[type] || map['info'];
  }

  icon(type: string) {
    return type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  }
}
