import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import SectionTitle from '../../../../shared/ui/section-title/section-title';

type AboutMeEntry = {
  readonly id: 'axpe' | 'education';
  readonly periodKey: string;
  readonly companyKey?: string;
  readonly roleKey?: string;
  readonly titleKey?: string;
  readonly itemKeys: readonly string[];
};

const ABOUT_ME_ENTRIES: readonly AboutMeEntry[] = [
  {
    id: 'axpe',
    periodKey: 'aboutMe.entries.axpe.period',
    companyKey: 'aboutMe.entries.axpe.company',
    roleKey: 'aboutMe.entries.axpe.role',
    itemKeys: [
      'aboutMe.entries.axpe.items.0',
      'aboutMe.entries.axpe.items.1',
      'aboutMe.entries.axpe.items.2',
      'aboutMe.entries.axpe.items.3',
    ],
  },
  {
    id: 'education',
    periodKey: 'aboutMe.entries.education.period',
    titleKey: 'aboutMe.entries.education.title',
    itemKeys: [
      'aboutMe.entries.education.items.0',
      'aboutMe.entries.education.items.1',
      'aboutMe.entries.education.items.2',
    ],
  },
];

@Component({
  selector: 'app-about-me',
  imports: [TranslatePipe, SectionTitle],
  templateUrl: './about-me.html',
  styleUrl: './about-me.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutMe {
  readonly entries = ABOUT_ME_ENTRIES;
}
