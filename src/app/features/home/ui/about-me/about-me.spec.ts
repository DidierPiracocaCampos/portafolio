import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import AboutMe from './about-me';

const enTranslations = {
  aboutMe: {
    heading: 'ABOUT ME',
    intro: {
      prompt: '$ whoami',
      photoAlt: 'Portrait of Didier Piracoca',
      photoCaption: '~/didier',
      meta: 'frontend • angular • full-stack',
      p1Start: "I'm Didier — a ",
      p1Hl1: 'developer',
      p1Mid: ', focused on building software that is ',
      p1Hl2: 'designed to evolve',
      p1End:
        '. I enjoy tackling complex problems, working from the ground up, and turning ideas into well-structured applications.',
      p2Start: 'With a strong focus on ',
      p2Hl1: 'frontend development',
      p2Mid1: ' and a broader understanding of ',
      p2Hl2: 'backend and software architecture',
      p2Mid2: ', I care about building things that are not only functional, but ',
      p2Hl3: 'maintainable',
      p2Mid3: ', ',
      p2Hl4: 'scalable',
      p2End: ', and ready for what comes next.',
    },
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
  aboutMe: {
    heading: 'SOBRE MÍ',
    intro: {
      prompt: '$ whoami',
      photoAlt: 'Retrato de Didier Piracoca',
      photoCaption: '~/didier',
      meta: 'frontend • angular • full-stack',
      p1Start: 'Soy Didier — ',
      p1Hl1: 'desarrollador',
      p1Mid: ', enfocado en construir software ',
      p1Hl2: 'diseñado para evolucionar',
      p1End:
        '. Disfruto resolver problemas complejos, trabajar desde cero y convertir ideas en aplicaciones bien estructuradas.',
      p2Start: 'Con un fuerte enfoque en ',
      p2Hl1: 'desarrollo frontend',
      p2Mid1: ' y una visión amplia de ',
      p2Hl2: 'backend y arquitectura de software',
      p2Mid2: ', me importa construir cosas que no solo funcionen, sino que sean ',
      p2Hl3: 'mantenibles',
      p2Mid3: ', ',
      p2Hl4: 'escalables',
      p2End: ' y listas para lo que venga.',
    },
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

describe('AboutMe', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutMe],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();
    await setupTranslate();
  });

  it('should create with two stable about-me entries', () => {
    const fixture = TestBed.createComponent(AboutMe);
    expect(fixture.componentInstance.entries.map((entry) => entry.id)).toEqual([
      'axpe',
      'education',
    ]);
  });

  it('should use section with aria-labelledby pointing to h2', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const section = fixture.nativeElement.querySelector('section');
    const heading = fixture.nativeElement.querySelector('h2');
    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.id).toBe('about-me-title');
    expect(heading.textContent.trim()).toBe('ABOUT ME');
  });

  it('should render two articles with correct periods titles and lists', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const articles = fixture.nativeElement.querySelectorAll('article');
    expect(articles.length).toBe(2);

    const first = articles[0] as HTMLElement;
    expect(first.querySelector('.about-me__period')?.textContent?.trim()).toBe('2023-present');
    expect(first.querySelector('.about-me__company')?.textContent?.trim()).toBe(
      'AXPE Consulting',
    );
    expect(first.querySelector('.about-me__role')?.textContent?.trim()).toBe('Angular Developer');
    expect(first.querySelectorAll('ul.about-me__items li').length).toBe(4);

    const second = articles[1] as HTMLElement;
    expect(second.querySelector('.about-me__period')?.textContent?.trim()).toBe('2021 - 2023');
    expect(second.querySelector('.about-me__title')?.textContent?.trim()).toBe(
      'Multiplatform Application Development Degree',
    );
    expect(second.querySelectorAll('ul.about-me__items li').length).toBe(3);
  });

  it('should render lists with square markers and expected copy', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const items = Array.from(fixture.nativeElement.querySelectorAll('.about-me__items li')).map(
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
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const articles = fixture.nativeElement.querySelectorAll('article');
    articles.forEach((article: Element) => {
      const order = Array.from(article.querySelectorAll('.about-me__period, h3, ul')).map(
        (el) => el.className,
      );
      expect(order[0]).toContain('about-me__period');
      expect(order[1]).toContain('about-me__title');
      expect(order[2]).toContain('about-me__items');
    });
  });

  it('should switch heading and role to Spanish', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe('SOBRE MÍ');
    expect(fixture.nativeElement.querySelector('.about-me__role')?.textContent?.trim()).toBe(
      'Desarrollador Angular',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'Grado Superior en Desarrollo de Aplicaciones Multiplataforma',
    );
  });

  it('should expose BEM classes for visual timeline', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement;
    expect(el.querySelector('.about-me')).toBeTruthy();
    expect(el.querySelector('.about-me__inner')).toBeTruthy();
    expect(el.querySelector('app-section-title')).toBeTruthy();
    expect(el.querySelector('.section-title')).toBeTruthy();
    expect(el.querySelector('.section-title__rule')).toBeTruthy();
    expect(el.querySelector('.section-title__heading')).toBeTruthy();
    expect(el.querySelector('.about-me__timeline')).toBeTruthy();
    expect(el.querySelector('.about-me__entry')).toBeTruthy();
    expect(el.querySelector('.about-me__period')).toBeTruthy();
    expect(el.querySelector('.about-me__items')).toBeTruthy();
  });

  it('should render intro hero before timeline with copy (no whoami prompt)', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const intro = el.querySelector('.about-me__intro');
    expect(intro).toBeTruthy();
    expect(el.querySelector('.about-me__prompt')).toBeNull();
    expect(el.textContent).not.toContain('$ whoami');
    expect(el.querySelector('.about-me__grid')).toBeTruthy();
    expect(el.querySelector('.about-me__copy')).toBeTruthy();
    expect(el.textContent).toContain("I'm Didier");
    expect(el.textContent).toContain('designed to evolve');
    expect(el.textContent).toContain('frontend development');
    const introEl = el.querySelector('.about-me__intro') as HTMLElement;
    const innerEl = el.querySelector('.about-me__inner') as HTMLElement;
    expect(introEl.compareDocumentPosition(innerEl) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('should highlight keywords with terminal tones', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const highlights = Array.from(
      fixture.nativeElement.querySelectorAll('.about-me__hl'),
    ).map((node) => (node as HTMLElement).textContent?.trim());
    expect(highlights).toEqual([
      'developer',
      'designed to evolve',
      'frontend development',
      'backend and software architecture',
      'maintainable',
      'scalable',
    ]);
    const highlighted = Array.from(
      fixture.nativeElement.querySelectorAll('.about-me__hl'),
    ) as HTMLElement[];
    expect(highlighted.length).toBe(6);
    highlighted.forEach((node) => {
      expect(node.classList.contains('about-me__hl--warning')).toBe(true);
    });
    expect(fixture.nativeElement.querySelector('.about-me__hl--primary')).toBeNull();
    expect(fixture.nativeElement.querySelector('.about-me__hl--accent')).toBeNull();
    expect(fixture.nativeElement.querySelector('.about-me__hl--success')).toBeNull();
  });

  it('should render rectangular photo with alt and caption and no meta line', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const img = fixture.nativeElement.querySelector(
      '.about-me__photo img',
    ) as HTMLImageElement | null;
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('/images/about-me/photo-me.jpg');
    expect(img?.getAttribute('alt')).toBe('Portrait of Didier Piracoca');
    expect(img?.getAttribute('loading')).toBe('lazy');
    expect(
      fixture.nativeElement
        .querySelector('.about-me__photo-caption')
        ?.textContent?.trim(),
    ).toBe('~/didier');
    expect(fixture.nativeElement.querySelector('.about-me__meta')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('~/didier $');
  });

  it('should frame photo as clean rectangle without window dots and no stack badges', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.about-me__photo .mockup-window')).toBeNull();
    expect(el.querySelector('.about-me__photo .about-me__frame img')).toBeTruthy();
    expect(el.querySelector('.about-me__photo .status-success')).toBeTruthy();
    expect(el.querySelector('.about-me__tags')).toBeNull();
    expect(el.querySelector('.about-me__photo')?.textContent?.toLowerCase()).not.toContain(
      'full-stack',
    );
  });

  it('should switch intro copy and photo alt to Spanish', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Soy Didier');
    expect(fixture.nativeElement.textContent).toContain('diseñado para evolucionar');
    expect(
      fixture.nativeElement.querySelector('.about-me__photo img')?.getAttribute('alt'),
    ).toBe('Retrato de Didier Piracoca');
  });
});
