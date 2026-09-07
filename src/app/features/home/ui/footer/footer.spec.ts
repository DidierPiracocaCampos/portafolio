import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import Footer from './footer';

const enTranslations = {
  footer: {
    navLabel: 'Contact links',
    emailLabel: "Send email to piracocadidier@gmail.com",
    githubLabel: "View Didier's GitHub",
    linkedinLabel: "View Didier's LinkedIn",
    rights: 'All rights reserved.',
    builtWith: 'Built with Angular',
  },
};

const esTranslations = {
  footer: {
    navLabel: 'Enlaces de contacto',
    emailLabel: 'Enviar correo a piracocadidier@gmail.com',
    githubLabel: 'Ver GitHub de Didier',
    linkedinLabel: 'Ver LinkedIn de Didier',
    rights: 'Todos los derechos reservados.',
    builtWith: 'Hecho con Angular',
  },
};

async function setupTranslate(): Promise<void> {
  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', enTranslations);
  translate.setTranslation('es', esTranslations);
  await firstValueFrom(translate.use('en'));
}

describe('Footer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();
    await setupTranslate();
  });

  it('should render footer with daisyUI center layout', async () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    await fixture.whenStable();

    const footer = fixture.nativeElement.querySelector('footer') as HTMLElement;
    expect(footer).toBeTruthy();
    expect(footer.classList.contains('footer')).toBe(true);
    expect(footer.classList.contains('footer-center')).toBe(true);
  });

  it('should render the three contact links with correct hrefs', async () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    await fixture.whenStable();

    const links = fixture.nativeElement.querySelectorAll(
      '.footer__link',
    ) as NodeListOf<HTMLAnchorElement>;
    expect(links.length).toBe(3);

    expect(links[0].getAttribute('href')).toBe('mailto:piracocadidier@gmail.com');
    expect(links[0].textContent).toContain('piracocadidier@gmail.com');

    expect(links[1].getAttribute('href')).toBe('https://github.com/DidierPiracocaCampos');
    expect(links[2].getAttribute('href')).toBe(
      'https://www.linkedin.com/in/didier-estiben-piracoca-campos-460828216/',
    );
  });

  it('should open external links in new tab with noopener and keep mailto internal', async () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    await fixture.whenStable();

    const links = fixture.nativeElement.querySelectorAll(
      '.footer__link',
    ) as NodeListOf<HTMLAnchorElement>;

    // email: no target _blank
    expect(links[0].getAttribute('target')).toBeFalsy();

    // github + linkedin: _blank + noopener
    expect(links[1].getAttribute('target')).toBe('_blank');
    expect(links[1].getAttribute('rel')).toContain('noopener');
    expect(links[2].getAttribute('target')).toBe('_blank');
    expect(links[2].getAttribute('rel')).toContain('noopener');
  });

  it('should expose accessible labels and hide icons from assistive tech', async () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    await fixture.whenStable();

    const nav = fixture.nativeElement.querySelector('nav.footer__links') as HTMLElement;
    expect(nav.getAttribute('aria-label')).toBe('Contact links');

    const links = fixture.nativeElement.querySelectorAll(
      '.footer__link',
    ) as NodeListOf<HTMLElement>;
    expect(links[0].getAttribute('aria-label')).toBe(
      'Send email to piracocadidier@gmail.com',
    );
    expect(links[1].getAttribute('aria-label')).toBe("View Didier's GitHub");
    expect(links[2].getAttribute('aria-label')).toBe("View Didier's LinkedIn");

    const svgs = fixture.nativeElement.querySelectorAll('.footer__link svg');
    expect(svgs.length).toBe(3);
    svgs.forEach((svg: Element) => {
      expect(svg.getAttribute('aria-hidden')).toBe('true');
    });
  });

  it('should render copyright and built-with line', async () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('© 2026 Didier Piracoca');
    expect(el.textContent).toContain('All rights reserved.');
    expect(el.textContent).toContain('Built with Angular');
  });

  it('should switch nav label and copyright to Spanish', async () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();
    await fixture.whenStable();

    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();

    const nav = fixture.nativeElement.querySelector('nav.footer__links') as HTMLElement;
    expect(nav.getAttribute('aria-label')).toBe('Enlaces de contacto');
    expect(fixture.nativeElement.textContent).toContain('Todos los derechos reservados.');
    expect(fixture.nativeElement.textContent).toContain('Hecho con Angular');
  });
});
