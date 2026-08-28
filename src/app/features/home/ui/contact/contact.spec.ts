import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ContactSubmissionService } from '../../../../core/contact/contact-submission.service';
import Contact from './contact';

const translations = {
  contact: {
    heading: 'CONTACT',
    initializing: '> initializing contact module ...',
    fields: {
      name: 'name:',
      email: 'email:',
      message: 'message:',
    },
    actions: {
      send: '> send',
    },
    validation: {
      nameRequired: 'Name is required.',
      nameTooLong: 'Name must be 80 characters or fewer.',
      emailRequired: 'Email is required.',
      emailInvalid: 'Enter a valid email address.',
      emailTooLong: 'Email must be 254 characters or fewer.',
      messageRequired: 'Message is required.',
      messageTooLong: 'Message must be 2,000 characters or fewer.',
    },
    status: {
      submitting: 'Sending...',
      success: 'Message sent successfully.',
      error: 'The message could not be sent. Please try again.',
      cooldown: 'Wait {{seconds}} seconds before sending again.',
    },
  },
};

const esTranslations = {
  contact: {
    heading: 'CONTACTO',
    initializing: '> inicializando modulo de contacto ...',
    fields: {
      name: 'nombre:',
      email: 'correo:',
      message: 'mensaje:',
    },
    actions: {
      send: '> enviar',
    },
    validation: {
      nameRequired: 'El nombre es obligatorio.',
      nameTooLong: 'El nombre debe tener 80 caracteres o menos.',
      emailRequired: 'El correo es obligatorio.',
      emailInvalid: 'Introduce un correo valido.',
      emailTooLong: 'El correo debe tener 254 caracteres o menos.',
      messageRequired: 'El mensaje es obligatorio.',
      messageTooLong: 'El mensaje debe tener 2.000 caracteres o menos.',
    },
    status: {
      submitting: 'Enviando...',
      success: 'Mensaje enviado correctamente.',
      error: 'No se pudo enviar el mensaje. Intentalo de nuevo.',
      cooldown: 'Espera {{seconds}} segundos antes de volver a enviar.',
    },
  },
};

async function configureContactTest(submitMock: ReturnType<typeof vi.fn>) {
  TestBed.resetTestingModule();
  await TestBed.configureTestingModule({
    imports: [Contact],
    providers: [
      provideTranslateService({ fallbackLang: 'en' }),
      {
        provide: ContactSubmissionService,
        useValue: { submit: submitMock },
      },
    ],
  }).compileComponents();

  const translate = TestBed.inject(TranslateService);
  translate.setTranslation('en', translations);
  translate.setTranslation('es', esTranslations);
  await firstValueFrom(translate.use('en'));
}

