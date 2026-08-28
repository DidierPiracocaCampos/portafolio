import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import TerminalSection from '../../shared/ui/terminal-section/terminal-section';
import Contact from './ui/contact/contact';
import Experience from './ui/experience/experience';
import Presentation from './ui/presentation/presentation';
import Projects from './ui/projects/projects';
import Skills from './ui/skills/skills';

const SEQUENCE_STEP = {
  presentationTerminal: 0,
  presentationAnimation: 1,
  experience: 2,
  skills: 3,
  projects: 4,
  contact: 5,
  complete: 6,
} as const;

type SequenceStep = (typeof SEQUENCE_STEP)[keyof typeof SEQUENCE_STEP];

@Component({
  selector: 'app-home',
  imports: [TerminalSection, Presentation, Experience, Skills, Projects, Contact, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly sequenceStep = signal<SequenceStep>(SEQUENCE_STEP.presentationTerminal);

  readonly presentationAnimationStarted = computed(
    () => this.sequenceStep() >= SEQUENCE_STEP.presentationAnimation,
  );

  readonly experienceUnlocked = computed(() => this.sequenceStep() >= SEQUENCE_STEP.experience);
  readonly skillsUnlocked = computed(() => this.sequenceStep() >= SEQUENCE_STEP.skills);
  readonly projectsUnlocked = computed(() => this.sequenceStep() >= SEQUENCE_STEP.projects);
  readonly contactUnlocked = computed(() => this.sequenceStep() >= SEQUENCE_STEP.contact);

  onPresentationTerminalCompleted(): void {
    this.advance(SEQUENCE_STEP.presentationTerminal, SEQUENCE_STEP.presentationAnimation);
  }

  onPresentationCompleted(): void {
    this.advance(SEQUENCE_STEP.presentationAnimation, SEQUENCE_STEP.experience);
  }

  onExperienceCompleted(): void {
    this.advance(SEQUENCE_STEP.experience, SEQUENCE_STEP.skills);
  }

  onSkillsCompleted(): void {
    this.advance(SEQUENCE_STEP.skills, SEQUENCE_STEP.projects);
  }

  onProjectsCompleted(): void {
    this.advance(SEQUENCE_STEP.projects, SEQUENCE_STEP.contact);
  }

  onContactCompleted(): void {
    this.advance(SEQUENCE_STEP.contact, SEQUENCE_STEP.complete);
  }

  private advance(from: SequenceStep, to: SequenceStep): void {
    if (this.sequenceStep() === from) {
      this.sequenceStep.set(to);
    }
  }
}
