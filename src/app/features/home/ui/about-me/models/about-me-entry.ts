export type AboutMeEntry = {
  readonly id: string;
  readonly periodKey: string;
  readonly yearKey: string;
  readonly shortKey: string;
  readonly subKey?: string;
  readonly selectLabelKey: string;
  readonly companyKey?: string;
  readonly roleKey?: string;
  readonly titleKey?: string;
  readonly itemKeys: readonly string[];
};

export const ABOUT_ME_ENTRIES: readonly AboutMeEntry[] = [
  {
    id: 'education',
    periodKey: 'aboutMe.entries.education.period',
    yearKey: 'aboutMe.entries.education.year',
    shortKey: 'aboutMe.entries.education.short',
    selectLabelKey: 'aboutMe.entries.education.selectLabel',
    titleKey: 'aboutMe.entries.education.title',
    itemKeys: [
      'aboutMe.entries.education.items.0',
      'aboutMe.entries.education.items.1',
      'aboutMe.entries.education.items.2',
    ],
  },
  {
    id: 'axpe',
    periodKey: 'aboutMe.entries.axpe.period',
    yearKey: 'aboutMe.entries.axpe.year',
    shortKey: 'aboutMe.entries.axpe.short',
    subKey: 'aboutMe.entries.axpe.company',
    selectLabelKey: 'aboutMe.entries.axpe.selectLabel',
    companyKey: 'aboutMe.entries.axpe.company',
    roleKey: 'aboutMe.entries.axpe.role',
    itemKeys: [
      'aboutMe.entries.axpe.items.0',
      'aboutMe.entries.axpe.items.1',
      'aboutMe.entries.axpe.items.2',
      'aboutMe.entries.axpe.items.3',
    ],
  },
];
