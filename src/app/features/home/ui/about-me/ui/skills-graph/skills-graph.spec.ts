import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import SkillsGraph from './skills-graph';
import { SKILL_EDGES, SKILL_NODES } from '../../models/skills-graph';

const enTranslations = {
  aboutMe: {
    skills: {
      title: '// skills',
      command: 'skills --graph --live',
      hint: 'drag nodes • hover to see connections',
      swipe: 'swipe ↔ to explore',
      reset: 'reset positions',
      nodes: 'nodes',
      label: 'Skills graph',
    },
  },
};

const esTranslations = {
  aboutMe: {
    skills: {
      title: '// skills',
      command: 'skills --graph --live',
      hint: 'arrastra los nodos • pasa el cursor para ver conexiones',
      swipe: 'desliza ↔ para explorar',
      reset: 'restablecer posiciones',
      nodes: 'nodos',
      label: 'Grafo de habilidades',
    },
  },
};

async function setupTranslate(): Promise<void> {
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', enTranslations);
  translate.setTranslation('es', esTranslations);
  await firstValueFrom(translate.use('en'));
}

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

describe('SkillsGraph', () => {
  beforeEach(async () => {
    stubMatchMedia(false);
    await TestBed.configureTestingModule({
      imports: [SkillsGraph],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();
    await setupTranslate();
  });

  it('should expose 20 stable nodes with icons under /icons/', () => {
    expect(SKILL_NODES.length).toBe(20);
    const ids = SKILL_NODES.map((n) => n.id);
    expect(new Set(ids).size).toBe(20);
    for (const node of SKILL_NODES) {
      expect(node.icon.startsWith('/icons/')).toBe(true);
      expect(node.icon.endsWith('.svg')).toBe(true);
    }
  });

  it('should expose edges that only reference existing nodes', () => {
    const ids = new Set(SKILL_NODES.map((n) => n.id));
    expect(SKILL_EDGES.length).toBeGreaterThan(20);
    for (const edge of SKILL_EDGES) {
      expect(ids.has(edge.from)).toBe(true);
      expect(ids.has(edge.to)).toBe(true);
      expect(edge.from).not.toBe(edge.to);
    }
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SkillsGraph);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render bare graph with title, svg and all nodes', async () => {
    const fixture = TestBed.createComponent(SkillsGraph);
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.skills-graph')).toBeTruthy();
    expect(el.querySelector('.skills-graph__window')).toBeNull();
    expect(el.querySelector('.skills-graph__cmd')).toBeNull();
    expect(el.querySelector('.skills-graph__title')?.textContent?.trim()).toBe('// skills');
    expect(el.querySelector('.skills-graph__rain')).toBeNull();
    expect(el.querySelector('.skills-graph__scroll')).toBeTruthy();
    expect(el.querySelector('.skills-graph__hint-swipe')?.textContent).toContain(
      'swipe ↔ to explore',
    );
    const svg = el.querySelector('svg.skills-graph__canvas');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('role')).toBe('img');
    expect(el.querySelectorAll('.skills-graph__node').length).toBe(20);
    expect(el.querySelectorAll('.skills-graph__edge').length).toBe(SKILL_EDGES.length);
    expect(el.querySelector('.skills-graph__reset')?.textContent).toContain('reset positions');
  });

  it('should render sr-only list with every skill for a11y/SEO', async () => {
    const fixture = TestBed.createComponent(SkillsGraph);
    fixture.detectChanges();
    await fixture.whenStable();
    const items = fixture.nativeElement.querySelectorAll('.sr-only li');
    expect(items.length).toBe(20);
  });

  it('should highlight connected edges on hover and dim the rest', async () => {
    const fixture = TestBed.createComponent(SkillsGraph);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.hover('angular');
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const active = el.querySelectorAll('.skills-graph__edge--active');
    expect(active.length).toBeGreaterThan(0);
    expect(el.querySelector('.skills-graph__node--hot')).toBeTruthy();
    fixture.componentInstance.hover(null);
    fixture.detectChanges();
    expect(el.querySelector('.skills-graph__edge--active')).toBeNull();
  });

  it('should move node on drag and restore homes on reset', async () => {
    const fixture = TestBed.createComponent(SkillsGraph);
    fixture.detectChanges();
    await fixture.whenStable();
    const cmp = fixture.componentInstance;
    const before = cmp.position('angular');
    cmp.moveNode('angular', 40, -30);
    fixture.detectChanges();
    const after = cmp.position('angular');
    expect(after.x).toBe(before.x + 40);
    expect(after.y).toBe(before.y - 30);
    cmp.resetPositions();
    fixture.detectChanges();
    expect(cmp.position('angular')).toEqual(before);
  });

  it('should move focused node with arrow keys', async () => {
    const fixture = TestBed.createComponent(SkillsGraph);
    fixture.detectChanges();
    await fixture.whenStable();
    const cmp = fixture.componentInstance;
    const before = cmp.position('git');
    const el = fixture.nativeElement as HTMLElement;
    const git = el.querySelector('[data-node="git"]') as HTMLElement;
    git.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true, cancelable: true }),
    );
    fixture.detectChanges();
    expect(cmp.position('git').x).toBeGreaterThan(before.x);
  });

  it('should reveal immediately when reduced motion is preferred', async () => {
    stubMatchMedia(true);
    const fixture = TestBed.createComponent(SkillsGraph);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      (fixture.nativeElement as HTMLElement).querySelector('.skills-graph--visible'),
    ).toBeTruthy();
  });

  it('should translate hint and reset to Spanish', async () => {
    const fixture = TestBed.createComponent(SkillsGraph);
    fixture.detectChanges();
    await fixture.whenStable();
    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.skills-graph__hint')?.textContent).toContain('arrastra los nodos');
    expect(el.querySelector('.skills-graph__reset')?.textContent).toContain('restablecer');
  });
});