describe('Contact', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [Contact],
      providers: [
        provideTranslateService({ fallbackLang: 'en' }),
        {
          provide: ContactSubmissionService,
          useValue: { submit: vi.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', translations);
    translate.setTranslation('es', esTranslations);
    await firstValueFrom(translate.use('en'));
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Contact);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the heading, initialization line and three fields', async () => {
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('CONTACT');
    expect(element.textContent).toContain('initializing contact module');
    expect(element.querySelectorAll('label').length).toBe(3);
    expect(element.querySelector('input[type="text"]')).toBeTruthy();
    expect(element.querySelector('input[type="email"]')).toBeTruthy();
    expect(element.querySelector('textarea')).toBeTruthy();
    expect(element.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should expose the expected visual hooks', async () => {
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.contact')).toBeTruthy();
    expect(element.querySelector('.contact__inner')).toBeTruthy();
    expect(element.querySelector('.contact__heading')).toBeTruthy();
    expect(element.querySelector('.contact__rule')).toBeTruthy();
    expect(element.querySelector('.contact__form')).toBeTruthy();
    expect(element.querySelector('.contact__field')).toBeTruthy();
    expect(element.querySelector('.contact__submit')).toBeTruthy();
    expect(element.querySelector('#contact-title')).toBeTruthy();
  });

  it('should use section with aria-labelledby pointing to h2', async () => {
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();

    const section = fixture.nativeElement.querySelector('section');
    const heading = fixture.nativeElement.querySelector('h2');
    expect(section.getAttribute('aria-labelledby')).toBe(heading.id);
    expect(heading.id).toBe('contact-title');
  });

  it('should keep label for/id association and autocomplete', async () => {
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();

    const nameInput = fixture.nativeElement.querySelector('#contact-name') as HTMLInputElement;
    const emailInput = fixture.nativeElement.querySelector('#contact-email') as HTMLInputElement;
    const messageTextarea = fixture.nativeElement.querySelector(
      '#contact-message',
    ) as HTMLTextAreaElement;

    expect(fixture.nativeElement.querySelector('label[for="contact-name"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('label[for="contact-email"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('label[for="contact-message"]')).toBeTruthy();
    expect(nameInput.autocomplete).toBe('name');
    expect(emailInput.autocomplete).toBe('email');
    expect(emailInput.type).toBe('email');
    expect(messageTextarea).toBeTruthy();
  });

  it('should switch heading and labels to Spanish', async () => {
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();

    const translate = TestBed.inject(TranslateService);
    await firstValueFrom(translate.use('es'));
    fixture.detectChanges();
    await fixture.whenStable();

    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('CONTACTO');
    expect(element.textContent).toContain('inicializando modulo de contacto');
    expect(element.textContent).toContain('nombre:');
    expect(element.textContent).toContain('correo:');
    expect(element.textContent).toContain('mensaje:');
  });

  it('should not submit an invalid form and show validation', async () => {
    const submit = vi.fn().mockResolvedValue(undefined);
    await configureContactTest(submit);

    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();

    await fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(submit).not.toHaveBeenCalled();
    expect(fixture.componentInstance.form.invalid).toBe(true);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('[role="alert"]').length).toBeGreaterThan(0);
    fixture.destroy();
  });

  it('should show required and email format validation keys', async () => {
    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();

    const instance = fixture.componentInstance;
    instance.form.controls.name.setValue('');
    instance.form.controls.name.markAsTouched();
    instance.form.controls.email.setValue('invalid');
    instance.form.controls.email.markAsTouched();
    instance.form.controls.message.setValue('   ');
    instance.form.controls.message.markAsTouched();
    fixture.detectChanges();

    expect(instance.validationKey(instance.form.controls.name, 'name')).toBe(
      'contact.validation.nameRequired',
    );
    expect(instance.validationKey(instance.form.controls.email, 'email')).toBe(
      'contact.validation.emailInvalid',
    );
    expect(instance.validationKey(instance.form.controls.message, 'message')).toBe(
      'contact.validation.messageRequired',
    );

    instance.form.controls.name.setValue('a'.repeat(81));
    expect(instance.validationKey(instance.form.controls.name, 'name')).toBe(
      'contact.validation.nameTooLong',
    );
  });

  it('should submit normalized valid values and show success', async () => {
    const submit = vi.fn().mockResolvedValue(undefined);
    await configureContactTest(submit);

    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.form.setValue({
      name: ' Ana Example ',
      email: ' ANA@EXAMPLE.COM ',
      message: ' Hello from the form ',
    });
    fixture.detectChanges();

    await fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledWith({
      name: 'Ana Example',
      email: 'ana@example.com',
      message: 'Hello from the form',
    });
    expect(fixture.componentInstance.submitState()).toBe('success');
    expect(fixture.nativeElement.textContent).toContain('Message sent successfully');
    fixture.destroy();
  });

  it('should block submission during the cooldown', async () => {
    localStorage.setItem('contact.lastSubmissionAt', String(Date.now()));
    const submit = vi.fn().mockResolvedValue(undefined);
    await configureContactTest(submit);

    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();

    fixture.componentInstance.form.setValue({
      name: 'Ana Example',
      email: 'ana@example.com',
      message: 'Hello',
    });
    fixture.detectChanges();

    await fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(submit).not.toHaveBeenCalled();
    expect(fixture.componentInstance.cooldownRemaining()).toBeGreaterThan(0);
    expect(fixture.nativeElement.textContent).toContain('Wait');
    fixture.destroy();
  });

  it('should persist cooldown and restore it on init', async () => {
    const submit = vi.fn().mockResolvedValue(undefined);
    await configureContactTest(submit);

    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();

    fixture.componentInstance.form.setValue({
      name: 'Ana Example',
      email: 'ana@example.com',
      message: 'Hello',
    });

    await fixture.componentInstance.submit();
    fixture.detectChanges();

    expect(localStorage.getItem('contact.lastSubmissionAt')).toBeTruthy();
    expect(fixture.componentInstance.cooldownRemaining()).toBeGreaterThan(0);

    const fixture2 = TestBed.createComponent(Contact);
    fixture2.detectChanges();

    expect(fixture2.componentInstance.cooldownRemaining()).toBeGreaterThan(0);
    fixture.destroy();
    fixture2.destroy();
  });

  it('should handle submit errors and show error state', async () => {
    const submit = vi.fn().mockRejectedValue(new Error('network'));
    await configureContactTest(submit);

    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();

    fixture.componentInstance.form.setValue({
      name: 'Ana Example',
      email: 'ana@example.com',
      message: 'Hello',
    });

    await fixture.componentInstance.submit();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.submitState()).toBe('error');
    expect(fixture.nativeElement.textContent).toContain('could not be sent');
    fixture.destroy();
  });

  it('should disable submit button when invalid, submitting or cooling down', async () => {
    const submit = vi.fn().mockImplementation(() => new Promise(() => {}));
    await configureContactTest(submit);

    const fixture = TestBed.createComponent(Contact);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector(
      'button[type="submit"]',
    ) as HTMLButtonElement;
    expect(button.disabled).toBe(true);

    fixture.componentInstance.form.setValue({
      name: 'Ana Example',
      email: 'ana@example.com',
      message: 'Hello',
    });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(button.disabled).toBe(false);

    const submitPromise = fixture.componentInstance.submit();
    fixture.detectChanges();
    expect(fixture.componentInstance.submitState()).toBe('submitting');
    expect(button.disabled).toBe(true);

    // Prevent hanging by resetting state
    (fixture.componentInstance.submitState as unknown as { set: (v: string) => void }).set('idle');
    // Avoid unhandled promise
    void submitPromise.catch(() => {});
    fixture.destroy();
  });
});
