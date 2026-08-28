import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import SectionTitle from '../../../../shared/ui/section-title/section-title';

type ExperienceEntry = {
  readonly id: 'axpe' | 'education';
  readonly periodKey: string;
  readonly companyKey?: string;
  readonly roleKey?: string;
  readonly titleKey?: string;
  readonly itemKeys: readonly string[];
};

const EXPERIENCE_ENTRIES: readonly ExperienceEntry[] = [
  {
    id: 'axpe',
    periodKey: 'experience.entries.axpe.period',
    companyKey: 'experience.entries.axpe.company',
    roleKey: 'experience.entries.axpe.role',
    itemKeys: [
      'experience.entries.axpe.items.0',
      'experience.entries.axpe.items.1',
      'experience.entries.axpe.items.2',
      'experience.entries.axpe.items.3',
    ],
  },
  {
    id: 'education',
    periodKey: 'experience.entries.education.period',
    titleKey: 'experience.entries.education.title',
    itemKeys: [
      'experience.entries.education.items.0',
      'experience.entries.education.items.1',
      'experience.entries.education.items.2',
    ],
  },
];

@Component({
  selector: 'app-experience',
  imports: [TranslatePipe, SectionTitle],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Experience {
  readonly entries = EXPERIENCE_ENTRIES;
}
