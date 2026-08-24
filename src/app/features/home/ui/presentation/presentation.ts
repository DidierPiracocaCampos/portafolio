import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-presentation',
  imports: [],
  templateUrl: './presentation.html',
  styleUrl: './presentation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Presentation {}
