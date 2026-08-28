import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LanguageService, type AppLang } from '../../../core/i18n/language.service';

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

  readonly languages = [
    { code: 'es' as AppLang, labelKey: 'language.es', shortCode: 'ES' },
    { code: 'en' as AppLang, labelKey: 'language.en', shortCode: 'EN' },
  ] as const;

  readonly currentLang = computed<AppLang>(() => {
    const sig = this.translate.currentLang();
    if (sig === 'es' || sig === 'en') return sig;
    return this.languageService.currentLang;
  });

  selectLanguage(lang: AppLang, menu: HTMLDetailsElement): void {
    menu.open = false;
    if (lang !== this.currentLang()) {
      this.languageService.setLang(lang, true);
    }
  }
}
