import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent {
  auth = inject(AuthService);
  theme = inject(ThemeService);
  menuOpen = signal(false);
  year = new Date().getFullYear();

  socials = [
    { label: 'Twitter', href: '#', icon: '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
    { label: 'GitHub', href: '#', icon: '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-3.795-.735-.525-1.335-1.305-1.695-1.305-1.695-1.065-.735.075-.72.075-.72 1.185.09 1.815 1.215 1.815 1.215 1.05 1.805 2.76 1.29 3.435.99.105-.765.405-1.29.735-1.59-2.55-.285-5.235-1.275-5.235-5.655 0-1.245.45-2.265 1.185-3.06-.12-.285-.525-1.425.12-2.955 0 0 .975-.3 3.195 1.17.93-.255 1.92-.39 2.91-.39.99 0 1.98.135 2.91.39 2.22-1.47 3.195-1.17 3.195-1.17.645 1.53.24 2.67.12 2.955.735.795 1.185 1.815 1.185 3.06 0 4.395-2.7 5.37-5.25 5.655.42.36.81 1.08.81 2.19 0 1.59-.015 2.865-.015 3.255 0 .315.225.69.84.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>' },
    { label: 'LinkedIn', href: '#', icon: '<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>' },
  ];

  toggleMenu() {
    this.menuOpen.update((v) => !v);
  }
}
