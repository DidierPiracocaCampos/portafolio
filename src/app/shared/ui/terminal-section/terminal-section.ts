import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateService } from '@ngx-translate/core';

const TYPE_DELAY_MS = 42;
const typeDelay = () => TYPE_DELAY_MS + Math.random() * 30;

const USER = 'Didier';
const PATH = 'C:/proyects/portafolio';
const BRANCH = 'main';

@Component({
  selector: 'app-terminal-section',
  templateUrl: './terminal-section.html',
  styleUrl: './terminal-section.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TerminalSection implements OnInit {
  readonly sectionId = input.required<string>();
  readonly commandKey = input.required<string>();

  readonly user = USER;
  readonly path = PATH;
  readonly branch = BRANCH;

  readonly typed = signal('');
  readonly revealed = signal(false);

  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly translate = inject(TranslateService);
  private readonly destroyRef = inject(DestroyRef);

  private fullCommand = '';
  private observer: IntersectionObserver | null = null;
  private typeTimer: ReturnType<typeof setTimeout> | null = null;
  private started = false;

  ngOnInit(): void {
    this.observe();
  }

  private observe(): void {
    const target = this.host.nativeElement;

    if (typeof IntersectionObserver === 'undefined') {
      this.run();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.run();
            this.observer?.disconnect();
            break;
          }
        }
      },
      { threshold: 0.25 },
    );

    this.observer.observe(target);
  }

  private run(): void {
    if (this.started) {
      return;
    }
    this.started = true;

    if (this.reduceMotion()) {
      this.finish();
      return;
    }

    this.translate
      .get(this.commandKey())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((command) => {
        this.fullCommand = String(command);
        this.type(0);
      });
  }

  private type(index: number): void {
    if (index > this.fullCommand.length) {
      return;
    }
    this.typed.set(this.fullCommand.slice(0, index));
    if (index === this.fullCommand.length) {
      this.finish();
      return;
    }
    this.typeTimer = setTimeout(() => this.type(index + 1), typeDelay());
  }

  private finish(): void {
    this.typed.set(this.fullCommand || this.translate.instant(this.commandKey()));
    this.revealed.set(true);
  }

  private reduceMotion(): boolean {
    return (
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.observer = null;
    if (this.typeTimer !== null) {
      clearTimeout(this.typeTimer);
      this.typeTimer = null;
    }
  }
}
