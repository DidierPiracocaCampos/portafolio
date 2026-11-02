import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import TerminalSection from '../../shared/ui/terminal-section/terminal-section';
import Contact from './ui/contact/contact';
import AboutMe from './ui/about-me/about-me';
import Footer from './ui/footer/footer';
import Presentation from './ui/presentation/presentation';
import Projects from './ui/projects/projects';

/**
 * Sólo la portada sigue una secuencia temporizada (comando → animación de presentación).
 * El resto de secciones está siempre en el DOM y anima por su cuenta al entrar en el viewport
 * (ver TerminalSection).
 */
@Component({
  selector: 'app-home',
  imports: [TerminalSection, Presentation, AboutMe, Projects, Contact, Footer, TranslatePipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {
  readonly presentationAnimationStarted = signal(false);

  onPresentationTerminalCompleted(): void {
    this.presentationAnimationStarted.set(true);
  }
}
