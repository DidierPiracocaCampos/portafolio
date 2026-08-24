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
      language: {
        label: 'Language',
        es: 'Spanish',
        en: 'English',
        switchToEs: 'Switch to Spanish',
        switchToEn: 'Switch to English',
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
      language: {
        label: 'Idioma',
        es: 'Español',
        en: 'Inglés',
        switchToEs: 'Cambiar a español',
        switchToEn: 'Cambiar a inglés',
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
});
