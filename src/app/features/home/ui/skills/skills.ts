import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import SectionTitle from '../../../../shared/ui/section-title/section-title';

type SkillItem = {
  readonly id: string;
  readonly labelKeys: readonly string[];
  readonly separator?: '/' | '+';
};

type SkillGroup = {
  readonly id: 'frontend' | 'backend' | 'tools' | 'database' | 'mobile';
  readonly headingKey: string;
  readonly items: readonly SkillItem[];
};

const SKILL_GROUPS: readonly SkillGroup[] = [
  {
    id: 'frontend',
    headingKey: 'skills.groups.frontend.heading',
    items: [
      { id: 'angular', labelKeys: ['skills.groups.frontend.items.angular'] },
      { id: 'tailwind', labelKeys: ['skills.groups.frontend.items.tailwind'] },
      { id: 'bootstrap', labelKeys: ['skills.groups.frontend.items.bootstrap'] },
    ],
  },
  {
    id: 'backend',
    headingKey: 'skills.groups.backend.heading',
    items: [
      { id: 'java', labelKeys: ['skills.groups.backend.items.java'] },
      { id: 'spring', labelKeys: ['skills.groups.backend.items.spring'] },
    ],
  },
  {
    id: 'tools',
    headingKey: 'skills.groups.tools.heading',
    items: [
      {
        id: 'git-platforms',
        labelKeys: [
          'skills.groups.tools.items.git',
          'skills.groups.tools.items.gitlab',
          'skills.groups.tools.items.github',
        ],
        separator: '/',
      },
      { id: 'vs-code', labelKeys: ['skills.groups.tools.items.vsCode'] },
      { id: 'eclipse', labelKeys: ['skills.groups.tools.items.eclipse'] },
      { id: 'opencode', labelKeys: ['skills.groups.tools.items.opencode'] },
      { id: 'figma', labelKeys: ['skills.groups.tools.items.figma'] },
    ],
  },
  {
    id: 'database',
    headingKey: 'skills.groups.database.heading',
    items: [
      { id: 'firebase', labelKeys: ['skills.groups.database.items.firebase'] },
      { id: 'oracle-db', labelKeys: ['skills.groups.database.items.oracleDb'] },
      { id: 'sql', labelKeys: ['skills.groups.database.items.sql'] },
    ],
  },
  {
    id: 'mobile',
    headingKey: 'skills.groups.mobile.heading',
    items: [
      { id: 'android-studio', labelKeys: ['skills.groups.mobile.items.androidStudio'] },
      {
        id: 'ionic-cordova',
        labelKeys: ['skills.groups.mobile.items.ionic', 'skills.groups.mobile.items.cordova'],
        separator: '+',
      },
    ],
  },
];

@Component({
  selector: 'app-skills',
  imports: [TranslatePipe, SectionTitle],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Skills {
  readonly groups = SKILL_GROUPS;
}
