import { TestBed } from '@angular/core/testing';
import Home from './home';

describe('Home', () => {
  it('should render app-presentation as first section', async () => {
    await TestBed.configureTestingModule({ imports: [Home] }).compileComponents();
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.querySelector('app-presentation')).toBeTruthy();
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('DIDIER PIRACOCA');
  });
});
