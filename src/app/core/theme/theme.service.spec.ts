import { TestBed } from '@angular/core/testing';
import { ThemeService, THEMES } from './theme.service';

function stubMatchMedia(prefersDark: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: prefersDark && query === '(prefers-color-scheme: dark)',
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

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  it('should expose the gold and goldlight themes', () => {
    expect(THEMES).toEqual(['gold', 'goldlight']);
  });

  describe('init()', () => {
    it('should default to gold when storage is empty and system prefers dark', () => {
      stubMatchMedia(true);
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.currentTheme()).toBe('gold');
      expect(document.documentElement.getAttribute('data-theme')).toBe('gold');
    });

    it('should default to goldlight when storage is empty and system prefers light', () => {
      stubMatchMedia(false);
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.currentTheme()).toBe('goldlight');
      expect(document.documentElement.getAttribute('data-theme')).toBe('goldlight');
    });

    it('should respect stored theme even when system differs', () => {
      localStorage.setItem('theme', 'goldlight');
      stubMatchMedia(true);
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.currentTheme()).toBe('goldlight');
      expect(document.documentElement.getAttribute('data-theme')).toBe('goldlight');
    });

    it('should ignore invalid stored values and fall back to system', () => {
      localStorage.setItem('theme', 'something-invalid');
      stubMatchMedia(false);
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.currentTheme()).toBe('goldlight');
    });

    it('should be idempotent on repeated calls', () => {
      stubMatchMedia(true);
      const service = TestBed.inject(ThemeService);
      service.init();
      service.init();
      expect(service.currentTheme()).toBe('gold');
    });
  });

  describe('toggle()', () => {
    it('should switch from gold to goldlight, persist and apply', () => {
      stubMatchMedia(true);
      const service = TestBed.inject(ThemeService);
      service.init();
      service.toggle();
      expect(service.currentTheme()).toBe('goldlight');
      expect(localStorage.getItem('theme')).toBe('goldlight');
      expect(document.documentElement.getAttribute('data-theme')).toBe('goldlight');
    });

    it('should switch from goldlight to gold, persist and apply', () => {
      stubMatchMedia(false);
      const service = TestBed.inject(ThemeService);
      service.init();
      service.toggle();
      expect(service.currentTheme()).toBe('gold');
      expect(localStorage.getItem('theme')).toBe('gold');
      expect(document.documentElement.getAttribute('data-theme')).toBe('gold');
    });
  });

  describe('set(theme)', () => {
    it('should set the theme, persist and apply', () => {
      const service = TestBed.inject(ThemeService);
      service.set('goldlight');
      expect(service.currentTheme()).toBe('goldlight');
      expect(localStorage.getItem('theme')).toBe('goldlight');
      expect(document.documentElement.getAttribute('data-theme')).toBe('goldlight');
    });
  });
});
