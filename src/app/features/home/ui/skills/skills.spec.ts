import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import Skills from './skills';

const enTranslations = {
  skills: {
    heading: 'SKILLS',
    groups: {
      frontend: {
        heading: 'Frontend',
        items: {
          angular: 'Angular',
          tailwind: 'TailwindCSS',
          bootstrap: 'Bootstrap',
        },
      },
      backend: {
        heading: 'Backend',
        items: {
          java: 'Java',
          spring: 'Spring',
        },
      },
      tools: {
        heading: 'Tools',
        items: {
          git: 'Git',
          gitlab: 'GitLab',
          github: 'GitHub',
          vsCode: 'VS Code',
          eclipse: 'Eclipse',
          opencode: 'OpenCode',
          figma: 'Figma',
        },
      },
      database: {
        heading: 'Database',
        items: {
          firebase: 'Firebase',
          oracleDb: 'OracleDB',
          sql: 'SQL',
        },
      },
      mobile: {
        heading: 'Mobile',
        items: {
          androidStudio: 'Android Studio',
          ionic: 'Ionic',
          cordova: 'Cordova',
        },
      },
    },
  },
};

const esTranslations = {
  skills: {
    heading: 'HABILIDADES',
    groups: {
      frontend: {
        heading: 'Frontend',
        items: {
          angular: 'Angular',
          tailwind: 'TailwindCSS',
          bootstrap: 'Bootstrap',
        },
      },
      backend: {
        heading: 'Backend',
        items: {
          java: 'Java',
          spring: 'Spring',
        },
      },
      tools: {
        heading: 'Herramientas',
        items: {
          git: 'Git',
          gitlab: 'GitLab',
          github: 'GitHub',
          vsCode: 'VS Code',
          eclipse: 'Eclipse',
          opencode: 'OpenCode',
          figma: 'Figma',
        },
      },
      database: {
        heading: 'Base de datos',
        items: {
          firebase: 'Firebase',
          oracleDb: 'OracleDB',
          sql: 'SQL',
        },
      },
      mobile: {
        heading: 'Móvil',
        items: {
          androidStudio: 'Android Studio',
          ionic: 'Ionic',
          cordova: 'Cordova',
        },
      },
    },
  },
};

async function setupTranslate(): Promise<void> {
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', enTranslations);
  translate.setTranslation('es', esTranslations);
  await firstValueFrom(translate.use('en'));
}

