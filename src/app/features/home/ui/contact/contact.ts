import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ContactSubmissionService } from '../../../../core/contact/contact-submission.service';

const COOLDOWN_MS = 60_000;
const COOLDOWN_STORAGE_KEY = 'contact.lastSubmissionAt';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const nonBlankValidator: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.trim().length > 0 ? null : { blank: true };

const trimmedEmailValidator: ValidatorFn = (control) => {
  const value = typeof control.value === 'string' ? control.value.trim() : '';
  if (value.length === 0) {
    return null;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(value) ? null : { email: true };
};

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Contact implements OnInit {
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly submissionService = inject(ContactSubmissionService);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.formBuilder.group({
    name: ['', [Validators.required, nonBlankValidator, Validators.maxLength(80)]],
    email: [
      '',
      [Validators.required, nonBlankValidator, trimmedEmailValidator, Validators.maxLength(254)],
    ],
    message: ['', [Validators.required, nonBlankValidator, Validators.maxLength(2000)]],
  });

  readonly submitState = signal<SubmitState>('idle');
  readonly cooldownRemaining = signal(0);

  private cooldownTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.stopCooldown());
  }

  ngOnInit(): void {
    this.restoreCooldown();
  }

  async submit(): Promise<void> {
    if (this.submitState() === 'submitting' || this.cooldownRemaining() > 0) {
      return;
    }

    this.form.markAllAsTouched();

    if (this.form.invalid) {
      return;
    }

    const raw = this.form.getRawValue();

    this.submitState.set('submitting');

    try {
      await this.submissionService.submit({
        name: raw.name.trim(),
        email: raw.email.trim().toLowerCase(),
        message: raw.message.trim(),
      });

      this.form.reset();
      this.persistLastSubmission();
      this.submitState.set('success');
    } catch {
      this.submitState.set('error');
    }
  }

  isInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.touched || control.dirty);
  }

  validationKey(control: AbstractControl, field: 'name' | 'email' | 'message'): string {
    if (control.hasError('required') || control.hasError('blank')) {
      return `contact.validation.${field}Required`;
    }

    if (field === 'email' && control.hasError('email')) {
      return 'contact.validation.emailInvalid';
    }

    return `contact.validation.${field}TooLong`;
  }

  private persistLastSubmission(): void {
    try {
      globalThis.localStorage.setItem(COOLDOWN_STORAGE_KEY, String(Date.now()));
    } catch {
      // localStorage can be unavailable in private browsing contexts.
    }

    this.setCooldownUntil(Date.now() + COOLDOWN_MS);
  }

  private restoreCooldown(): void {
    try {
      const raw = globalThis.localStorage.getItem(COOLDOWN_STORAGE_KEY);
      const lastSubmissionAt = Number(raw);

      if (Number.isFinite(lastSubmissionAt)) {
        const cooldownUntil = lastSubmissionAt + COOLDOWN_MS;

        if (cooldownUntil > Date.now()) {
          this.setCooldownUntil(cooldownUntil);
        }
      }
    } catch {
      // Continue without browser persistence when localStorage is unavailable.
    }
  }

  private setCooldownUntil(cooldownUntil: number): void {
    this.stopCooldown();

    const update = (): void => {
      const remainingMs = Math.max(0, cooldownUntil - Date.now());
      const remainingSeconds = Math.ceil(remainingMs / 1000);

      this.cooldownRemaining.set(remainingSeconds);

      if (remainingSeconds === 0) {
        this.stopCooldown();
      }
    };

    update();

    if (this.cooldownRemaining() > 0) {
      this.cooldownTimer = setInterval(update, 1000);
    }
  }

  private stopCooldown(): void {
    if (this.cooldownTimer !== null) {
      clearInterval(this.cooldownTimer);
      this.cooldownTimer = null;
    }
  }
}
