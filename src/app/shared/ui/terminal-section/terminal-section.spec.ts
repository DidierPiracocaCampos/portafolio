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

type IoCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

/** Sustituye IntersectionObserver y devuelve una función para disparar entradas. */
function stubIntersectionObserver(): { trigger: (entry: Partial<IntersectionObserverEntry>) => void; options: () => IntersectionObserverInit | undefined } {
  let callback: IoCallback | null = null;
  let lastOptions: IntersectionObserverInit | undefined;
  class FakeObserver {
    constructor(cb: IoCallback, options?: IntersectionObserverInit) {
      callback = cb;
      lastOptions = options;
    }
    observe(): void {}
    disconnect(): void {}
  }
  Object.defineProperty(globalThis, 'IntersectionObserver', {
    configurable: true,
    writable: true,
    value: FakeObserver,
  });
  return {
    trigger: (entry) => callback?.([entry]),
    options: () => lastOptions,
  };
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

  describe('viewport trigger', () => {
    const originalIo = (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;

    afterEach(() => {
      Object.defineProperty(globalThis, 'IntersectionObserver', {
        configurable: true,
        writable: true,
        value: originalIo,
      });
      vi.useRealTimers();
    });

    it('should expose the section id as a host attribute', async () => {
      stubIntersectionObserver();
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      await fixture.whenStable();
      expect(
        (fixture.nativeElement as HTMLElement)
          .querySelector('app-terminal-section')
          ?.getAttribute('data-section'),
      ).toBe('skills');
    });

    it('should stay hidden until the section enters the viewport, then type the command', async () => {
      stubMatchMedia(false);
      vi.useFakeTimers();
      const io = stubIntersectionObserver();
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      const content = () => el.querySelector('.terminal-section__content')!;

      expect(io.options()?.rootMargin).toBe('0px 0px -15% 0px');
      vi.advanceTimersByTime(5000);
      fixture.detectChanges();
      expect(content().classList).not.toContain('terminal-section__content--visible');

      io.trigger({ isIntersecting: true, boundingClientRect: { bottom: 500 } as DOMRect });
      vi.advanceTimersByTime(5000);
      fixture.detectChanges();
      expect(el.querySelector('.terminal-section__command')?.textContent).toContain(
        'cat skills.json',
      );
      expect(content().classList).toContain('terminal-section__content--visible');
    });

    it('should reveal instantly when the section is already above the viewport', async () => {
      stubMatchMedia(false);
      const io = stubIntersectionObserver();
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();

      io.trigger({ isIntersecting: false, boundingClientRect: { bottom: -20 } as DOMRect });
      fixture.detectChanges();
      const el = fixture.nativeElement as HTMLElement;
      expect(el.querySelector('.terminal-section__command')?.textContent).toContain(
        'cat skills.json',
      );
      expect(el.querySelector('.terminal-section__content')?.classList).toContain(
        'terminal-section__content--visible',
      );
    });

    it('should ignore sections still below the viewport', async () => {
      stubMatchMedia(false);
      const io = stubIntersectionObserver();
      const fixture = TestBed.createComponent(HostComponent);
      fixture.detectChanges();

      io.trigger({ isIntersecting: false, boundingClientRect: { bottom: 2000 } as DOMRect });
      fixture.detectChanges();
      expect(
        (fixture.nativeElement as HTMLElement).querySelector('.terminal-section__content')
          ?.classList,
      ).not.toContain('terminal-section__content--visible');
    });
  });
});
