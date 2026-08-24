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
});
