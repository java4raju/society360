import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';
const KEY = 'society360_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.read());

  constructor() {
    effect(() => {
      const t = this.theme();
      document.body.classList.toggle('dark-theme', t === 'dark');
      document.body.classList.toggle('light-theme', t === 'light');
      localStorage.setItem(KEY, t);
    });
  }

  private read(): Theme {
    const stored = localStorage.getItem(KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  toggle(): void {
    this.theme.update(t => (t === 'dark' ? 'light' : 'dark'));
  }

  set(t: Theme): void {
    this.theme.set(t);
  }
}
