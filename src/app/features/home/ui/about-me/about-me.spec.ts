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
        year: '2023',
        short: 'Angular Developer',
        company: 'AXPE Consulting',
        role: 'Angular Developer',
        selectLabel: 'Show work experience details',
        items: [
          'Development of web applications using Spring MVC and Ionic',
          'Oracle SQL integration (optimized queries & data modeling)',
          'Maintenance, bug fixing and production support',
          'Full-stack feature delivery (frontend + backend)',
        ],
      },
      education: {
        period: '2021 - 2023',
        year: '2021',
        short: 'FP DAW',
        title: 'Multiplatform Application Development Degree',
        selectLabel: 'Show education details',
        items: [
          'Software engineering fundamentals',
          'Database design and SQL',
          'UI development and interfaces',
        ],
      },
    },
    timeline: {
      label: '// experience',
      phaseStudy: 'studying',
      yearEducation: '2021',
      yearAxpe: '2023',
      yearFuture: '20 ??',
      shortEducation: 'FP DAW',
      futureText: 'You can be here next! :D',
      selectEducation: 'Show education details',
      selectAxpe: 'Show work experience details',
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
        year: '2023',
        short: 'Desarrollador Angular',
        company: 'AXPE Consulting',
        role: 'Desarrollador Angular',
        selectLabel: 'Ver detalle de experiencia laboral',
        items: [
          'Desarrollo de aplicaciones web usando Spring MVC e Ionic',
          'Integración con Oracle SQL (consultas optimizadas y modelado de datos)',
          'Mantenimiento, corrección de errores y soporte en producción',
          'Entrega de funcionalidades full-stack (frontend + backend)',
        ],
      },
      education: {
        period: '2021 - 2023',
        year: '2021',
        short: 'FP DAW',
        title: 'Grado Superior en Desarrollo de Aplicaciones Multiplataforma',
        selectLabel: 'Ver detalle de estudios',
        items: [
          'Fundamentos de ingeniería de software',
          'Diseño de bases de datos y SQL',
          'Desarrollo de interfaces de usuario',
        ],
      },
    },
    timeline: {
      label: '// experience',
      phaseStudy: 'estudiando',
      yearEducation: '2021',
      yearAxpe: '2023',
      yearFuture: '20 ??',
      shortEducation: 'FP DAW',
      futureText: '¡Puedes estar aquí next! :D',
      selectEducation: 'Ver detalle de estudios',
      selectAxpe: 'Ver detalle de experiencia laboral',
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

  it('should create with two stable about-me entries in chronological order', () => {
    const fixture = TestBed.createComponent(AboutMe);
    expect(fixture.componentInstance.entries.map((entry) => entry.id)).toEqual([
      'education',
      'axpe',
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

  it('should default to axpe and switch selection', () => {
    const fixture = TestBed.createComponent(AboutMe);
    expect(fixture.componentInstance.selectedId()).toBe('axpe');
    expect(fixture.componentInstance.selectedEntry().id).toBe('axpe');
    fixture.componentInstance.select('education');
    expect(fixture.componentInstance.selectedId()).toBe('education');
    expect(fixture.componentInstance.selectedEntry().id).toBe('education');
  });

  it('should render roadmap with 2 buttons plus future teaser and sublabel', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const roadmap = el.querySelector('.about-me__roadmap') as HTMLElement;
    expect(el.querySelector('.about-me__exp-label')?.textContent?.trim()).toBe('// experience');
    expect(roadmap).toBeTruthy();
    expect(el.querySelector('.about-me__track')).toBeTruthy();
    expect(el.querySelector('.about-me__seg--dashed')).toBeTruthy();
    expect(el.querySelector('.about-me__seg--solid')).toBeTruthy();
    expect(el.querySelector('.about-me__phase')?.textContent?.trim()).toBe('studying');
    expect(roadmap.querySelectorAll('.about-me__node').length).toBe(3);
    expect(roadmap.querySelectorAll('button.about-me__node').length).toBe(2);
    expect(el.querySelector('.about-me__future')).toBeTruthy();
    expect(el.textContent).toContain('2021');
    expect(el.textContent).toContain('2023');
    expect(el.textContent).toContain('20 ??');
    expect(el.textContent).toContain('FP DAW');
    expect(el.textContent).toContain('Angular Developer');
    expect(el.textContent).toContain('AXPE Consulting');
    expect(el.textContent).toContain('You can be here next! :D');
  });

  it('should include a mobile-only studying caption between both dates', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const mobile = el.querySelector('.about-me__timeline-mobile') as HTMLElement;
    expect(mobile).toBeTruthy();
    const caption = mobile.querySelector('.about-me__phase-mobile');
    expect(caption?.textContent?.trim()).toBe('studying');
    if (caption === null) {
      expect(caption).toBeTruthy();
      return;
    }
    const buttons = Array.from(mobile.querySelectorAll('button.about-me__node'));
    expect(buttons.length).toBe(2);
    const [educationButton, axpeButton] = buttons;
    expect(
      caption.compareDocumentPosition(educationButton as Element) &
        Node.DOCUMENT_POSITION_PRECEDING,
    ).toBeTruthy();
    expect(
      caption.compareDocumentPosition(axpeButton as Element) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('should show axpe detail by default with 4 items in stack carousel', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const detail = fixture.nativeElement.querySelector('#about-detail') as HTMLElement;
    expect(detail).toBeTruthy();
    expect(detail.classList.contains('about-me__stack')).toBe(true);
    const cards = Array.from(detail.querySelectorAll('app-about-entry-card'));
    expect(cards.length).toBe(2);
    const active = detail.querySelector(
      'app-about-entry-card.about-me-card--active',
    ) as HTMLElement;
    expect(active).toBeTruthy();
    expect(active.querySelector('.about-me__period')?.textContent?.trim()).toBe('2023-present');
    expect(active.querySelector('.about-me__company')?.textContent?.trim()).toBe(
      'AXPE Consulting',
    );
    expect(active.querySelector('.about-me__role')?.textContent?.trim()).toBe('Angular Developer');
    expect(active.querySelectorAll('ul.about-me__items li').length).toBe(4);
    const roadmapButtons = Array.from(
      fixture.nativeElement.querySelectorAll('.about-me__roadmap button.about-me__node'),
    ) as HTMLButtonElement[];
    expect(roadmapButtons[1].classList.contains('about-me__node--active')).toBe(true);
    expect(roadmapButtons[0].classList.contains('about-me__node--active')).toBe(false);
  });

  it('should switch detail to education with 3 items on click', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('.about-me__roadmap button.about-me__node'),
    ) as HTMLButtonElement[];
    expect(buttons.length).toBe(2);
    buttons[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    const detail = fixture.nativeElement.querySelector('#about-detail') as HTMLElement;
    const active = detail.querySelector(
      'app-about-entry-card.about-me-card--active',
    ) as HTMLElement;
    expect(active.querySelector('.about-me__period')?.textContent?.trim()).toBe('2021 - 2023');
    expect(active.textContent).toContain('Multiplatform Application Development Degree');
    expect(active.querySelectorAll('ul.about-me__items li').length).toBe(3);
    expect(buttons[0].getAttribute('aria-expanded')).toBe('true');
    expect(buttons[1].getAttribute('aria-expanded')).toBe('false');
    expect(buttons[0].getAttribute('aria-controls')).toBe('about-detail');
    expect(buttons[0].classList.contains('about-me__node--active')).toBe(true);
    expect(buttons[1].classList.contains('about-me__node--active')).toBe(false);
  });

  it('should show both descriptions inline in mobile timeline after each title', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const mobile = fixture.nativeElement.querySelector(
      '.about-me__timeline-mobile',
    ) as HTMLElement;
    const inlineCards = Array.from(mobile.querySelectorAll('app-about-entry-card'));
    expect(inlineCards.length).toBe(2);
    expect(mobile.textContent).toContain('Multiplatform Application Development Degree');
    expect(mobile.textContent).toContain('AXPE Consulting');
    const nodes = Array.from(mobile.children);
    const firstButtonIndex = nodes.findIndex((n) => n.tagName === 'BUTTON');
    const firstCardIndex = nodes.findIndex((n) =>
      n.tagName.toLowerCase().includes('app-about-entry-card'),
    );
    expect(firstButtonIndex).toBeGreaterThanOrEqual(0);
    expect(firstCardIndex).toBeGreaterThan(firstButtonIndex);
  });

  it('should keep DOM order title period list in detail panel', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const active = fixture.nativeElement.querySelector(
      '#about-detail app-about-entry-card.about-me-card--active',
    ) as HTMLElement;
    const order = Array.from(active.querySelectorAll('h3, .about-me__period, ul')).map(
      (el) => (el as HTMLElement).className,
    );
    expect(order[0]).toContain('about-me__detail-title');
    expect(order[1]).toContain('about-me__period');
    expect(order[2]).toContain('about-me__items');
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
    expect(
      fixture.nativeElement.querySelector('.about-me__short--strong')?.textContent?.trim(),
    ).toBe('Desarrollador Angular');
    expect(fixture.nativeElement.querySelector('#about-detail')?.textContent).toContain(
      'Desarrollador Angular',
    );
    fixture.componentInstance.select('education');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain(
      'Grado Superior en Desarrollo de Aplicaciones Multiplataforma',
    );
  });

  it('should translate roadmap phase and future teaser to Spanish', async () => {
    const fixture = TestBed.createComponent(AboutMe);
    fixture.detectChanges();
    await fixture.whenStable();
    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.about-me__phase')?.textContent?.trim()).toBe(
      'estudiando',
    );
    expect(fixture.nativeElement.textContent).toContain('¡Puedes estar aquí next! :D');
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
    expect(el.querySelector('.about-me__exp-label')).toBeTruthy();
    expect(el.querySelector('.about-me__roadmap')).toBeTruthy();
    expect(el.querySelector('.about-me__track')).toBeTruthy();
    expect(el.querySelector('.about-me__node')).toBeTruthy();
    expect(el.querySelector('.about-me__detail')).toBeTruthy();
    expect(el.querySelector('.about-me__period')).toBeTruthy();
    expect(el.querySelector('.about-me__items')).toBeTruthy();
    expect(el.querySelector('.about-me__timeline-mobile')).toBeTruthy();
    expect(el.querySelector('.about-me__stack')).toBeTruthy();
    expect(el.querySelector('app-about-entry-card')).toBeTruthy();
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
