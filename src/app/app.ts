import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcher } from './shared/ui/language-switcher/language-switcher';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSwitcher],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
