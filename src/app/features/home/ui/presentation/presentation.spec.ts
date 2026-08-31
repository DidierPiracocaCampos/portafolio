import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import Presentation from './presentation';

const enTranslations = {
  presentation: {
    prompt: ['> initializing portfolio ', '> loading projects ', '> system ready'],
    title: 'Angular Developer and Frontend Developer',
    subtitle: 'Multiplatform Application Developer',
    description:
      'Currently focused on Angular and modern frontend development. Experience with Java, Spring MVC and SQL systems.',
  },
};

async function setupTranslate(): Promise<void> {
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', enTranslations);
  translate.setTranslation('es', {
    presentation: {
      prompt: ['> inicializando portafolio ', '> cargando proyectos ', '> sistema listo'],
      title: 'Programador Angular y Desarrollador Frontend',
      subtitle: 'Desarrollador de Aplicaciones Multiplataforma',
      description:
        'Actualmente enfocado en Angular y desarrollo frontend moderno. Experiencia con sistemas Java, Spring MVC y SQL.',
    },
  });
  await firstValueFrom(translate.use('en'));
}

async function flushPortrait(httpTesting: HttpTestingController): Promise<void> {
  const req = httpTesting.expectOne((r) => r.url.includes('banner'));
  expect(req.request.responseType).toBe('text');
  req.flush('  X\n  Y\n');
  await Promise.resolve();
}

