import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import type { AboutMeEntry } from '../../models/about-me-entry';

@Component({
  selector: 'app-about-entry-card',
  imports: [TranslatePipe],
  templateUrl: './about-entry-card.html',
  styleUrl: './about-entry-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'about-me-card',
    '[class.about-me-card--active]': 'active()',
    '[class.about-me-card--inline]': "variant() === 'inline'",
    '[class.about-me-card--stack]': "variant() === 'stack'",
    '[attr.data-entry]': 'entry().id',
    '[attr.data-variant]': 'variant()',
  },
})
export default class AboutEntryCard {
  readonly entry = input.required<AboutMeEntry>();
  readonly variant = input<'stack' | 'inline'>('stack');
  readonly active = input(false);
}
