import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CvDownload } from './shared/ui/cv-download/cv-download';
import { LanguageSwitcher } from './shared/ui/language-switcher/language-switcher';
import { ThemeToggle } from './shared/ui/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CvDownload, LanguageSwitcher, ThemeToggle],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
