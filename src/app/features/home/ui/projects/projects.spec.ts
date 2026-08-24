import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import Projects from './projects';

const enTranslations = {
  projects: {
    heading: 'PROJECTS',
    labels: {
      status: 'STATUS',
      tech: 'TECH',
      link: 'LINK',
    },
    status: {
      completed: 'completed',
    },
    actions: {
      github: 'View code on GitHub',
      figma: 'View design on Figma',
      projectLinks: 'Links for',
    },
    items: {
      devhelper: {
        description: 'Desktop application for application development.',
        imageAlt: 'DevHelper preview',
      },
      spot: {
        description: 'Desktop application for application development.',
        imageAlt: 'SPOT preview',
      },
      devformfx: {
        description: 'Desktop application for application development.',
        imageAlt: 'DevFormFX preview',
      },
    },
  },
};

const esTranslations = {
  projects: {
    heading: 'PROYECTOS',
    labels: {
      status: 'ESTADO',
      tech: 'TECNOLOGÍAS',
      link: 'ENLACE',
    },
    status: {
      completed: 'completado',
    },
    actions: {
      github: 'Ver código en GitHub',
      figma: 'Ver diseño en Figma',
      projectLinks: 'Enlaces de',
    },
    items: {
      devhelper: {
        description: 'Aplicación de escritorio para el desarrollo de aplicaciones.',
        imageAlt: 'Vista previa de DevHelper',
      },
      spot: {
        description: 'Aplicación de escritorio para el desarrollo de aplicaciones.',
        imageAlt: 'Vista previa de SPOT',
      },
      devformfx: {
        description: 'Aplicación de escritorio para el desarrollo de aplicaciones.',
        imageAlt: 'Vista previa de DevFormFX',
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

describe('Projects', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Projects],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();
    await setupTranslate();
  });

  it('should create with three stable projects', () => {
    const fixture = TestBed.createComponent(Projects);
    expect(fixture.componentInstance.projects.map((project) => project.id)).toEqual([
      'devhelper',
      'spot',
      'devformfx',
    ]);
  });

  it('should use the shared placeholder image path', () => {
    const fixture = TestBed.createComponent(Projects);
    expect(
      fixture.componentInstance.projects.every(
        (project) => project.imageSrc === '/images/projects/project-placeholder.svg',
      ),
    ).toBe(true);
  });

  it('should render the section heading and three project articles', async () => {
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    await fixture.whenStable();

    const section = fixture.nativeElement.querySelector('section');
    const heading = fixture.nativeElement.querySelector('h2');
    const articles = fixture.nativeElement.querySelectorAll('article');

    expect(section.getAttribute('aria-labelledby')).toBe('projects-title');
    expect(heading.id).toBe('projects-title');
    expect(heading.textContent.trim()).toBe('PROJECTS');
    expect(articles.length).toBe(3);
  });

  it('should render semantic project metadata in the expected order', async () => {
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    await fixture.whenStable();

    const article = fixture.nativeElement.querySelector('article') as HTMLElement;
    const order = Array.from(article.querySelectorAll('figure, .projects__panel')).map(
      (element: Element) => (element as HTMLElement).className,
    );

    expect(order).toEqual(['projects__preview', 'projects__panel']);
    expect(article.querySelector('figcaption')?.textContent?.trim()).toBe('DevHelper');
    expect(article.querySelector('dl')).toBeTruthy();
    expect(article.querySelectorAll('dt').length).toBe(3);
    expect(article.querySelectorAll('dd').length).toBe(3);
    const dds = Array.from(article.querySelectorAll('dd')).map((el) => el.textContent?.trim());
    expect(dds[0]).toBe('completed');
    expect(dds[1]).toBe('Angular, Tailwind, Firebase');
    expect(dds[2]).toBe('Desktop application for application development.');
  });

  it('should keep image alt translated and caption in place', async () => {
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    await fixture.whenStable();

    const firstArticle = fixture.nativeElement.querySelector('article') as HTMLElement;
    const img = firstArticle.querySelector('img') as HTMLImageElement;
    expect(img.getAttribute('alt')).toBe('DevHelper preview');
    expect(firstArticle.querySelector('figure')).toBeTruthy();
    expect(firstArticle.querySelector('figcaption')?.textContent?.trim()).toBe('DevHelper');
  });

  it('should switch project heading, status and description to Spanish', async () => {
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    await fixture.whenStable();

    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe('PROYECTOS');
    expect(fixture.nativeElement.querySelector('.projects__status')?.textContent?.trim()).toBe(
      'completado',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'Aplicación de escritorio para el desarrollo de aplicaciones.',
    );
  });

  it('should expose the expected visual hooks', async () => {
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.projects')).toBeTruthy();
    expect(element.querySelector('.projects__inner')).toBeTruthy();
    expect(element.querySelector('.projects__heading')).toBeTruthy();
    expect(element.querySelector('.projects__list')).toBeTruthy();
    expect(element.querySelector('.projects__card')).toBeTruthy();
    expect(element.querySelector('.projects__preview')).toBeTruthy();
    expect(element.querySelector('.projects__panel')).toBeTruthy();
  });

  it('should not render project links while URLs are empty', async () => {
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelectorAll('.projects__action').length).toBe(0);
  });

  it('should render each card with accessible article label', async () => {
    const fixture = TestBed.createComponent(Projects);
    fixture.detectChanges();
    await fixture.whenStable();

    const articles = fixture.nativeElement.querySelectorAll('article');
    expect(articles[0].getAttribute('aria-labelledby')).toBe('project-devhelper-title');
    expect(articles[1].getAttribute('aria-labelledby')).toBe('project-spot-title');
    expect(articles[2].getAttribute('aria-labelledby')).toBe('project-devformfx-title');
  });
});
