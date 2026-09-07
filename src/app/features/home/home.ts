import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import TerminalSection from '../../shared/ui/terminal-section/terminal-section';
import Contact from './ui/contact/contact';
import AboutMe from './ui/about-me/about-me';
import Footer from './ui/footer/footer';
import Presentation from './ui/presentation/presentation';
import Projects from './ui/projects/projects';

const SEQUENCE_STEP = {
  presentationTerminal: 0,
  presentationAnimation: 1,
  aboutMe: 2,
  projects: 3,
  contact: 4,
  complete: 5,
} as const;

type SequenceStep = (typeof SEQUENCE_STEP)[keyof typeof SEQUENCE_STEP];

@Component({
  selector: 'app-home',
  imports: [TerminalSection, Presentation, AboutMe, Projects, Contact, Footer, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly sequenceStep = signal<SequenceStep>(SEQUENCE_STEP.presentationTerminal);

  readonly presentationAnimationStarted = computed(
    () => this.sequenceStep() >= SEQUENCE_STEP.presentationAnimation,
  );

  readonly aboutMeUnlocked = computed(() => this.sequenceStep() >= SEQUENCE_STEP.aboutMe);
  readonly projectsUnlocked = computed(() => this.sequenceStep() >= SEQUENCE_STEP.projects);
  readonly contactUnlocked = computed(() => this.sequenceStep() >= SEQUENCE_STEP.contact);

  onPresentationTerminalCompleted(): void {
    this.advance(SEQUENCE_STEP.presentationTerminal, SEQUENCE_STEP.presentationAnimation);
  }

  onPresentationCompleted(): void {
    this.advance(SEQUENCE_STEP.presentationAnimation, SEQUENCE_STEP.aboutMe);
  }

  onAboutMeCompleted(): void {
    this.advance(SEQUENCE_STEP.aboutMe, SEQUENCE_STEP.projects);
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
