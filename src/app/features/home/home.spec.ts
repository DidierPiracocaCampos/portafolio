import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import Home from './home';

describe('Home', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [provideRouter([]), provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      presentation: {
        prompt: ['> initializing portfolio ...', '> loading projects ...', '> system ready'],
        title: 'DIDIER PIRACOCA',
        subtitle: 'Multiplatform Application Developer',
        description: [
          'Currently focused on Angular and modern frontend development.',
          'Experience with Java, Spring MVC and SQL systems.',
        ],
      },
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
      skills: {
        heading: 'SKILLS',
        groups: {
          frontend: {
            heading: 'Frontend',
            items: {
              angular: 'Angular',
              tailwind: 'TailwindCSS',
              bootstrap: 'Bootstrap',
            },
          },
          backend: {
            heading: 'Backend',
            items: {
              java: 'Java',
              spring: 'Spring',
            },
          },
          tools: {
            heading: 'Tools',
            items: {
              git: 'Git',
              gitlab: 'GitLab',
              github: 'GitHub',
              vsCode: 'VS Code',
              eclipse: 'Eclipse',
              opencode: 'OpenCode',
              figma: 'Figma',
            },
          },
          database: {
            heading: 'Database',
            items: {
              firebase: 'Firebase',
              oracleDb: 'OracleDB',
              sql: 'SQL',
            },
          },
          mobile: {
            heading: 'Mobile',
            items: {
              androidStudio: 'Android Studio',
              ionic: 'Ionic',
              cordova: 'Cordova',
            },
          },
        },
      },
      language: {
        label: 'Language',
        es: 'Spanish',
        en: 'English',
        switchToEs: 'Switch to Spanish',
        switchToEn: 'Switch to English',
      },
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
    });
    translate.setTranslation('es', {
      presentation: {
        prompt: ['> inicializando portafolio ...', '> cargando proyectos ...', '> sistema listo'],
        title: 'DIDIER PIRACOCA',
        subtitle: 'Desarrollador de Aplicaciones Multiplataforma',
        description: [
          'Actualmente enfocado en Angular y desarrollo frontend moderno.',
          'Experiencia con sistemas Java, Spring MVC y SQL.',
        ],
      },
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
      skills: {
        heading: 'HABILIDADES',
        groups: {
          frontend: {
            heading: 'Frontend',
            items: {
              angular: 'Angular',
              tailwind: 'TailwindCSS',
              bootstrap: 'Bootstrap',
            },
          },
          backend: {
            heading: 'Backend',
            items: {
              java: 'Java',
              spring: 'Spring',
            },
          },
          tools: {
            heading: 'Herramientas',
            items: {
              git: 'Git',
              gitlab: 'GitLab',
              github: 'GitHub',
              vsCode: 'VS Code',
              eclipse: 'Eclipse',
              opencode: 'OpenCode',
              figma: 'Figma',
            },
          },
          database: {
            heading: 'Base de datos',
            items: {
              firebase: 'Firebase',
              oracleDb: 'OracleDB',
              sql: 'SQL',
            },
          },
          mobile: {
            heading: 'Móvil',
            items: {
              androidStudio: 'Android Studio',
              ionic: 'Ionic',
              cordova: 'Cordova',
            },
          },
        },
      },
      language: {
        label: 'Idioma',
        es: 'Español',
        en: 'Inglés',
        switchToEs: 'Cambiar a español',
        switchToEn: 'Cambiar a inglés',
      },
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
    });
    await firstValueFrom(translate.use('en'));
  });

  it('should render app-presentation as first section', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement;
    expect(el.querySelector('app-presentation')).toBeTruthy();
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('DIDIER PIRACOCA');
  });

  it('should render language switcher in header', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement;
    expect(el.querySelector('app-language-switcher')).toBeTruthy();
    expect(el.querySelector('.home__header')).toBeTruthy();
  });

  it('should render experience after presentation', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const presentation = el.querySelector('app-presentation');
    const experience = el.querySelector('app-experience');
    expect(presentation).toBeTruthy();
    expect(experience).toBeTruthy();
    expect(presentation?.nextElementSibling).toBe(experience);
  });

  it('should render experience heading and bilingual content', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const translate = TestBed.inject(TranslateService);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('#experience-title')?.textContent?.trim()).toBe('EXPERIENCE');
    expect(el.textContent).toContain('AXPE Consulting');
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('#experience-title')?.textContent?.trim()).toBe('EXPERIENCIA');
    expect(el.textContent).toContain('Desarrollador Angular');
  });

  it('should render skills after experience', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const experience = el.querySelector('app-experience');
    const skills = el.querySelector('app-skills');
    expect(skills).toBeTruthy();
    expect(experience?.nextElementSibling).toBe(skills);
  });

  it('should render skills heading and bilingual content', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const translate = TestBed.inject(TranslateService);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('#skills-title')?.textContent?.trim()).toBe('SKILLS');
    expect(el.textContent).toContain('Angular');
    expect(el.textContent).toContain('Git');
    expect(el.querySelectorAll('svg.skills__icon').length).toBe(18);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('#skills-title')?.textContent?.trim()).toBe('HABILIDADES');
    expect(el.textContent).toContain('Herramientas');
    expect(el.textContent).toContain('Móvil');
  });

  it('should render projects after skills', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const skills = el.querySelector('app-skills');
    const projects = el.querySelector('app-projects');
    expect(projects).toBeTruthy();
    expect(skills?.nextElementSibling).toBe(projects);
  });

  it('should render projects heading and bilingual content', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const translate = TestBed.inject(TranslateService);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('#projects-title')?.textContent?.trim()).toBe('PROJECTS');
    expect(el.textContent).toContain('DevHelper');
    expect(el.textContent).toContain('Angular, Tailwind, Firebase');
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('#projects-title')?.textContent?.trim()).toBe('PROYECTOS');
    expect(el.textContent).toContain('completado');
    expect(el.textContent).toContain(
      'Aplicación de escritorio para el desarrollo de aplicaciones.',
    );
  });
});
