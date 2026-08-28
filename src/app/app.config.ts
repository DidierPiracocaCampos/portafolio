import { provideHttpClient } from '@angular/common/http';
import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from '../environments/environment';
import { LanguageService } from './core/i18n/language.service';

function isPlaceholder(value: string | undefined): boolean {
  return !value || value.includes('FIREBASE_') || value.trim().length === 0;
}

function resolveFirebaseConfig() {
  const raw = environment.firebaseConfig;
  const projectId = isPlaceholder(raw.projectId) ? 'portafolio-71784' : raw.projectId;
  let databaseURL = raw.databaseURL;

  if (isPlaceholder(databaseURL) || !databaseURL.startsWith('https://')) {
    databaseURL = `https://${projectId}-default-rtdb.europe-west1.firebasedatabase.app`;
    if (isPlaceholder(raw.databaseURL)) {
      console.warn(
        `[Firebase] databaseURL placeholder detectado ("${raw.databaseURL}"). Usando fallback parseable "${databaseURL}". Configura src/environments/environment.ts con la URL real de Realtime Database para habilitar el envío.`,
      );
    }
  }

  // Corrige automáticamente la URL legacy sin región (firebaseio.com) a la URL regional si el warning lo indica.
  if (databaseURL.includes('firebaseio.com') && !databaseURL.includes('europe-west1')) {
    const regionalURL = `https://${projectId}-default-rtdb.europe-west1.firebasedatabase.app`;
    console.warn(
      `[Firebase] Corrigiendo databaseURL de "${databaseURL}" a "${regionalURL}" por región europe-west1.`,
    );
    databaseURL = regionalURL;
  }

  return {
    ...raw,
    projectId,
    databaseURL,
  };
}

function createDatabase(): ReturnType<typeof getDatabase> {
  try {
    return getDatabase();
  } catch (error) {
    console.warn(
      '[Firebase] No se pudo inicializar Realtime Database. El formulario de contacto quedará en modo error hasta configurar Firebase.',
      error,
    );
    // Devuelve un objeto falsy tipado como Database para evitar el crash fatal en el bootstrap.
    // ContactSubmissionService detectará la ausencia y rechazará el envío con mensaje de error visible.
    return null as unknown as ReturnType<typeof getDatabase>;
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
    provideTranslateService({
      fallbackLang: 'en',
      lang: 'en',
    }),
    provideTranslateHttpLoader({
      prefix: '/i18n/',
      suffix: '.json',
    }),
    provideAppInitializer(() => {
      const initializer = inject(LanguageService).init();
      return initializer;
    }),
    provideFirebaseApp(() => initializeApp(resolveFirebaseConfig())),
    provideDatabase(() => createDatabase()),
  ],
};
