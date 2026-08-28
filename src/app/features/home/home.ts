import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LanguageSwitcher } from '../../shared/ui/language-switcher/language-switcher';
import Contact from './ui/contact/contact';
import Experience from './ui/experience/experience';
import Presentation from './ui/presentation/presentation';
import Projects from './ui/projects/projects';
import Skills from './ui/skills/skills';

@Component({
  selector: 'app-home',
  imports: [Presentation, Experience, Skills, Projects, Contact, LanguageSwitcher],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {}
