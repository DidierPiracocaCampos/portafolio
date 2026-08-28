import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import Experience from './experience';

const enTranslations = {
  experience: {
    heading: 'EXPERIENCE',
    entries: {
      axpe: {
        period: '2023-present',
        company: 'AXPE Consulting',
        role: 'Angular Developer',
        items: [
          'Development of web applications using Spring MVC and Ionic',
          'Oracle SQL integration (optimized queries & data modeling)',
          'Maintenance, bug fixing and production support',
          'Full-stack feature delivery (frontend + backend)',
        ],
      },
      education: {
        period: '2021 - 2023',
        title: 'Multiplatform Application Development Degree',
        items: [
          'Software engineering fundamentals',
          'Database design and SQL',
          'UI development and interfaces',
        ],
      },
    },
  },
};

const esTranslations = {
  experience: {
    heading: 'EXPERIENCIA',
    entries: {
      axpe: {
        period: '2023-present',
        company: 'AXPE Consulting',
        role: 'Desarrollador Angular',
        items: [
          'Desarrollo de aplicaciones web usando Spring MVC e Ionic',
          'Integración con Oracle SQL (consultas optimizadas y modelado de datos)',
          'Mantenimiento, corrección de errores y soporte en producción',
          'Entrega de funcionalidades full-stack (frontend + backend)',
        ],
      },
      education: {
        period: '2021 - 2023',
        title: 'Grado Superior en Desarrollo de Aplicaciones Multiplataforma',
        items: [
          'Fundamentos de ingeniería de software',
          'Diseño de bases de datos y SQL',
          'Desarrollo de interfaces de usuario',
        ],
      },
    },
  },
};

async function setupTranslate(): Promise<void> {
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', enTranslations);
  translate.setTranslation('es', esTranslations);
  await firstValueFrom(translate.use('en'));
}

describe('Experience', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Experience],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();
    await setupTranslate();
  });

  it('should create with two stable experience entries', () => {
    const fixture = TestBed.createComponent(Experience);
    expect(fixture.componentInstance.entries.map((entry) => entry.id)).toEqual([
      'axpe',
      'education',
    ]);
  });

  it('should use section with aria-labelledby pointing to h2', async () => {
    const fixture = TestBed.createComponent(Experience);
    fixture.detectChanges();
    await fixture.whenStable();
    const section = fixture.nativeElement.querySelector('section');
    const heading = fixture.nativeElement.querySelector('h2');
    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.id).toBe('experience-title');
    expect(heading.textContent.trim()).toBe('EXPERIENCE');
  });

  it('should render two articles with correct periods titles and lists', async () => {
    const fixture = TestBed.createComponent(Experience);
    fixture.detectChanges();
    await fixture.whenStable();
    const articles = fixture.nativeElement.querySelectorAll('article');
    expect(articles.length).toBe(2);

    const first = articles[0] as HTMLElement;
    expect(first.querySelector('.experience__period')?.textContent?.trim()).toBe('2023-present');
    expect(first.querySelector('.experience__company')?.textContent?.trim()).toBe(
      'AXPE Consulting',
    );
    expect(first.querySelector('.experience__role')?.textContent?.trim()).toBe('Angular Developer');
    expect(first.querySelectorAll('ul.experience__items li').length).toBe(4);

    const second = articles[1] as HTMLElement;
    expect(second.querySelector('.experience__period')?.textContent?.trim()).toBe('2021 - 2023');
    expect(second.querySelector('.experience__title')?.textContent?.trim()).toBe(
      'Multiplatform Application Development Degree',
    );
    expect(second.querySelectorAll('ul.experience__items li').length).toBe(3);
  });

  it('should render lists with square markers and expected copy', async () => {
    const fixture = TestBed.createComponent(Experience);
    fixture.detectChanges();
    await fixture.whenStable();
    const items = Array.from(fixture.nativeElement.querySelectorAll('.experience__items li')).map(
      (el) => (el as HTMLElement).textContent?.trim(),
    );
    expect(items).toEqual([
      'Development of web applications using Spring MVC and Ionic',
      'Oracle SQL integration (optimized queries & data modeling)',
      'Maintenance, bug fixing and production support',
      'Full-stack feature delivery (frontend + backend)',
      'Software engineering fundamentals',
      'Database design and SQL',
      'UI development and interfaces',
    ]);
  });

  it('should keep DOM order period title list for each entry', async () => {
    const fixture = TestBed.createComponent(Experience);
    fixture.detectChanges();
    await fixture.whenStable();
    const articles = fixture.nativeElement.querySelectorAll('article');
    articles.forEach((article: Element) => {
      const order = Array.from(article.querySelectorAll('.experience__period, h3, ul')).map(
        (el) => el.className,
      );
      expect(order[0]).toContain('experience__period');
      expect(order[1]).toContain('experience__title');
      expect(order[2]).toContain('experience__items');
    });
  });

  it('should switch heading and role to Spanish', async () => {
    const fixture = TestBed.createComponent(Experience);
    fixture.detectChanges();
    await fixture.whenStable();
    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe('EXPERIENCIA');
    expect(fixture.nativeElement.querySelector('.experience__role')?.textContent?.trim()).toBe(
      'Desarrollador Angular',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'Grado Superior en Desarrollo de Aplicaciones Multiplataforma',
    );
  });

  it('should expose BEM classes for visual timeline', async () => {
    const fixture = TestBed.createComponent(Experience);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement;
    expect(el.querySelector('.experience')).toBeTruthy();
    expect(el.querySelector('.experience__inner')).toBeTruthy();
    expect(el.querySelector('.experience__heading')).toBeTruthy();
    expect(el.querySelector('.experience__timeline')).toBeTruthy();
    expect(el.querySelector('.experience__entry')).toBeTruthy();
    expect(el.querySelector('.experience__period')).toBeTruthy();
    expect(el.querySelector('.experience__items')).toBeTruthy();
  });
});