describe('Skills', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skills],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();
    await setupTranslate();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Skills);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should expose five groups in the expected order', () => {
    const fixture = TestBed.createComponent(Skills);
    expect(fixture.componentInstance.groups.map((group) => group.id)).toEqual([
      'frontend',
      'backend',
      'tools',
      'database',
      'mobile',
    ]);
  });

  it('should use section with aria-labelledby pointing to h2', async () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    await fixture.whenStable();
    const section = fixture.nativeElement.querySelector('section');
    const heading = fixture.nativeElement.querySelector('h2');
    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.id).toBe('skills-title');
    expect(heading.textContent.trim()).toBe('SKILLS');
  });

  it('should render five articles with correct headings and item counts', async () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    await fixture.whenStable();

    const articles = fixture.nativeElement.querySelectorAll('article.skills__group');
    expect(articles.length).toBe(5);

    const headings = Array.from(articles).map((article) =>
      (article as HTMLElement).querySelector('h3')?.textContent?.trim(),
    );
    expect(headings).toEqual(['Frontend', 'Backend', 'Tools', 'Database', 'Mobile']);

    const counts = Array.from(articles).map(
      (article) => (article as HTMLElement).querySelectorAll('ul.skills__items li').length,
    );
    expect(counts).toEqual([3, 2, 5, 3, 2]);
  });

  it('should keep a single li for Git / GitLab / GitHub with three icons and separators', async () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    await fixture.whenStable();

    const toolsArticle = fixture.nativeElement.querySelectorAll(
      'article.skills__group',
    )[2] as HTMLElement;
    const gitItem = toolsArticle.querySelectorAll('ul.skills__items li')[0] as HTMLElement;

    expect(gitItem.textContent).toContain('Git');
    expect(gitItem.textContent).toContain('GitLab');
    expect(gitItem.textContent).toContain('GitHub');
    expect(gitItem.querySelectorAll('svg.skills__icon').length).toBe(3);
    expect(gitItem.querySelectorAll('.skills__separator').length).toBe(2);
    expect(
      Array.from(gitItem.querySelectorAll('.skills__separator')).map((el) =>
        el.textContent?.trim(),
      ),
    ).toEqual(['/', '/']);
  });

  it('should keep a single li for Ionic + Cordova with two icons and plus separator', async () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    await fixture.whenStable();

    const mobileArticle = fixture.nativeElement.querySelectorAll(
      'article.skills__group',
    )[4] as HTMLElement;
    const ionicItem = mobileArticle.querySelectorAll('ul.skills__items li')[1] as HTMLElement;

    expect(ionicItem.textContent).toContain('Ionic');
    expect(ionicItem.textContent).toContain('Cordova');
    expect(ionicItem.querySelectorAll('svg.skills__icon').length).toBe(2);
    expect(ionicItem.querySelector('.skills__separator')?.textContent?.trim()).toBe('+');
  });

  it('should render 18 decorative svg icons before each technology name', async () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    await fixture.whenStable();

    const icons = fixture.nativeElement.querySelectorAll('svg.skills__icon');
    expect(icons.length).toBe(18);

    icons.forEach((icon: Element) => {
      expect(icon.getAttribute('aria-hidden')).toBe('true');
      expect(icon.getAttribute('focusable')).toBe('false');
    });

    // First technology should have icon before text
    const firstLabel = fixture.nativeElement.querySelector('.skills__label') as HTMLElement;
    expect(firstLabel.querySelector('svg')).toBeTruthy();
    expect(firstLabel.textContent?.trim()).toBe('Angular');
  });

  it('should render semantic lists with square markers and expected copy', async () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    await fixture.whenStable();

    const items = Array.from(fixture.nativeElement.querySelectorAll('.skills__items li')).map(
      (el) => (el as HTMLElement).textContent?.replace(/\s+/g, ' ').trim(),
    );

    expect(items).toEqual([
      'Angular',
      'TailwindCSS',
      'Bootstrap',
      'Java',
      'Spring',
      'Git / GitLab / GitHub',
      'VS Code',
      'Eclipse',
      'OpenCode',
      'Figma',
      'Firebase',
      'OracleDB',
      'SQL',
      'Android Studio',
      'Ionic + Cordova',
    ]);
  });

  it('should switch heading and group headings to Spanish', async () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    await fixture.whenStable();

    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('h2')?.textContent?.trim()).toBe('HABILIDADES');

    const headings = Array.from(
      fixture.nativeElement.querySelectorAll('article.skills__group h3'),
    ).map((el) => (el as HTMLElement).textContent?.trim());
    expect(headings).toEqual(['Frontend', 'Backend', 'Herramientas', 'Base de datos', 'Móvil']);
  });

  it('should expose BEM classes for visual grid', async () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.skills')).toBeTruthy();
    expect(el.querySelector('.skills__inner')).toBeTruthy();
    expect(el.querySelector('app-section-title')).toBeTruthy();
    expect(el.querySelector('.section-title')).toBeTruthy();
    expect(el.querySelector('.section-title__heading')).toBeTruthy();
    expect(el.querySelector('.skills__grid')).toBeTruthy();
    expect(el.querySelector('.skills__group')).toBeTruthy();
    expect(el.querySelector('.skills__items')).toBeTruthy();
    expect(el.querySelector('.skills__icon')).toBeTruthy();
  });

  it('should keep technology names as text not inside svg', async () => {
    const fixture = TestBed.createComponent(Skills);
    fixture.detectChanges();
    await fixture.whenStable();

    const svgs = fixture.nativeElement.querySelectorAll('svg.skills__icon');
    svgs.forEach((svg: Element) => {
      expect(svg.textContent?.trim()).toBe('');
    });

    expect(fixture.nativeElement.textContent).toContain('Angular');
    expect(fixture.nativeElement.textContent).toContain('OpenCode');
  });
});
