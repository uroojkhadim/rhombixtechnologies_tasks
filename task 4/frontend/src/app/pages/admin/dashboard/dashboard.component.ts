import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { DashboardStats } from '../../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private userService = inject(UserService);
  stats = signal<DashboardStats | null>(null);

  cards = [
    { key: 'totalBlogs', label: 'Total Blogs', icon: '📝', link: '/admin/blogs', bg: 'bg-blue-50 dark:bg-blue-500/10' },
    { key: 'totalUsers', label: 'Total Users', icon: '👥', link: '/admin/users', bg: 'bg-violet-50 dark:bg-violet-500/10' },
    { key: 'totalComments', label: 'Total Comments', icon: '💬', link: '/admin/comments', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { key: 'pendingComments', label: 'Pending Review', icon: '⏳', link: '/admin/comments', bg: 'bg-amber-50 dark:bg-amber-500/10' },
  ];

  chartBars = [
    { label: 'Jan', height: 40 },
    { label: 'Feb', height: 55 },
    { label: 'Mar', height: 45 },
    { label: 'Apr', height: 70 },
    { label: 'May', height: 60 },
    { label: 'Jun', height: 85 },
  ];

  approvedPercent = computed(() => {
    const s = this.stats();
    if (!s || s.totalComments === 0) return 100;
    const approved = s.totalComments - s.pendingComments;
    return Math.round((approved / s.totalComments) * 100);
  });

  ngOnInit() {
    this.userService.getStats().subscribe((r) => this.stats.set(r.data || null));
  }

  value(key: string): number {
    const s = this.stats();
    return s ? (s as unknown as Record<string, number>)[key] ?? 0 : 0;
  }
}
