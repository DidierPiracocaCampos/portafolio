import { ChangeDetectionStrategy, Component } from '@angular/core';
import Presentation from './ui/presentation/presentation';

@Component({
  selector: 'app-home',
  imports: [Presentation],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Home {}