describe('Presentation', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Presentation],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en' }),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    await setupTranslate();
  });

  afterEach(() => {
    const httpTesting = TestBed.inject(HttpTestingController);
    const pending = httpTesting.match(() => true);
    for (const req of pending) {
      req.flush('');
    }
  });

  it('should create', async () => {
    const fixture = TestBed.createComponent(Presentation);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render h1 with Angular Developer role not DIDIER', async () => {
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    await fixture.whenStable();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('Angular Developer and Frontend Developer');
    expect(h1?.textContent?.trim()).not.toBe('DIDIER PIRACOCA');
  });

  it('should render single visual ASCII art with DIDIER and PIRACOCA blocks and accessible label', async () => {
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    await fixture.whenStable();
    const ascii = fixture.nativeElement.querySelector('.presentation__ascii');
    expect(ascii).toBeTruthy();
    expect(ascii.getAttribute('role')).toBe('img');
    expect(ascii.getAttribute('aria-label')).toBe('Didier Piracoca');
    const didier = fixture.nativeElement.querySelector('.presentation__ascii-didier');
    const piracoca = fixture.nativeElement.querySelector('.presentation__ascii-piracoca');
    expect(didier).toBeTruthy();
    expect(piracoca).toBeTruthy();
    expect(didier.textContent).toContain('██████╗');
    expect(piracoca.textContent).toContain('██████╗');
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1.textContent).not.toContain('DIDIER PIRACOCA');
  });

  it('should render prompt with 3 lines and aria-hidden without duplicated prefix', async () => {
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    await fixture.whenStable();
    const prompt = fixture.nativeElement.querySelector('.presentation__prompt');
    expect(prompt.getAttribute('aria-hidden')).toBe('true');
    const lines = prompt.textContent;
    expect(lines).toContain('> initializing portfolio ...');
    expect(lines).toContain('> loading projects ...');
    expect(lines).toContain('> system ready');
    expect(lines).not.toContain('> >');
  });

  it('should render subtitle and single description paragraph in correct DOM order with ascii after prompt', async () => {
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement;
    const order = Array.from(
      el.querySelectorAll(
        '.presentation__prompt, .presentation__ascii, h1, .presentation__subtitle, .presentation__description',
      ),
    ).map((n) => (n as Element).textContent?.trim());
    expect(order[0]).toContain('initializing');
    expect(order[1]).toContain('██████╗');
    expect(order[2]).toBe('Angular Developer and Frontend Developer');
    expect(order[3]).toBe('Multiplatform Application Developer');
    expect(order[4]).toBe(
      'Currently focused on Angular and modern frontend development. Experience with Java, Spring MVC and SQL systems.',
    );
  });

  it('should use section with aria-labelledby pointing to h1', async () => {
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    await fixture.whenStable();
    const section = fixture.nativeElement.querySelector('section');
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(section.getAttribute('aria-labelledby')).toBe(h1.id);
    expect(h1.id).toBe('presentation-title');
  });

  it('should apply BEM classes for styling hooks', async () => {
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement;
    expect(el.querySelector('.presentation')).toBeTruthy();
    expect(el.querySelector('.presentation__inner')).toBeTruthy();
    expect(el.querySelector('.presentation__prompt')).toBeTruthy();
    expect(el.querySelector('.presentation__title')).toBeTruthy();
    expect(el.querySelector('.presentation__subtitle')).toBeTruthy();
    expect(el.querySelector('.presentation__description')).toBeTruthy();
  });

  it('should keep description as semantic paragraph not aria-hidden', async () => {
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    await fixture.whenStable();
    const desc = fixture.nativeElement.querySelector('.presentation__description');
    expect(desc.getAttribute('aria-hidden')).toBeNull();
    expect(desc.tagName.toLowerCase()).toBe('p');
    expect(desc.textContent?.trim()).toBe(
      'Currently focused on Angular and modern frontend development. Experience with Java, Spring MVC and SQL systems.',
    );
  });

  it('should not have more than one h1', async () => {
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('h1').length).toBe(1);
  });

  it('should switch to Spanish when language changes', async () => {
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    await fixture.whenStable();
    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement;
    expect(el.querySelector('.presentation__subtitle')?.textContent?.trim()).toBe(
      'Desarrollador de Aplicaciones Multiplataforma',
    );
  });

  describe('ASCII portrait background', () => {
    it('should fetch banner and render portrait layer with aria-hidden', async () => {
      const fixture = TestBed.createComponent(Presentation);
      fixture.detectChanges();
      const httpTesting = TestBed.inject(HttpTestingController);
      await flushPortrait(httpTesting);
      fixture.detectChanges();
      await fixture.whenStable();

      const portrait = fixture.nativeElement.querySelector('.presentation__portrait');
      expect(portrait).toBeTruthy();
      expect(portrait.getAttribute('aria-hidden')).toBe('true');
      expect(portrait.classList.contains('presentation__portrait')).toBe(true);

      const text = fixture.nativeElement.querySelector('.presentation__portrait-text');
      expect(text).toBeTruthy();
      expect(text?.tagName.toLowerCase()).toBe('pre');
    });

    it('should hide portrait when banner request fails', async () => {
      const fixture = TestBed.createComponent(Presentation);
      fixture.detectChanges();
      const httpTesting = TestBed.inject(HttpTestingController);
      const req = httpTesting.expectOne((r) => r.url.includes('banner'));
      req.error(new ProgressEvent('error'));
      fixture.detectChanges();
      await fixture.whenStable();

      const portrait = fixture.nativeElement.querySelector('.presentation__portrait');
      expect(portrait).toBeNull();
    });

    it('should render portrait with full-resolution content and trim empty edges', async () => {
      const fixture = TestBed.createComponent(Presentation);
      fixture.detectChanges();
      const httpTesting = TestBed.inject(HttpTestingController);
      const req = httpTesting.expectOne((r) => r.url.includes('banner'));
      const lines = [
        '',
        '   '.padEnd(300, ' '),
        'X'.repeat(300),
        'Y'.repeat(300),
        'Z'.repeat(300),
        '   ',
        '',
      ];
      req.flush(lines.join('\n'));
      await Promise.resolve();
      fixture.detectChanges();
      await fixture.whenStable();

      const text = fixture.nativeElement.querySelector('.presentation__portrait-text');
      expect(text).toBeTruthy();
      const rendered = (text?.textContent ?? '').replace(/\s+$/, '');
      const rows = rendered.split('\n');
      expect(rows.length).toBe(3);
      expect(rows[0]?.length).toBe(300);
      expect(rows[0]).toBe('X'.repeat(300));
    });
  });
});