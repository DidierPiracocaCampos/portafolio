import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import AboutEntryCard from './about-entry-card';
import type { AboutMeEntry } from '../../models/about-me-entry';

const enTranslations = {
  aboutMe: {
    entries: {
      axpe: {
        period: '2023-present',
        year: '2023',
        short: 'Angular Developer',
        company: 'AXPE Consulting',
        role: 'Angular Developer',
        selectLabel: 'Show work experience details',
        items: [
          'Development of web applications using Spring MVC and Ionic',
          'Oracle SQL integration (optimized queries & data modeling)',
          'Maintenance, bug fixing and production support',
          'Full-stack feature delivery (frontend + backend)',
        ],
      },
      education: {
        period: '2021 - 2023',
        year: '2021',
        short: 'FP DAW',
        title: 'Multiplatform Application Development Degree',
        selectLabel: 'Show education details',
        items: [
          'Software engineering fundamentals',
          'Database design and SQL',
          'UI development and interfaces',
        ],
      },
    },
  },
};

const axpeEntry: AboutMeEntry = {
  id: 'axpe',
  periodKey: 'aboutMe.entries.axpe.period',
  yearKey: 'aboutMe.entries.axpe.year',
  shortKey: 'aboutMe.entries.axpe.short',
  subKey: 'aboutMe.entries.axpe.company',
  selectLabelKey: 'aboutMe.entries.axpe.selectLabel',
  companyKey: 'aboutMe.entries.axpe.company',
  roleKey: 'aboutMe.entries.axpe.role',
  itemKeys: [
    'aboutMe.entries.axpe.items.0',
    'aboutMe.entries.axpe.items.1',
    'aboutMe.entries.axpe.items.2',
    'aboutMe.entries.axpe.items.3',
  ],
};

const educationEntry: AboutMeEntry = {
  id: 'education',
  periodKey: 'aboutMe.entries.education.period',
  yearKey: 'aboutMe.entries.education.year',
  shortKey: 'aboutMe.entries.education.short',
  selectLabelKey: 'aboutMe.entries.education.selectLabel',
  titleKey: 'aboutMe.entries.education.title',
  itemKeys: [
    'aboutMe.entries.education.items.0',
    'aboutMe.entries.education.items.1',
    'aboutMe.entries.education.items.2',
  ],
};

async function setupTranslate(): Promise<void> {
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', enTranslations);
  await firstValueFrom(translate.use('en'));
}

describe('AboutEntryCard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();
    await setupTranslate();
  });

  it('should render company - role with 4 items for axpe', async () => {
    const fixture = TestBed.createComponent(AboutEntryCard);
    fixture.componentRef.setInput('entry', axpeEntry);
    fixture.componentRef.setInput('active', true);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.about-me__company')?.textContent?.trim()).toBe('AXPE Consulting');
    expect(el.querySelector('.about-me__role')?.textContent?.trim()).toBe('Angular Developer');
    expect(el.querySelector('.about-me__period')?.textContent?.trim()).toBe('2023-present');
    expect(el.querySelectorAll('ul.about-me__items li').length).toBe(4);
  });

  it('should render title with 3 items for education', async () => {
    const fixture = TestBed.createComponent(AboutEntryCard);
    fixture.componentRef.setInput('entry', educationEntry);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Multiplatform Application Development Degree');
    expect(el.querySelector('.about-me__period')?.textContent?.trim()).toBe('2021 - 2023');
    expect(el.querySelectorAll('ul.about-me__items li').length).toBe(3);
  });

  it('should expose active and variant via host', async () => {
    const fixture = TestBed.createComponent(AboutEntryCard);
    fixture.componentRef.setInput('entry', axpeEntry);
    fixture.componentRef.setInput('variant', 'inline');
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
    await fixture.whenStable();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.classList.contains('about-me-card')).toBe(true);
    expect(host.classList.contains('about-me-card--inline')).toBe(true);
    expect(host.getAttribute('data-entry')).toBe('axpe');
  });

  it('should keep inactive stack cards visible without aria-hidden', async () => {
    const fixture = TestBed.createComponent(AboutEntryCard);
    fixture.componentRef.setInput('entry', axpeEntry);
    fixture.componentRef.setInput('variant', 'stack');
    fixture.componentRef.setInput('active', false);
    fixture.detectChanges();
    await fixture.whenStable();
    expect((fixture.nativeElement as HTMLElement).getAttribute('aria-hidden')).toBeNull();
    expect((fixture.nativeElement as HTMLElement).hasAttribute('inert')).toBe(false);
  });
});
