import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { DeferBlockBehavior, DeferBlockState } from '@angular/core/testing';
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
import { ContactSubmissionService } from '../../core/contact/contact-submission.service';
import Home from './home';

const enHomeSequence = {
  home: {
    sequence: {
      loadError: 'Failed to load this section. Please reload the page to try again.',
    },
  },
};

const esHomeSequence = {
  home: {
    sequence: {
      loadError: 'No se pudo cargar esta sección. Recarga la página para intentarlo de nuevo.',
    },
  },
};

async function renderAllDeferBlocks(
  fixture: ReturnType<typeof TestBed.createComponent<Home>>,
): Promise<void> {
  const blocks = await fixture.getDeferBlocks();
  for (const block of blocks) {
    await block.render(DeferBlockState.Complete);
  }
  fixture.detectChanges();
  await fixture.whenStable();
}

describe('Home', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      deferBlockBehavior: DeferBlockBehavior.Manual,
      imports: [Home],
      providers: [
        provideRouter([]),
        provideTranslateService({ fallbackLang: 'en' }),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        {
          provide: ContactSubmissionService,
          useValue: { submit: vi.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compileComponents();
    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      ...enHomeSequence,
      terminal: {
        commands: {
          presentation: 'start portfolio',
          experience: 'cat experience.txt',
          skills: 'cat skills.json',
          projects: 'ls projects/',
          contact: 'npm run contact',
        },
      },
      presentation: {
        prompt: ['> initializing portfolio ...', '> loading projects ...', '> system ready'],
        title: 'Angular Developer and Frontend Developer',
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
      contact: {
        heading: 'CONTACT',
        initializing: '> initializing contact module ...',
        fields: {
          name: 'name:',
          email: 'email:',
          message: 'message:',
        },
        actions: {
          send: '> send',
        },
        validation: {
          nameRequired: 'Name is required.',
          nameTooLong: 'Name must be 80 characters or fewer.',
          emailRequired: 'Email is required.',
          emailInvalid: 'Enter a valid email address.',
          emailTooLong: 'Email must be 254 characters or fewer.',
          messageRequired: 'Message is required.',
          messageTooLong: 'Message must be 2,000 characters or fewer.',
        },
        status: {
          submitting: 'Sending...',
          success: 'Message sent successfully.',
          error: 'The message could not be sent. Please try again.',
          cooldown: 'Wait {{seconds}} seconds before sending again.',
        },
      },
    });
    translate.setTranslation('es', {
      ...esHomeSequence,
      presentation: {
        prompt: ['> inicializando portafolio ...', '> cargando proyectos ...', '> sistema listo'],
        title: 'Programador Angular y Desarrollador Frontend',
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
      contact: {
        heading: 'CONTACTO',
        initializing: '> inicializando modulo de contacto ...',
        fields: {
          name: 'nombre:',
          email: 'correo:',
          message: 'mensaje:',
        },
        actions: {
          send: '> enviar',
        },
        validation: {
          nameRequired: 'El nombre es obligatorio.',
          nameTooLong: 'El nombre debe tener 80 caracteres o menos.',
          emailRequired: 'El correo es obligatorio.',
          emailInvalid: 'Introduce un correo valido.',
          emailTooLong: 'El correo debe tener 254 caracteres o menos.',
          messageRequired: 'El mensaje es obligatorio.',
          messageTooLong: 'El mensaje debe tener 2.000 caracteres o menos.',
        },
        status: {
          submitting: 'Enviando...',
          success: 'Mensaje enviado correctamente.',
          error: 'No se pudo enviar el mensaje. Intentalo de nuevo.',
          cooldown: 'Espera {{seconds}} segundos antes de volver a enviar.',
        },
      },
    });
    await firstValueFrom(translate.use('en'));
  });

  afterEach(() => {
    const httpTesting = TestBed.inject(HttpTestingController);
    const pending = httpTesting.match(() => true);
    for (const req of pending) {
      req.flush('');
    }
  });

  it('should render app-presentation as first section', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement;
    expect(el.querySelector('app-presentation')).toBeTruthy();
    expect(el.querySelector('h1')?.textContent?.trim()).toBe(
      'Angular Developer and Frontend Developer',
    );
  });

  it('should not render language switcher - moved to App shell', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement;
    expect(el.querySelector('app-language-switcher')).toBeFalsy();
    expect(el.querySelector('.home__header')).toBeFalsy();
  });

  it('should initially hide lower sections until presentation completes', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-experience')).toBeFalsy();
    expect(el.querySelector('app-skills')).toBeFalsy();
    expect(el.querySelector('app-projects')).toBeFalsy();
    expect(el.querySelector('app-contact')).toBeFalsy();
  });

  it('should render experience after presentation', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const home = fixture.componentInstance as Home;
    home.onPresentationTerminalCompleted();
    home.onPresentationCompleted();
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
    const el = fixture.nativeElement as HTMLElement;
    const presentation = el.querySelector('app-presentation');
    const experience = el.querySelector('app-experience');
    expect(presentation).toBeTruthy();
    expect(experience).toBeTruthy();
    expect(presentation?.closest('app-terminal-section')?.nextElementSibling).toBe(
      experience?.closest('app-terminal-section'),
    );
  });

  it('should render experience heading and bilingual content', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const home = fixture.componentInstance as Home;
    home.onPresentationTerminalCompleted();
    home.onPresentationCompleted();
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
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
    const home = fixture.componentInstance as Home;
    home.onPresentationTerminalCompleted();
    home.onPresentationCompleted();
    home.onExperienceCompleted();
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
    const el = fixture.nativeElement as HTMLElement;
    const experience = el.querySelector('app-experience');
    const skills = el.querySelector('app-skills');
    expect(skills).toBeTruthy();
    expect(experience?.closest('app-terminal-section')?.nextElementSibling).toBe(
      skills?.closest('app-terminal-section'),
    );
  });

  it('should render skills heading and bilingual content', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const home = fixture.componentInstance as Home;
    home.onPresentationTerminalCompleted();
    home.onPresentationCompleted();
    home.onExperienceCompleted();
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
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
    const home = fixture.componentInstance as Home;
    home.onPresentationTerminalCompleted();
    home.onPresentationCompleted();
    home.onExperienceCompleted();
    home.onSkillsCompleted();
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
    const el = fixture.nativeElement as HTMLElement;
    const skills = el.querySelector('app-skills');
    const projects = el.querySelector('app-projects');
    expect(projects).toBeTruthy();
    expect(skills?.closest('app-terminal-section')?.nextElementSibling).toBe(
      projects?.closest('app-terminal-section'),
    );
  });

  it('should render projects heading and bilingual content', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const home = fixture.componentInstance as Home;
    home.onPresentationTerminalCompleted();
    home.onPresentationCompleted();
    home.onExperienceCompleted();
    home.onSkillsCompleted();
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
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

  it('should render contact after projects', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const home = fixture.componentInstance as Home;
    home.onPresentationTerminalCompleted();
    home.onPresentationCompleted();
    home.onExperienceCompleted();
    home.onSkillsCompleted();
    home.onProjectsCompleted();
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
    const el = fixture.nativeElement as HTMLElement;
    const projects = el.querySelector('app-projects');
    const contact = el.querySelector('app-contact');
    expect(contact).toBeTruthy();
    expect(projects?.closest('app-terminal-section')?.nextElementSibling).toBe(
      contact?.closest('app-terminal-section'),
    );
  });

  it('should render contact heading and bilingual content', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const home = fixture.componentInstance as Home;
    home.onPresentationTerminalCompleted();
    home.onPresentationCompleted();
    home.onExperienceCompleted();
    home.onSkillsCompleted();
    home.onProjectsCompleted();
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
    const translate = TestBed.inject(TranslateService);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('#contact-title')?.textContent?.trim()).toBe('CONTACT');
    expect(el.textContent).toContain('initializing contact module');
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('#contact-title')?.textContent?.trim()).toBe('CONTACTO');
    expect(el.textContent).toContain('inicializando modulo de contacto');
  });

  it('should not skip steps when events fire out of order', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const home = fixture.componentInstance as Home;
    // Try to skip directly to skills without presentation
    home.onSkillsCompleted();
    fixture.detectChanges();
    await fixture.whenStable();
    let blocks = await fixture.getDeferBlocks();
    // No blocks should be rendered because sequence hasn't advanced
    expect(blocks.length).toBe(0);
    expect(fixture.nativeElement.querySelector('app-skills')).toBeFalsy();

    // Now correctly advance step by step
    home.onPresentationTerminalCompleted();
    home.onPresentationCompleted();
    home.onExperienceCompleted();
    home.onSkillsCompleted();
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
    expect(fixture.nativeElement.querySelector('app-skills')).toBeTruthy();
  });
});
