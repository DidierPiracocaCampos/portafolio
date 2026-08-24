import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  selector: 'app-language-switcher',
  imports: [TranslatePipe],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcher {
  private readonly languageService = inject(LanguageService);
  private readonly translate = inject(TranslateService);

  readonly isEnglish = computed(() => {
    const sig = this.translate.currentLang();
    if (sig) return sig === 'en';
    return this.languageService.currentLang === 'en';
  });

  readonly ariaLabel = computed(() => {
    const lang = this.isEnglish() ? 'es' : 'en';
    // Use instant for aria-label to avoid pipe in computed
    const key = lang === 'es' ? 'language.switchToEs' : 'language.switchToEn';
    const translated = this.translate.instant(key);
    if (translated !== key) return translated;
    return lang === 'es' ? 'Cambiar a español' : 'Switch to English';
  });

  toggle(): void {
    this.languageService.toggle();
  }
}
