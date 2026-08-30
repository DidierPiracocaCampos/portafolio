import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ThemeToggle } from './theme-toggle';
import { ThemeService } from '../../../core/theme/theme.service';

describe('ThemeToggle', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { theme: { toggle: 'Toggle theme' } });
    await firstValueFrom(translate.use('en'));
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a label with swap classes and a hidden checkbox', () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const label = el.querySelector('label');
    expect(label).toBeTruthy();
    expect(label?.classList.contains('swap')).toBe(true);
    expect(label?.classList.contains('swap-rotate')).toBe(true);
    expect(label?.classList.contains('btn')).toBe(true);
    const input = label?.querySelector('input[type="checkbox"]');
    expect(input).toBeTruthy();
    expect(input?.classList.contains('theme-controller')).toBe(true);
    expect((input as HTMLInputElement).value).toBe('gold');
  });

  it('should render sun (swap-on) and moon (swap-off) SVGs', () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const on = el.querySelector('svg.swap-on');
    const off = el.querySelector('svg.swap-off');
    expect(on).toBeTruthy();
    expect(off).toBeTruthy();
  });

  it('should bind checkbox checked to currentTheme === gold', () => {
    const service = TestBed.inject(ThemeService);
    service.set('gold');
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(input.checked).toBe(true);

    service.set('goldlight');
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });

  it('should call theme.set on checkbox change', () => {
    const service = TestBed.inject(ThemeService);
    service.set('gold');
    const setSpy = vi.spyOn(service, 'set');
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    input.checked = false;
    input.dispatchEvent(new Event('change'));
    expect(setSpy).toHaveBeenCalledWith('goldlight');

    input.checked = true;
    input.dispatchEvent(new Event('change'));
    expect(setSpy).toHaveBeenCalledWith('gold');
  });

  it('should expose a translated aria-label', () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    expect(label?.getAttribute('aria-label')).toBe('Toggle theme');
  });
});
