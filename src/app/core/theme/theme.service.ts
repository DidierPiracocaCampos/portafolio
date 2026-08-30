import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export const THEMES = ['gold', 'goldlight'] as const;
export type AppTheme = (typeof THEMES)[number];

const STORAGE_KEY = 'theme';
const DEFAULT_THEME: AppTheme = 'gold';

function isAppTheme(value: string | null): value is AppTheme {
  return value === 'gold' || value === 'goldlight';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _theme = signal<AppTheme>(DEFAULT_THEME);
  readonly currentTheme = computed<AppTheme>(() => this._theme());

  private _initialized = false;

  init(): void {
    if (this._initialized) return;
    this._initialized = true;
    const initial = this.resolveInitialTheme();
    this.apply(initial);
    this.persist(initial);
    this._theme.set(initial);
  }

  toggle(): void {
    const next: AppTheme = this._theme() === 'gold' ? 'goldlight' : 'gold';
    this.set(next);
  }

  set(theme: AppTheme): void {
    this._theme.set(theme);
    this.apply(theme);
    this.persist(theme);
  }

  private resolveInitialTheme(): AppTheme {
    const stored = this.getStoredTheme();
    if (stored) return stored;
    const system = this.getSystemPreference();
    if (system) return system;
    return DEFAULT_THEME;
  }

  private getStoredTheme(): AppTheme | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return isAppTheme(raw) ? raw : null;
    } catch {
      return null;
    }
  }

  private getSystemPreference(): AppTheme | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      if (typeof window.matchMedia !== 'function') return null;
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      return mql.matches ? 'gold' : 'goldlight';
    } catch {
      return null;
    }
  }

  private persist(theme: AppTheme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore (private mode, quota, etc.)
    }
  }

  private apply(theme: AppTheme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch {
      // ignore
    }
  }
}
