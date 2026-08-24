import { TestBed } from '@angular/core/testing';
import Presentation from './presentation';

describe('Presentation', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
    const fixture = TestBed.createComponent(Presentation);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render h1 with DIDIER PIRACOCA', async () => {
    await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('DIDIER PIRACOCA');
  });

  it('should render prompt with 3 lines and aria-hidden', async () => {
    await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    const prompt = fixture.nativeElement.querySelector('.presentation__prompt');
    expect(prompt.getAttribute('aria-hidden')).toBe('true');
    const lines = prompt.textContent;
    expect(lines).toContain('> initializing portfolio ...');
    expect(lines).toContain('> loading projects ...');
    expect(lines).toContain('> system ready');
  });

  it('should render subtitle and two description lines in correct DOM order', async () => {
    await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    const order = Array.from(
      el.querySelectorAll('.presentation__prompt, h1, .presentation__subtitle, .presentation__description p'),
    ).map((n) => (n as Element).textContent?.trim());
    expect(order[0]).toContain('initializing');
    expect(order[1]).toBe('DIDIER PIRACOCA');
    expect(order[2]).toBe('Multiplatform Application Developer');
    expect(order[3]).toBe('Currently focused on Angular and modern frontend development.');
    expect(order[4]).toBe('Experience with Java, Spring MVC and SQL systems.');
  });

  it('should use section with aria-labelledby pointing to h1', async () => {
    await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('section');
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(section.getAttribute('aria-labelledby')).toBe(h1.id);
    expect(h1.id).toBe('presentation-title');
  });
});
