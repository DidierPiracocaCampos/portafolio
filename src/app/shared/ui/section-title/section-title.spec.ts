import { TestBed } from '@angular/core/testing';
import SectionTitle from './section-title';

describe('SectionTitle', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionTitle],
    }).compileComponents();
  });

  it('should render h2 with title and two purple rules and uniform max-width', async () => {
    const fixture = TestBed.createComponent(SectionTitle);
    fixture.componentRef.setInput('title', 'EXPERIENCE');
    fixture.componentRef.setInput('headingId', 'experience-title');
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    const heading = el.querySelector('h2') as HTMLElement;
    const rules = el.querySelectorAll('.section-title__rule');
    const groups = el.querySelectorAll('.section-title__rules');
    const container = el.querySelector('.section-title') as HTMLElement;

    expect(heading).toBeTruthy();
    expect(heading.id).toBe('experience-title');
    expect(heading.textContent?.trim()).toBe('EXPERIENCE');
    expect(heading.classList.contains('section-title__heading')).toBe(true);
    expect(rules.length).toBe(4);
    expect(groups.length).toBe(2);
    expect(container).toBeTruthy();
    expect(el.querySelector('h3')).toBeFalsy();
  });

  it('should render h3 when level is h3', async () => {
    const fixture = TestBed.createComponent(SectionTitle);
    fixture.componentRef.setInput('title', 'SKILLS');
    fixture.componentRef.setInput('headingId', 'skills-title');
    fixture.componentRef.setInput('level', 'h3');
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h3')?.id).toBe('skills-title');
    expect(el.querySelector('h3')?.textContent?.trim()).toBe('SKILLS');
    expect(el.querySelector('h2')).toBeFalsy();
  });

  it('should apply BEM classes for styling and uppercase via CSS', async () => {
    const fixture = TestBed.createComponent(SectionTitle);
    fixture.componentRef.setInput('title', 'PROJECTS');
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.section-title')).toBeTruthy();
    expect(el.querySelectorAll('.section-title__rule').length).toBe(4);
    expect(el.querySelectorAll('.section-title__rules').length).toBe(2);
    expect(el.querySelector('.section-title__heading')).toBeTruthy();
  });

  it('should hide rules from assistive tech', async () => {
    const fixture = TestBed.createComponent(SectionTitle);
    fixture.componentRef.setInput('title', 'CONTACT');
    fixture.detectChanges();
    await fixture.whenStable();

    const groups = fixture.nativeElement.querySelectorAll('.section-title__rules');
    expect(groups.length).toBe(2);
    groups.forEach((group: Element) => {
      expect(group.getAttribute('aria-hidden')).toBe('true');
    });
    expect(fixture.nativeElement.querySelectorAll('.section-title__rule').length).toBe(4);
  });
});
