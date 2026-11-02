import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { DeferBlockBehavior, DeferBlockState } from '@angular/core/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
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
    // jsdom no implementa IntersectionObserver (lo usan los triggers `on viewport`).
    globalThis.IntersectionObserver ??= class {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    } as unknown as typeof IntersectionObserver;
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
          aboutMe: 'cat about-me.txt',
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
      aboutMe: {
        heading: 'ABOUT ME',
        entries: {
          axpe: {
            period: '2023-present',
            short: 'Angular Developer',
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
          description: 'DESCRIPTION',
        },
        status: {
          completed: 'completed',
        },
        actions: {
          github: 'View code on GitHub',
          website: 'View live site',
          instagram: 'View on Instagram',
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
          submitting: '> sending message...',
          success: '> message sent [OK]',
          error: '> error: send failed [FAIL] — retry',
          cooldown: '> wait {{seconds}}s to resend...',
        },
      },
      footer: {
        navLabel: 'Contact links',
        emailLabel: 'Send email to piracocadidier@gmail.com',
        githubLabel: "View Didier's GitHub",
        linkedinLabel: "View Didier's LinkedIn",
        rights: 'All rights reserved.',
        builtWith: 'Built with Angular',
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
      aboutMe: {
        heading: 'SOBRE MÍ',
        entries: {
          axpe: {
            period: '2023-present',
            short: 'Desarrollador Angular',
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
          description: 'DESCRIPCIÓN',
        },
        status: {
          completed: 'completado',
        },
        actions: {
          github: 'Ver código en GitHub',
          website: 'Ver sitio web',
          instagram: 'Ver en Instagram',
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
          submitting: '> enviando mensaje...',
          success: '> mensaje enviado [OK]',
          error: '> error: envío fallido [FAIL] — reintenta',
          cooldown: '> espera {{seconds}}s para reenviar...',
        },
      },
      footer: {
        navLabel: 'Enlaces de contacto',
        emailLabel: 'Enviar correo a piracocadidier@gmail.com',
        githubLabel: 'Ver GitHub de Didier',
        linkedinLabel: 'Ver LinkedIn de Didier',
        rights: 'Todos los derechos reservados.',
        builtWith: 'Hecho con Angular',
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

  it('should start the presentation animation only after its terminal command completes', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const home = fixture.componentInstance as Home;
    expect(home.presentationAnimationStarted()).toBe(false);
    home.onPresentationTerminalCompleted();
    expect(home.presentationAnimationStarted()).toBe(true);
  });

  it('should declare one deferred block per lower section without waiting for the presentation', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    const blocks = await fixture.getDeferBlocks();
    expect(blocks.length).toBe(3);
  });

  it('should render sections in order: presentation, about-me, projects, contact', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
    const el = fixture.nativeElement as HTMLElement;
    const ids = Array.from(el.querySelectorAll('app-terminal-section')).map((s) =>
      s.getAttribute('data-section'),
    );
    expect(ids).toEqual(['presentation', 'about-me', 'projects', 'contact']);
    expect(el.querySelector('app-footer')).toBeTruthy();
  });

  it('should render about-me heading and bilingual content', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();
    await renderAllDeferBlocks(fixture);
    const translate = TestBed.inject(TranslateService);
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('#about-me-title')?.textContent?.trim()).toBe('ABOUT ME');
    expect(el.textContent).toContain('AXPE Consulting');
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('#about-me-title')?.textContent?.trim()).toBe('SOBRE MÍ');
    expect(el.textContent).toContain('Desarrollador Angular');
  });

  it('should render projects heading and bilingual content', async () => {
    const fixture = TestBed.createComponent(Home);
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

  it('should render contact heading and bilingual content', async () => {
    const fixture = TestBed.createComponent(Home);
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
});
