import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

/**
 * Origen de producción. Se usa siempre (también en los canales de preview `pr-<n>`)
 * para que canonical, hreflang y og:url nunca apunten a un dominio temporal.
 */
export const SITE_ORIGIN = 'https://portafolio-71784.web.app';

const SUPPORTED = ['es', 'en'] as const;
type SeoLang = (typeof SUPPORTED)[number];

/** `/` sólo redirige a `/<lang>`: se trata como duplicado de la versión por defecto. */
const DEFAULT_LANG: SeoLang = 'en';

/** Imagen de preview al compartir el enlace, con el texto en el idioma de la URL. */
const OG_IMAGE: Record<SeoLang, string> = {
  es: `${SITE_ORIGIN}/images/og-image-es.png`,
  en: `${SITE_ORIGIN}/images/og-image.png`,
};

const FALLBACK_DESCRIPTION: Record<SeoLang, string> = {
  es: 'Portafolio de Didier Piracoca, desarrollador de aplicaciones multiplataforma especializado en Angular y desarrollo frontend. Experiencia con Java, Spring MVC, Ionic, SQL, Firebase y desarrollo full-stack.',
  en: 'Portfolio of Didier Piracoca, multiplatform application developer specialized in Angular and frontend development. Experience with Java, Spring MVC, Ionic, SQL, Firebase and full-stack development.',
};

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);

  update(lang: string): void {
    const normalized = this.normalize(lang);
    const url = `${SITE_ORIGIN}/${normalized}`;

    this.setHtmlLang(normalized);
    this.setTitleAndDescription(normalized);
    this.setHreflang();
    // Canonical siempre a la URL del idioma; `/` (que redirige) apunta a la versión por idioma.
    this.upsertLink('canonical', null, url);
    this.upsertMeta('property', 'og:url', url);
    this.setImage(normalized);
    this.upsertMeta('property', 'og:locale', normalized === 'es' ? 'es_ES' : 'en_US');
    this.upsertMeta('property', 'og:locale:alternate', normalized === 'es' ? 'en_US' : 'es_ES');
  }

  private normalize(lang: string): SeoLang {
    return (SUPPORTED as readonly string[]).includes(lang) ? (lang as SeoLang) : DEFAULT_LANG;
  }

  private setHtmlLang(lang: SeoLang): void {
    try {
      this.document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  }

  private setTitleAndDescription(lang: SeoLang): void {
    const title = this.translated('seo.title');
    const description = this.translated('seo.description') ?? FALLBACK_DESCRIPTION[lang];

    if (title) {
      this.title.setTitle(title);
      this.upsertMeta('property', 'og:title', title);
      this.upsertMeta('name', 'twitter:title', title);
    }
    this.upsertMeta('name', 'description', description);
    this.upsertMeta('property', 'og:description', description);
    this.upsertMeta('name', 'twitter:description', description);
  }

  private setImage(lang: SeoLang): void {
    const image = OG_IMAGE[lang];
    this.upsertMeta('property', 'og:image', image);
    this.upsertMeta('property', 'og:image:secure_url', image);
    this.upsertMeta('name', 'twitter:image', image);
    const alt = this.translated('seo.imageAlt');
    if (alt) {
      this.upsertMeta('property', 'og:image:alt', alt);
      this.upsertMeta('name', 'twitter:image:alt', alt);
    }
  }

  private translated(key: string): string | null {
    const value = this.translate.instant(key);
    return typeof value === 'string' && value !== key ? value : null;
  }

  private setHreflang(): void {
    for (const lang of SUPPORTED) {
      this.upsertLink('alternate', lang, `${SITE_ORIGIN}/${lang}`);
    }
    this.upsertLink('alternate', 'x-default', `${SITE_ORIGIN}/${DEFAULT_LANG}`);
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
    } catch {
      // ignore
    }
  }
}
