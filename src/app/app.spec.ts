import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([]), provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render router outlet', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should render app shell with header actions and custom frame', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.app-shell')).toBeTruthy();
    expect(compiled.querySelector('.app-shell__window')).toBeTruthy();
    expect(compiled.querySelector('.app-shell__header')).toBeTruthy();
    expect(compiled.querySelector('.app-shell__windowbar')).toBeTruthy();
    expect(compiled.querySelector('.app-shell__window-controls')).toBeTruthy();
    expect(compiled.querySelectorAll('.app-shell__window-dot').length).toBe(3);
    expect(compiled.querySelector('.app-shell__title')?.textContent?.trim()).toBe(
      'dev@portfolio:~',
    );
    expect(compiled.querySelector('.app-shell__prompt')).toBeFalsy();
    expect(compiled.querySelector('.app-shell__cursor')).toBeFalsy();
    expect(compiled.querySelector('.app-shell__actions app-language-switcher')).toBeTruthy();
    expect(compiled.querySelector('.app-shell__main')).toBeTruthy();
    expect(compiled.querySelector('.app-shell__frame')).toBeTruthy();
    expect(compiled.querySelector('.app-shell__content router-outlet')).toBeTruthy();
  });

  it('should keep header and main together inside the same window', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const windowEl = compiled.querySelector('.app-shell__window') as HTMLElement;
    const header = windowEl.querySelector('.app-shell__header');
    const main = windowEl.querySelector('.app-shell__main');
    expect(windowEl).toBeTruthy();
    expect(header).toBeTruthy();
    expect(main).toBeTruthy();
    expect(header?.nextElementSibling).toBe(main);
  });

  it('should keep language switcher inside actions and not duplicate header', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const actions = compiled.querySelector('.app-shell__actions');
    expect(actions).toBeTruthy();
    expect(actions?.querySelector('app-theme-toggle')).toBeTruthy();
    expect(actions?.querySelector('app-language-switcher')).toBeTruthy();
    expect(compiled.querySelectorAll('.app-shell__header').length).toBe(1);
  });

  it('should not use mockup-code class anymore', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.mockup-code')).toBeFalsy();
  });

  it('should render theme toggle inside header actions next to language switcher', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const actions = compiled.querySelector('.app-shell__actions');
    expect(actions).toBeTruthy();
    const toggle = actions?.querySelector('app-theme-toggle');
    const switcher = actions?.querySelector('app-language-switcher');
    expect(toggle).toBeTruthy();
    expect(switcher).toBeTruthy();
    // Theme toggle is rendered before language switcher
    expect(toggle?.nextElementSibling).toBe(switcher);
  });
});
