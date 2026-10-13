import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  darkMode = signal(localStorage.getItem('theme') === 'dark');

  constructor() {
    effect(() => {
      const dark = this.darkMode();
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    });
  }

  toggle() {
    this.darkMode.update((v) => !v);
  }
}
