import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

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

  private hasCompleted = false;

  constructor() {
    effect(() => {
      if (this.animationStarted() && this.reduceMotion()) {
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

  private reduceMotion(): boolean {
    return (
      typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }
}
