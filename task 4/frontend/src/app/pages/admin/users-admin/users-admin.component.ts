import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ToastService } from '../../../core/services/toast.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './users-admin.component.html',
})
export class UsersAdminComponent implements OnInit {
  private userService = inject(UserService);
  private toast = inject(ToastService);
  users = signal<User[]>([]);

  ngOnInit() {
    this.userService.getAll().subscribe((r) => this.users.set(r.data || []));
  }

  toggleBlock(user: User) {
    this.userService.blockUser(user._id, !user.isBlocked).subscribe({
      next: () => {
        this.toast.success(user.isBlocked ? 'User unblocked' : 'User blocked');
        this.userService.getAll().subscribe((r) => this.users.set(r.data || []));
      },
    });
  }

  remove(id: string) {
    if (!confirm('Delete user permanently?')) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.toast.success('User deleted');
        this.userService.getAll().subscribe((r) => this.users.set(r.data || []));
      },
      error: (err) => this.toast.error(err.error?.message || 'Delete failed'),
    });
  }
}
