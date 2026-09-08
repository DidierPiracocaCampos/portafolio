import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-cv-download',
  imports: [TranslatePipe],
  templateUrl: './cv-download.html',
  styleUrl: './cv-download.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CvDownload {}
