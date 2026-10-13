import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { imageUrl } from '../../shared/utils/image-url';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  loading = signal(false);
  selectedFile: File | null = null;
  preview = signal('');

  form = this.fb.group({
    name: [''],
    password: [''],
  });

  ngOnInit() {
    const u = this.auth.user();
    if (u) {
      this.form.patchValue({ name: u.name });
      this.preview.set(imageUrl(u.profileImage, ''));
    }
  }

  onFile(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files?.[0]) {
      this.selectedFile = input.files[0];
      this.preview.set(URL.createObjectURL(this.selectedFile));
    }
  }

  save() {
    const fd = new FormData();
    fd.append('name', this.form.value.name || '');
    const pwd = this.form.value.password;
    if (pwd) fd.append('password', pwd);
    if (this.selectedFile) fd.append('profileImage', this.selectedFile);

    this.loading.set(true);
    this.auth.updateProfile(fd).subscribe({
      next: () => {
        this.toast.success('Profile updated');
        this.loading.set(false);
        this.form.patchValue({ password: '' });
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Update failed');
        this.loading.set(false);
      },
    });
  }
}
