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
});
