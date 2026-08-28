import { ChangeDetectionStrategy, Component } from '@angular/core';
import TerminalSection from '../../shared/ui/terminal-section/terminal-section';
import Contact from './ui/contact/contact';
import Experience from './ui/experience/experience';
import Presentation from './ui/presentation/presentation';
import Projects from './ui/projects/projects';
import Skills from './ui/skills/skills';

@Component({
  selector: 'app-home',
  imports: [TerminalSection, Presentation, Experience, Skills, Projects, Contact],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {}
