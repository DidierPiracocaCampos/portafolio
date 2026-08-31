import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

const BANNER_URL = 'banner.txt';

function normalizeBanner(raw: string): string {
  return raw.replace(/\r\n/g, '\n');
}

function trimEmptyEdges(raw: string): string {
  const lines = raw.split('\n');
  let start = 0;
  let end = lines.length;
  while (start < end && lines[start]?.trim() === '') {
    start++;
  }
  while (end > start && lines[end - 1]?.trim() === '') {
    end--;
  }
  return lines.slice(start, end).join('\n');
}

@Component({
  selector: 'app-presentation',
  imports: [TranslatePipe],
  templateUrl: './presentation.html',
  styleUrl: './presentation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Presentation {
  readonly animationStarted = input(false);
  readonly animationCompleted = output<void>();

  readonly portraitText = signal('');
  readonly portraitVisible = signal(false);

  private hasCompleted = false;
  private readonly platformId = inject(PLATFORM_ID);
  private readonly http = inject(HttpClient);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.http.get(BANNER_URL, { responseType: 'text' }).subscribe({
        next: (raw) => {
          try {
            const normalized = normalizeBanner(raw);
            this.portraitText.set(trimEmptyEdges(normalized));
          } catch {
            this.portraitVisible.set(false);
          }
        },
        error: () => {
          this.portraitVisible.set(false);
        },
      });
    }

    effect(() => {
      const animationStarted = this.animationStarted();
      const bannerLoaded = this.portraitText() !== '';
      if (animationStarted && bannerLoaded) {
        if (!isPlatformBrowser(this.platformId)) {
          this.portraitVisible.set(true);
          return;
        }
        const reducedMotion =
          typeof window.matchMedia === 'function' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion) {
          this.portraitVisible.set(true);
          return;
        }
        window.setTimeout(() => {
          if (this.animationStarted() && this.portraitText() !== '') {
            this.portraitVisible.set(true);
          }
        }, 2050);
      }
    });

    effect(() => {
      const isBrowser =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (this.animationStarted() && isBrowser) {
        this.emitCompleted();
      }
    });
  }

  onDescriptionAnimationEnd(event: AnimationEvent): void {
    if (!this.animationStarted() || event.target !== event.currentTarget) {
      return;
    }
    this.emitCompleted();
  }

  private emitCompleted(): void {
    if (this.hasCompleted) {
      return;
    }
    this.hasCompleted = true;
    this.animationCompleted.emit();
  }
}
