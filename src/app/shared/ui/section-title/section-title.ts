import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-section-title',
  templateUrl: './section-title.html',
  styleUrl: './section-title.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SectionTitle {
  readonly title = input.required<string>();
  readonly headingId = input<string>();
  readonly level = input<'h2' | 'h3'>('h2');
}
