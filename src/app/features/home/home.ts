import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LanguageSwitcher } from '../../shared/ui/language-switcher/language-switcher';
import Presentation from './ui/presentation/presentation';

@Component({
  selector: 'app-home',
  imports: [Presentation, LanguageSwitcher],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {}
