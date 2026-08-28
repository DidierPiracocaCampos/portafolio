import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  private readonly supported = ['es', 'en'] as const;
  private readonly origin = this.resolveOrigin();

  update(lang: string): void {
    const normalized = this.normalize(lang);
    this.setHtmlLang(normalized);
    this.setTitleAndDescription(normalized);
    this.setHreflang(normalized);
    this.setCanonical(normalized);
    this.setOgLocale(normalized);
  }

  private normalize(lang: string): string {
    return this.supported.includes(lang as never) ? lang : 'en';
  }

  private resolveOrigin(): string {
    try {
      if (typeof window !== 'undefined' && window.location?.origin) {
        return window.location.origin;
      }
    } catch {
      // ignore
    }
    return 'https://portafolio-71784.web.app';
  }

  private setHtmlLang(lang: string): void {
    try {
      this.document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }

  private setTitleAndDescription(lang: string): void {
    const titleKey = 'seo.title';
    const descKey = 'seo.description';

    // Use instant if translations already loaded, otherwise fallback will be overwritten on next lang change
    const title = this.translate.instant(titleKey);
    const description = this.translate.instant(descKey);

    const hasTitle = typeof title === 'string' && title !== titleKey;
    const hasDescription = typeof description === 'string' && description !== descKey;

    if (hasTitle) {
      this.title.setTitle(title);
    }
    if (hasDescription) {
      this.upsertMeta('name', 'description', description);
      this.upsertMeta('property', 'og:description', description);
    }
    if (hasTitle) {
      this.upsertMeta('property', 'og:title', title);
    }
    this.upsertMeta('property', 'og:locale', lang === 'es' ? 'es_ES' : 'en_US');
    // Ensure description meta exists even before translations load (fallback)
    if (!hasDescription) {
      const fallbackDesc =
        lang === 'es'
          ? 'Programador Angular y desarrollador frontend especializado en Angular, desarrollo web moderno, Java, Spring MVC, SQL y Firebase. Portafolio de Didier Piracoca.'
          : 'Angular and frontend developer specialized in Angular, modern web development, Java, Spring MVC, SQL and Firebase. Portfolio by Didier Piracoca.';
      this.upsertMeta('name', 'description', fallbackDesc);
    }
  }

  private setHreflang(_currentLang: string): void {
    const origin = this.origin;
    const links: Array<{ hreflang: string; href: string }> = [
      { hreflang: 'es', href: `${origin}/es` },
      { hreflang: 'en', href: `${origin}/en` },
      { hreflang: 'x-default', href: `${origin}/` },
    ];

    for (const { hreflang, href } of links) {
      this.upsertLink('alternate', hreflang, href);
    }
  }

  private setCanonical(lang: string): void {
    const origin = this.origin;
    // For SEO best-practice: canonical points to language-specific URL
    // x-default (/) is kept as alternate, but canonical is per-language
    const href = lang === 'x-default' ? `${origin}/` : `${origin}/${lang}`;
    // If current path is '/', keep canonical as '/', otherwise use language URL
    let canonicalHref = href;
    try {
      const path = typeof window !== 'undefined' ? window.location.pathname : '/';
      if (path === '/' || path === '') {
        canonicalHref = `${origin}/`;
      } else if (path.startsWith('/es') || path.startsWith('/en')) {
        canonicalHref = `${origin}/${lang}`;
      }
    } catch {
      // ignore
    }
    this.upsertLink('canonical', null, canonicalHref);
  }

  private setOgLocale(lang: string): void {
    this.upsertMeta('property', 'og:locale', lang === 'es' ? 'es_ES' : 'en_US');
    // Alternate locales
    const alternate = lang === 'es' ? 'en_US' : 'es_ES';
    this.upsertMeta('property', 'og:locale:alternate', alternate);
  }

  private upsertMeta(attrName: 'name' | 'property', attrValue: string, content: string): void {
    try {
      const selector = `meta[${attrName}="${attrValue}"]`;
      let el = this.document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = this.document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        this.document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    } catch {
      // ignore
    }
  }

  private upsertLink(rel: string, hreflang: string | null, href: string): void {
    try {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      let el = this.document.head.querySelector(selector) as HTMLLinkElement | null;
      if (!el) {
        el = this.document.createElement('link');
        el.setAttribute('rel', rel);
        if (hreflang) el.setAttribute('hreflang', hreflang);
        this.document.head.appendChild(el);
      }
      el.setAttribute('href', href);
      if (hreflang && !el.getAttribute('hreflang')) {
        el.setAttribute('hreflang', hreflang);
      }
    } catch {
      // ignore
    }
  }
}
