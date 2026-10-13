import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  private router = inject(Router);

  private titles: Record<string, string> = {
    '/admin': 'Overview',
    '/admin/blogs': 'Blog Management',
    '/admin/comments': 'Comments',
    '/admin/users': 'Users',
    '/admin/taxonomy': 'Categories & Tags',
  };

  pageTitle = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => {
        const url = e.urlAfterRedirects.split('?')[0];
        if (url.includes('/blogs/new')) return 'Create Blog';
        if (url.includes('/blogs/edit')) return 'Edit Blog';
        return this.titles[url] || 'Admin';
      })
    ),
    { initialValue: 'Overview' }
  );

  navItems = [
    { path: '/admin', label: 'Overview', icon: '📊', exact: true },
    { path: '/admin/blogs', label: 'Blogs', icon: '📝' },
    { path: '/admin/comments', label: 'Comments', icon: '💬' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/taxonomy', label: 'Categories & Tags', icon: '🏷️' },
  ];
}
