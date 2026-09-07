import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import SectionTitle from '../../../../shared/ui/section-title/section-title';

type ProjectLinkKind = 'github' | 'website' | 'instagram' | 'figma';

type ProjectLink = {
  readonly kind: ProjectLinkKind;
  readonly url: string;
};

type Project = {
  readonly id: 'devhelper' | 'spot' | 'devformfx';
  readonly name: string;
  readonly imageSrc: string;
  readonly imageAltKey: string;
  readonly statusKey: string;
  readonly technologies: string;
  readonly descriptionKey: string;
  readonly links: readonly ProjectLink[];
};

const PROJECTS: readonly Project[] = [
  {
    id: 'devhelper',
    name: 'DevHelper',
    imageSrc: '/images/projects/devhelper.webp',
    imageAltKey: 'projects.items.devhelper.imageAlt',
    statusKey: 'projects.status.completed',
    technologies: 'Angular, Tailwind, Firebase',
    descriptionKey: 'projects.items.devhelper.description',
    links: [
      { kind: 'website', url: 'https://devhelper.didierpiracoca.com/' },
      { kind: 'github', url: 'https://github.com/DidierPiracocaCampos/DevHelper' },
      { kind: 'instagram', url: 'https://www.instagram.com/devhelper_startup/' },
      {
        kind: 'figma',
        url: 'https://www.figma.com/design/7ts8wiOfzLFndoeHpIG90W/HelperDev?node-id=0-1&t=bWqn2pppP5ElVw4y-1',
      },
    ],
  },

  {
    id: 'devformfx',
    name: 'DevFormFX',
    imageSrc: '/images/projects/devformfx.webp',
    imageAltKey: 'projects.items.devformfx.imageAlt',
    statusKey: 'projects.status.completed',
    technologies: 'Java, JavaFX, Maven',
    descriptionKey: 'projects.items.devformfx.description',
    links: [{ kind: 'github', url: 'https://github.com/DidierPiracocaCampos/DevFormFx' }],
  },
  {
    id: 'spot',
    name: 'SPOT',
    imageSrc: '/images/projects/spot.webp',
    imageAltKey: 'projects.items.spot.imageAlt',
    statusKey: 'projects.status.completed',
    technologies: 'Android, Java, Gradle, Firebase',
    descriptionKey: 'projects.items.spot.description',
    links: [
      { kind: 'github', url: 'https://github.com/DidierPiracocaCampos/SPOT' },
      { kind: 'instagram', url: 'https://www.instagram.com/spot.skate_app/' },
    ],
  },
];

@Component({
  selector: 'app-projects',
  imports: [NgOptimizedImage, TranslatePipe, SectionTitle],
  templateUrl: './projects.html',
  styleUrl: './projects.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Projects {
  readonly projects = PROJECTS;
}
