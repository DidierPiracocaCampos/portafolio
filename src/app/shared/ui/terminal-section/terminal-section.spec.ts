import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { Component } from '@angular/core';
import TerminalSection from './terminal-section';

@Component({
  selector: 'app-terminal-section-host',
  imports: [TerminalSection],
  template: `
    <app-terminal-section sectionId="skills" commandKey="terminal.commands.skills">
      <span class="projected">PROJECTED CONTENT</span>
    </app-terminal-section>
  `,
})
class HostComponent {}

function stubMatchMedia(reduce: boolean): void {
  Object.defineProperty(globalThis, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: reduce && query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList,
  });
}

describe('TerminalSection', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', {
      terminal: {
        commands: { skills: 'cat skills.json' },
      },
    });
    await firstValueFrom(translate.use('en'));
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(HostComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should project content into the component', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelector('.projected')?.textContent).toBe(
      'PROJECTED CONTENT',
    );
  });

  it('should render fixed prompt with user, path and branch', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.terminal-section__user')?.textContent).toBe('Didier');
    expect(el.querySelector('.terminal-section__path')?.textContent).toBe('C:/proyects/portafolio');
    expect(el.querySelector('.terminal-section__branch')?.textContent).toBe('main');
    expect(el.querySelector('.terminal-section__icon--user')).toBeTruthy();
    expect(el.querySelector('.terminal-section__icon--folder')).toBeTruthy();
    expect(el.querySelector('.terminal-section__icon--branch')).toBeTruthy();
  });

  it('should immediately reveal and type the full command when reduced motion is preferred', async () => {
    stubMatchMedia(true);
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.terminal-section__command')?.textContent).toContain(
      'cat skills.json',
    );
    expect(el.querySelector('.terminal-section__content')?.classList).toContain(
      'terminal-section__content--visible',
    );
  });
});
