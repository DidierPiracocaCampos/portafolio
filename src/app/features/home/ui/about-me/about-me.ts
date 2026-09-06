import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import SectionTitle from '../../../../shared/ui/section-title/section-title';
import AboutEntryCard from './ui/about-entry-card/about-entry-card';
import { ABOUT_ME_ENTRIES } from './models/about-me-entry';

@Component({
  selector: 'app-about-me',
  imports: [TranslatePipe, SectionTitle, AboutEntryCard],
  templateUrl: './about-me.html',
  styleUrl: './about-me.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutMe {
  readonly entries = ABOUT_ME_ENTRIES;
  readonly photoSrc = '/images/about-me/photo-me.jpg';
  readonly selectedId = signal<string>('axpe');
  readonly selectedEntry = computed(
    () => this.entries.find((e) => e.id === this.selectedId()) ?? this.entries[0],
  );

  select(id: string): void {
    if (this.selectedId() !== id) {
      this.selectedId.set(id);
    }
  }

  isActive(id: string): boolean {
    return this.selectedId() === id;
  }

  nodeLeft(index: number): number {
    if (index <= 0) return 0;
    if (index === 1) return 30;
    const total = this.entries.length;
    if (total <= 2) return 30;
    const spread = 45 / (total - 1);
    return Math.min(75, 30 + (index - 1) * spread);
  }
}
