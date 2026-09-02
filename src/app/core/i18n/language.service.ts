import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, afterNextRender, inject, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { SeoService } from './seo.service';

export const SUPPORTED_LANGS = ['es', 'en'] as const;
export type AppLang = (typeof SUPPORTED_LANGS)[number];
const STORAGE_KEY = 'lang';
const FALLBACK_LANG: AppLang = 'en';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly translate = inject(TranslateService);
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _initialized = signal(false);

  constructor() {
    // Keep html lang and SEO in sync on every language change
    this.translate.onLangChange.subscribe((e) => {
      const lang = this.normalize(e.lang);
      this.persist(lang);
      this.setHtmlLang(lang);
      this.seo.update(lang);
    });

    // Sync language when user navigates via URL (/es, /en)
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const urlLang = this.getLangFromPath(e.urlAfterRedirects);
        if (urlLang && urlLang !== this.translate.getCurrentLang()) {
          this.setLang(urlLang, false);
        } else if (urlLang) {
          // Keep canonical/hreflang in sync when navigating to same lang
          // (e.g., after redirect from '/' -> '/es' where lang already matches)
          this.seo.update(urlLang);
        }
      });
  }

  get currentLang(): AppLang {
    const current =
      this.translate.getCurrentLang() ?? this.translate.currentLang()?.toString() ?? null;
    return this.normalize(current);
  }

  get currentLangSignal() {
    return this.translate.currentLang;
  }

  isSupported(lang: string | null | undefined): lang is AppLang {
    return !!lang && (SUPPORTED_LANGS as readonly string[]).includes(lang);
  }

  normalize(lang: string | null | undefined): AppLang {
    if (this.isSupported(lang)) return lang;
    return FALLBACK_LANG;
  }

  getStoredLang(): AppLang | null {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return null;
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return this.isSupported(raw) ? raw : null;
    } catch {
      return null;
    }
  }

  getBrowserLang(): AppLang | null {
    try {
      if (typeof navigator === 'undefined') return null;
      const nav = navigator as unknown as { language?: string; browserLanguage?: string };
      const raw = nav.language || nav.browserLanguage || null;
      if (!raw) return null;
      const short = raw.slice(0, 2).toLowerCase();
      return this.isSupported(short) ? short : null;
    } catch {
      return null;
    }
  }

  getLangFromPath(path: string): AppLang | null {
    try {
      const clean = path.split('?')[0].split('#')[0];
      if (clean === '/es' || clean.startsWith('/es/')) return 'es';
      if (clean === '/en' || clean.startsWith('/en/')) return 'en';
      return null;
    } catch {
      return null;
    }
  }

  detectInitialLang(): AppLang {
    // Priority: URL path > localStorage > browser > fallback
    try {
      if (typeof window !== 'undefined') {
        const pathLang = this.getLangFromPath(window.location.pathname);
        if (pathLang) return pathLang;
      }
    } catch {
      // ignore
    }
    if (isPlatformBrowser(this.platformId)) {
      const stored = this.getStoredLang();
      if (stored) return stored;
      const browser = this.getBrowserLang();
      if (browser) return browser;
    }
    return FALLBACK_LANG;
  }

  init(): Promise<void> {
    if (this._initialized()) return Promise.resolve();
    this._initialized.set(true);

    // Ensure langs are registered
    try {
      this.translate.addLangs([...SUPPORTED_LANGS]);
    } catch {
      // ignore
    }

    const initial = this.detectInitialLang();

    // Set fallback before use
    try {
      // setFallbackLang returns Observable, we don't need to await
      this.translate.setFallbackLang(FALLBACK_LANG).subscribe({
        error: () => {
          // ignore
        },
      });
    } catch {
      // ignore
    }

    return new Promise<void>((resolve) => {
      this.translate.use(initial).subscribe({
        next: () => {
          this.persist(initial);
          this.setHtmlLang(initial);
          this.seo.update(initial);
          this.redirectIfRoot(initial);
          resolve();
        },
        error: () => {
          this.persist(initial);
          this.setHtmlLang(initial);
          this.seo.update(initial);
          this.redirectIfRoot(initial);
          resolve();
        },
      });
    });
  }

  setLang(lang: string, navigate = true): void {
    const normalized = this.normalize(lang);
    const current = this.translate.getCurrentLang();
    if (current === normalized) {
      // Still ensure persistence and SEO
      this.persist(normalized);
      this.setHtmlLang(normalized);
      this.seo.update(normalized);
      if (navigate) this.navigateToLang(normalized);
      return;
    }

    this.translate.use(normalized).subscribe({
      next: () => {
        this.persist(normalized);
        this.setHtmlLang(normalized);
        this.seo.update(normalized);
        if (navigate) this.navigateToLang(normalized);
      },
      error: () => {
        this.persist(normalized);
        this.setHtmlLang(normalized);
        this.seo.update(normalized);
        if (navigate) this.navigateToLang(normalized);
      },
    });
  }

  toggle(): void {
    const next: AppLang = this.currentLang === 'es' ? 'en' : 'es';
    this.setLang(next, true);
  }

  private persist(lang: AppLang): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, lang);
      }
    } catch {
      // ignore
    }
  }

  private setHtmlLang(lang: AppLang): void {
    try {
      this.document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }

  private redirectIfRoot(lang: AppLang): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    try {
      const rawPath =
        typeof window !== 'undefined' && window.location?.pathname
          ? window.location.pathname.split('?')[0].split('#')[0]
          : this.router.url.split('?')[0].split('#')[0];
      if (rawPath === '/' || rawPath === '') {
        // Defer navigation until after APP_INITIALIZER and initial navigation complete
        // to avoid NavigationCancel / race with Router initialNavigation
        afterNextRender(() => {
          try {
            this.navigateToLang(lang);
          } catch {
            // ignore
          }
        });
      }
    } catch {
      // ignore
    }
  }

  private navigateToLang(lang: AppLang): void {
    try {
      const rawUrl =
        this.router.url ||
        (typeof window !== 'undefined'
          ? window.location.pathname + window.location.search + window.location.hash
          : '/');
      const currentPath = rawUrl.split('?')[0].split('#')[0];
      const queryAndHash = rawUrl.slice(currentPath.length);
      // If already on /es or /en, just replace; if on '/', navigate to /lang
      if (currentPath === '/' || currentPath === '') {
        this.router.navigate([`/${lang}`], {
          replaceUrl: true,
          queryParamsHandling: 'preserve',
          preserveFragment: true,
        });
        return;
      }
      if (currentPath.startsWith('/es') || currentPath.startsWith('/en')) {
        const rest = currentPath.replace(/^\/(es|en)/, '') || '';
        const target = `/${lang}${rest}` || `/${lang}`;
        if (target !== currentPath) {
          const fullTarget = `${target}${queryAndHash}`;
          this.router.navigateByUrl(fullTarget, { replaceUrl: true } as never);
        }
        return;
      }
      // For any other route (future), prefix with lang
      this.router.navigate([`/${lang}`], {
        replaceUrl: true,
        queryParamsHandling: 'preserve',
        preserveFragment: true,
      });
    } catch {
      // ignore
    }
  }
}
