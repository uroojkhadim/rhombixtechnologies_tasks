import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);
  loading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit() {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.auth.login(this.form.getRawValue() as { email: string; password: string }).subscribe({
      next: () => {
        if (!this.auth.isAdmin()) {
          this.auth.logout();
          this.toast.error('Admin access only');
          this.loading.set(false);
          return;
        }
        this.router.navigate(['/admin']);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Login failed');
        this.loading.set(false);
      },
    });
  }
}
