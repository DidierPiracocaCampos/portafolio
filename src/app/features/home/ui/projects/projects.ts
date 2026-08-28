import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import SectionTitle from '../../../../shared/ui/section-title/section-title';

type Project = {
  readonly id: 'devhelper' | 'spot' | 'devformfx';
  readonly name: string;
  readonly imageSrc: string;
  readonly imageAltKey: string;
  readonly statusKey: string;
  readonly technologies: string;
  readonly descriptionKey: string;
  readonly githubUrl?: string;
  readonly figmaUrl?: string;
};

const PROJECTS: readonly Project[] = [
  {
    id: 'devhelper',
    name: 'DevHelper',
    imageSrc: '/images/projects/project-placeholder.svg',
    imageAltKey: 'projects.items.devhelper.imageAlt',
    statusKey: 'projects.status.completed',
    technologies: 'Angular, Tailwind, Firebase',
    descriptionKey: 'projects.items.devhelper.description',
  },
  {
    id: 'spot',
    name: 'SPOT',
    imageSrc: '/images/projects/project-placeholder.svg',
    imageAltKey: 'projects.items.spot.imageAlt',
    statusKey: 'projects.status.completed',
    technologies: 'Angular, Tailwind, Firebase',
    descriptionKey: 'projects.items.spot.description',
  },
  {
    id: 'devformfx',
    name: 'DevFormFX',
    imageSrc: '/images/projects/project-placeholder.svg',
    imageAltKey: 'projects.items.devformfx.imageAlt',
    statusKey: 'projects.status.completed',
    technologies: 'Angular, Tailwind, Firebase',
    descriptionKey: 'projects.items.devformfx.description',
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
