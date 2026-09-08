import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { CvDownload } from './cv-download';

describe('CvDownload', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvDownload],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { cv: { downloadLabel: 'Download CV' } });
    translate.setTranslation('es', { cv: { downloadLabel: 'Descargar CV' } });
    await firstValueFrom(translate.use('en'));
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CvDownload);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render anchor with correct href, download and rel', () => {
    const fixture = TestBed.createComponent(CvDownload);
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a.cv-download') as HTMLAnchorElement;
    expect(anchor).toBeTruthy();
    expect(anchor.getAttribute('href')).toBe('/documents/cv-didier_piracoca.pdf');
    expect(anchor.getAttribute('download')).toBe('cv-didier_piracoca.pdf');
    expect(anchor.getAttribute('rel')).toBe('noopener');
    expect(anchor.classList.contains('btn')).toBe(true);
    expect(anchor.classList.contains('btn-primary')).toBe(true);
    expect(anchor.classList.contains('btn-sm')).toBe(true);
  });

  it('should expose translated aria-label', () => {
    const fixture = TestBed.createComponent(CvDownload);
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a.cv-download') as HTMLElement;
    expect(anchor.getAttribute('aria-label')).toBe('Download CV');
  });

  it('should switch aria-label to Spanish', async () => {
    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    const fixture = TestBed.createComponent(CvDownload);
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a.cv-download') as HTMLElement;
    expect(anchor.getAttribute('aria-label')).toBe('Descargar CV');
  });

  it('should render download icon and responsive labels', () => {
    const fixture = TestBed.createComponent(CvDownload);
    fixture.detectChanges();
    const anchor = fixture.nativeElement.querySelector('a.cv-download') as HTMLElement;
    const svg = anchor.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
    const desktopLabel = anchor.querySelector('span.hidden.sm\\:inline');
    const mobileLabel = anchor.querySelector('span.sm\\:hidden');
    expect(desktopLabel).toBeTruthy();
    expect(mobileLabel).toBeTruthy();
    expect(mobileLabel?.textContent?.trim()).toBe('CV');
  });
});
