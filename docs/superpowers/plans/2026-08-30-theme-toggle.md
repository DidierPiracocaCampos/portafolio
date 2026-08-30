# Theme Toggle (Header) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agregar un toggle de tema daisyUI (`gold` ↔ `goldlight`) en `.app-shell__actions` usando el componente `swap` con `swap-rotate`, persistiendo la elección en `localStorage` y respetando `prefers-color-scheme` en el primer load. Default oscuro.

**Architecture:** Servicio `ThemeService` (`providedIn: 'root'`, signal-based, espejo de `LanguageService`) que aplica `<html data-theme>` y persiste en `localStorage`. Componente standalone `ThemeToggle` (`shared/ui/theme-toggle/`) que usa daisyUI `swap swap-rotate btn btn-ghost btn-sm btn-square` con `theme-controller`. Inicialización del servicio en `provideAppInitializer`. Theme `gold` marcado `default: true` en `src/styles.css`.

**Tech Stack:** Angular 20.3.18, TypeScript 5.9, Tailwind CSS 4.3.0, daisyUI 5.5.19, Vitest 3.1, @angular/build:application, ESLint + Prettier, pnpm

## Global Constraints

- Servicio `ThemeService` SSR-safe: cualquier referencia a `window`, `localStorage`, `matchMedia` o `document` debe estar dentro de `typeof window !== 'undefined'` y/o `try/catch`.
- Componente `ThemeToggle` standalone (Angular 20) con `ChangeDetectionStrategy.OnPush`, sin `standalone: true` explícito.
- Mantener coherencia visual con `LanguageSwitcher`: misma escala de botón (`btn-ghost btn-sm btn-square`), SVGs a `h-5 w-5` para alinear tamaño.
- Usar daisyUI class names (`swap`, `swap-rotate`, `swap-on`, `swap-off`, `btn`, `btn-ghost`, `btn-sm`, `btn-square`, `theme-controller`) — no usar Tailwind utilities para layout cuando la clase daisyUI ya provee el comportamiento.
- Usar `@if`/`@for` y `inject()` por best practices Angular 20.
- i18n: añadir clave `theme.toggle` en `public/i18n/{en,es}.json` y consumir vía `TranslatePipe`.
- Theme `gold` ya tiene `prefersdark: true`; añadir `default: true;` para que daisyUI reconozca el oscuro como default si ningún `theme-controller` está activo.
- Tipar `AppTheme = 'gold' | 'goldlight'` con `as const` para inferencia estricta.
- No tocar: `angular.json`, `package.json`, `tsconfig.json`, `index.html`, `LanguageService`, `LanguageSwitcher`.
- Tests: usar `TestBed` + `provideTranslateService` cuando el componente use `TranslatePipe`. Limpiar localStorage en `beforeEach`. Para `matchMedia`, stubear con `Object.defineProperty` como en `terminal-section.spec.ts`.

---

## File Structure

**Crear:**

- `src/app/core/theme/theme.service.ts` — `ThemeService` con `signal`, `init()`, `toggle()`, `set()`, helpers privados SSR-safe.
- `src/app/core/theme/theme.service.spec.ts` — tests del servicio.
- `src/app/shared/ui/theme-toggle/theme-toggle.ts` — componente standalone `app-theme-toggle`.
- `src/app/shared/ui/theme-toggle/theme-toggle.html` — markup con `swap swap-rotate`.
- `src/app/shared/ui/theme-toggle/theme-toggle.css` — estilos mínimos (`:host` y `.theme-toggle`).
- `src/app/shared/ui/theme-toggle/theme-toggle.spec.ts` — tests del componente.

**Modificar:**

- `src/styles.css` — añadir `default: true;` en el bloque `@plugin "daisyui/theme"` de `gold`.
- `src/app/app.ts` — importar `ThemeToggle` y añadirlo al array `imports`.
- `src/app/app.html` — colocar `<app-theme-toggle />` antes de `<app-language-switcher />`.
- `src/app/app.config.ts` — invocar `ThemeService.init()` en `provideAppInitializer`.
- `src/app/app.spec.ts` — añadir aserción de que `app-theme-toggle` está dentro de `.app-shell__actions`.
- `public/i18n/en.json` — añadir `theme.toggle`.
- `public/i18n/es.json` — añadir `theme.toggle`.

**No tocar:**

- `angular.json`, `package.json`, `tsconfig.json`, `index.html`.
- `LanguageService`, `LanguageSwitcher`, `home`, `terminal-section`.

---

### Task 1: ThemeService con tests TDD

**Files:**

- Create: `src/app/core/theme/theme.service.spec.ts`
- Create: `src/app/core/theme/theme.service.ts`

**Interfaces:**

- Consumes: `DOCUMENT` de `@angular/common`, `signal`/`computed`/`inject` de `@angular/core`.
- Produces:
  - `export type AppTheme = 'gold' | 'goldlight';`
  - `export class ThemeService { init(): void; toggle(): void; set(theme: AppTheme): void; readonly currentTheme: Signal<AppTheme>; }`

- [ ] **Step 1: Crear spec vacío y verificar que falla por import**

`src/app/core/theme/theme.service.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(ThemeService).toBeDefined();
  });
});
```

Run: `pnpm test -- --run --testPathPattern=core/theme/theme.service`

Expected: FAIL con "Cannot find module './theme.service'" o equivalente.

- [ ] **Step 2: Crear esqueleto mínimo del servicio**

`src/app/core/theme/theme.service.ts`:

```ts
import { Injectable } from '@angular/core';

export const THEMES = ['gold', 'goldlight'] as const;
export type AppTheme = (typeof THEMES)[number];
const DEFAULT_THEME: AppTheme = 'gold';

@Injectable({ providedIn: 'root' })
export class ThemeService {}
```

- [ ] **Step 3: Verificar que el spec pasa**

Run: `pnpm test -- --run --testPathPattern=core/theme/theme.service`

Expected: PASS (1 test).

- [ ] **Step 4: Añadir tests de init() — detección por storage, system y default**

Reemplaza el contenido de `src/app/core/theme/theme.service.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { ThemeService, THEMES } from './theme.service';

function stubMatchMedia(prefersDark: boolean): void {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: prefersDark && query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: () => undefined,
        removeListener: () => undefined,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList,
  });
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    vi.restoreAllMocks();
  });

  it('should expose the gold and goldlight themes', () => {
    expect(THEMES).toEqual(['gold', 'goldlight']);
  });

  describe('init()', () => {
    it('should default to gold when storage is empty and system prefers dark', () => {
      stubMatchMedia(true);
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.currentTheme()).toBe('gold');
      expect(document.documentElement.getAttribute('data-theme')).toBe('gold');
    });

    it('should default to goldlight when storage is empty and system prefers light', () => {
      stubMatchMedia(false);
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.currentTheme()).toBe('goldlight');
      expect(document.documentElement.getAttribute('data-theme')).toBe('goldlight');
    });

    it('should respect stored theme even when system differs', () => {
      localStorage.setItem('theme', 'goldlight');
      stubMatchMedia(true);
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.currentTheme()).toBe('goldlight');
      expect(document.documentElement.getAttribute('data-theme')).toBe('goldlight');
    });

    it('should ignore invalid stored values and fall back to system', () => {
      localStorage.setItem('theme', 'something-invalid');
      stubMatchMedia(false);
      const service = TestBed.inject(ThemeService);
      service.init();
      expect(service.currentTheme()).toBe('goldlight');
    });

    it('should be idempotent on repeated calls', () => {
      stubMatchMedia(true);
      const service = TestBed.inject(ThemeService);
      service.init();
      service.init();
      expect(service.currentTheme()).toBe('gold');
    });
  });

  describe('toggle()', () => {
    it('should switch from gold to goldlight, persist and apply', () => {
      stubMatchMedia(true);
      const service = TestBed.inject(ThemeService);
      service.init();
      service.toggle();
      expect(service.currentTheme()).toBe('goldlight');
      expect(localStorage.getItem('theme')).toBe('goldlight');
      expect(document.documentElement.getAttribute('data-theme')).toBe('goldlight');
    });

    it('should switch from goldlight to gold, persist and apply', () => {
      stubMatchMedia(false);
      const service = TestBed.inject(ThemeService);
      service.init();
      service.toggle();
      expect(service.currentTheme()).toBe('gold');
      expect(localStorage.getItem('theme')).toBe('gold');
      expect(document.documentElement.getAttribute('data-theme')).toBe('gold');
    });
  });

  describe('set(theme)', () => {
    it('should set the theme, persist and apply', () => {
      const service = TestBed.inject(ThemeService);
      service.set('goldlight');
      expect(service.currentTheme()).toBe('goldlight');
      expect(localStorage.getItem('theme')).toBe('goldlight');
      expect(document.documentElement.getAttribute('data-theme')).toBe('goldlight');
    });
  });
});
```

Run: `pnpm test -- --run --testPathPattern=core/theme/theme.service`

Expected: FAIL (múltiples tests — `currentTheme`, `init()`, `toggle()`, `set()` no existen).

- [ ] **Step 5: Implementar el `ThemeService` completo**

`src/app/core/theme/theme.service.ts`:

```ts
import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export const THEMES = ['gold', 'goldlight'] as const;
export type AppTheme = (typeof THEMES)[number];

const STORAGE_KEY = 'theme';
const DEFAULT_THEME: AppTheme = 'gold';

function isAppTheme(value: string | null): value is AppTheme {
  return value === 'gold' || value === 'goldlight';
}

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);

  private readonly _theme = signal<AppTheme>(DEFAULT_THEME);
  readonly currentTheme = computed<AppTheme>(() => this._theme());

  private _initialized = false;

  init(): void {
    if (this._initialized) return;
    this._initialized = true;
    const initial = this.resolveInitialTheme();
    this.apply(initial);
    this.persist(initial);
  }

  toggle(): void {
    const next: AppTheme = this._theme() === 'gold' ? 'goldlight' : 'gold';
    this.set(next);
  }

  set(theme: AppTheme): void {
    this._theme.set(theme);
    this.apply(theme);
    this.persist(theme);
  }

  private resolveInitialTheme(): AppTheme {
    const stored = this.getStoredTheme();
    if (stored) return stored;
    const system = this.getSystemPreference();
    if (system) return system;
    return DEFAULT_THEME;
  }

  private getStoredTheme(): AppTheme | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      return isAppTheme(raw) ? raw : null;
    } catch {
      return null;
    }
  }

  private getSystemPreference(): AppTheme | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    try {
      if (typeof window.matchMedia !== 'function') return null;
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      return mql.matches ? 'gold' : 'goldlight';
    } catch {
      return null;
    }
  }

  private persist(theme: AppTheme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore (private mode, quota, etc.)
    }
  }

  private apply(theme: AppTheme): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      document.documentElement.setAttribute('data-theme', theme);
    } catch {
      // ignore
    }
  }
}
```

- [ ] **Step 6: Verificar que todos los tests pasan**

Run: `pnpm test -- --run --testPathPattern=core/theme/theme.service`

Expected: PASS (todos los tests).

- [ ] **Step 7: Lint y commit**

Run: `pnpm lint`

Expected: sin errores.

```bash
git add src/app/core/theme/theme.service.ts src/app/core/theme/theme.service.spec.ts
git commit -m "feat(theme): add ThemeService with init/toggle/set and persistence"
```

---

### Task 2: Marcar theme `gold` como default y añadir claves i18n

**Files:**

- Modify: `src/styles.css:31-36`
- Modify: `public/i18n/en.json:22-28`
- Modify: `public/i18n/es.json:22-28`

- [ ] **Step 1: Añadir `default: true;` al bloque de `gold`**

En `src/styles.css`, dentro del bloque `@plugin "daisyui/theme" { name: 'gold'; ... }`, añadir la línea `default: true;` justo después de `name: 'gold';`:

```css
@plugin "daisyui/theme" {
  name: 'gold';
  default: true;
  prefersdark: true;
  color-scheme: 'dark';
  ...
}
```

- [ ] **Step 2: Añadir clave `theme.toggle` en `en.json`**

Insertar al final del objeto raíz (justo antes del cierre `}`), el bloque:

```json
,
"theme": {
  "toggle": "Toggle theme"
}
```

El resultado debe ser un JSON válido (asegurar coma después del último bloque `"language"`).

- [ ] **Step 3: Añadir clave `theme.toggle` en `es.json`**

Insertar al final del objeto raíz (justo antes del cierre `}`), el bloque:

```json
,
"theme": {
  "toggle": "Cambiar tema"
}
```

- [ ] **Step 4: Verificar que los JSONs son válidos**

Run:

```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('public/i18n/en.json','utf8')).theme.toggle)"
node -e "console.log(JSON.parse(require('fs').readFileSync('public/i18n/es.json','utf8')).theme.toggle)"
```

Expected: `Toggle theme` y `Cambiar tema` respectivamente.

- [ ] **Step 5: Commit**

```bash
git add src/styles.css public/i18n/en.json public/i18n/es.json
git commit -m "feat(theme): mark gold as default theme and add i18n keys"
```

---

### Task 3: ThemeToggle componente con tests TDD

**Files:**

- Create: `src/app/shared/ui/theme-toggle/theme-toggle.spec.ts`
- Create: `src/app/shared/ui/theme-toggle/theme-toggle.ts`
- Create: `src/app/shared/ui/theme-toggle/theme-toggle.html`
- Create: `src/app/shared/ui/theme-toggle/theme-toggle.css`

**Interfaces:**

- Consumes: `ThemeService` (de `core/theme/theme.service.ts`), `TranslatePipe` de `@ngx-translate/core`.
- Produces: standalone component `app-theme-toggle` con `selector: 'app-theme-toggle'`.

- [ ] **Step 1: Crear spec con tests failing**

`src/app/shared/ui/theme-toggle/theme-toggle.spec.ts`:

```ts
import { TestBed } from '@angular/core/testing';
import { provideTranslateService, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { ThemeToggle } from './theme-toggle';
import { ThemeService } from '../../../core/theme/theme.service';

describe('ThemeToggle', () => {
  beforeEach(async () => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    await TestBed.configureTestingModule({
      imports: [ThemeToggle],
      providers: [provideTranslateService({ fallbackLang: 'en' })],
    }).compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('en', { theme: { toggle: 'Toggle theme' } });
    await firstValueFrom(translate.use('en'));
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a label with swap classes and a hidden checkbox', () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const label = el.querySelector('label');
    expect(label).toBeTruthy();
    expect(label?.classList.contains('swap')).toBe(true);
    expect(label?.classList.contains('swap-rotate')).toBe(true);
    expect(label?.classList.contains('btn')).toBe(true);
    const input = label?.querySelector('input[type="checkbox"]');
    expect(input).toBeTruthy();
    expect(input?.classList.contains('theme-controller')).toBe(true);
    expect((input as HTMLInputElement).value).toBe('gold');
  });

  it('should render sun (swap-on) and moon (swap-off) SVGs', () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const on = el.querySelector('svg.swap-on');
    const off = el.querySelector('svg.swap-off');
    expect(on).toBeTruthy();
    expect(off).toBeTruthy();
  });

  it('should bind checkbox checked to currentTheme === gold', () => {
    const service = TestBed.inject(ThemeService);
    service.set('gold');
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(input.checked).toBe(true);

    service.set('goldlight');
    fixture.detectChanges();
    expect(input.checked).toBe(false);
  });

  it('should call theme.set on checkbox change', () => {
    const service = TestBed.inject(ThemeService);
    service.set('gold');
    const setSpy = vi.spyOn(service, 'set');
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;

    input.checked = false;
    input.dispatchEvent(new Event('change'));
    expect(setSpy).toHaveBeenCalledWith('goldlight');

    input.checked = true;
    input.dispatchEvent(new Event('change'));
    expect(setSpy).toHaveBeenCalledWith('gold');
  });

  it('should expose a translated aria-label', () => {
    const fixture = TestBed.createComponent(ThemeToggle);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('label');
    expect(label?.getAttribute('aria-label')).toBe('Toggle theme');
  });
});
```

Run: `pnpm test -- --run --testPathPattern=shared/ui/theme-toggle`

Expected: FAIL (componente no existe).

- [ ] **Step 2: Crear esqueleto del componente**

`src/app/shared/ui/theme-toggle/theme-toggle.ts`:

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);
}
```

`src/app/shared/ui/theme-toggle/theme-toggle.html` (placeholder):

```html
<span>theme-toggle placeholder</span>
```

`src/app/shared/ui/theme-toggle/theme-toggle.css`:

```css
:host {
  display: inline-flex;
}
```

- [ ] **Step 3: Verificar que al menos el test `should create` pasa**

Run: `pnpm test -- --run --testPathPattern=shared/ui/theme-toggle`

Expected: PASS en `should create`, FAIL en el resto.

- [ ] **Step 4: Implementar markup completo con swap, SVGs y bindings**

`src/app/shared/ui/theme-toggle/theme-toggle.html`:

```html
<label
  class="swap swap-rotate btn btn-ghost btn-sm btn-square theme-toggle"
  [attr.aria-label]="'theme.toggle' | translate"
>
  <input
    type="checkbox"
    class="theme-controller"
    value="gold"
    [checked]="theme.currentTheme() === 'gold'"
    (change)="onToggle($event)"
  />
  <!-- sun: visible when dark (gold) theme is active -->
  <svg
    class="swap-on h-5 w-5 fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z"
    />
  </svg>
  <!-- moon: visible when light (goldlight) theme is active -->
  <svg
    class="swap-off h-5 w-5 fill-current"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <path
      d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"
    />
  </svg>
</label>
```

Actualizar `src/app/shared/ui/theme-toggle/theme-toggle.ts`:

```ts
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../../core/theme/theme.service';

@Component({
  selector: 'app-theme-toggle',
  imports: [TranslatePipe],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  protected readonly theme = inject(ThemeService);

  protected onToggle(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.theme.set(input.checked ? 'gold' : 'goldlight');
  }
}
```

- [ ] **Step 5: Verificar que todos los tests pasan**

Run: `pnpm test -- --run --testPathPattern=shared/ui/theme-toggle`

Expected: PASS (6 tests).

- [ ] **Step 6: Commit**

```bash
git add src/app/shared/ui/theme-toggle/
git commit -m "feat(theme): add ThemeToggle component using daisyUI swap"
```

---

### Task 4: Wire APP_INITIALIZER para `ThemeService.init()`

**Files:**

- Modify: `src/app/app.config.ts:80-83`

- [ ] **Step 1: Encadenar `ThemeService.init()` al initializer existente**

En `src/app/app.config.ts`, reemplazar el bloque `provideAppInitializer`:

```ts
provideAppInitializer(() => {
  const initializer = inject(LanguageService).init();
  inject(ThemeService).init();
  return initializer;
}),
```

Y añadir el import al inicio del archivo (junto a `LanguageService`):

```ts
import { ThemeService } from './core/theme/theme.service';
```

El bloque `providers` queda así:

```ts
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
    inject(ThemeService).init();
    return initializer;
  }),
  provideFirebaseApp(() => initializeApp(resolveFirebaseConfig())),
  provideDatabase(() => createDatabase()),
],
```

- [ ] **Step 2: Build para verificar que no hay errores de tipo**

Run: `pnpm build`

Expected: build exitoso. (El `provideAppInitializer` se ejecutará tanto en browser como en SSR, pero `ThemeService.init()` es SSR-safe.)

- [ ] **Step 3: Commit**

```bash
git add src/app/app.config.ts
git commit -m "feat(theme): initialize ThemeService on app bootstrap"
```

---

### Task 5: Integrar `ThemeToggle` en `App` template + actualizar test

**Files:**

- Modify: `src/app/app.ts:1-12`
- Modify: `src/app/app.html:13-15`
- Modify: `src/app/app.spec.ts:27-69`

- [ ] **Step 1: Importar `ThemeToggle` en `App`**

`src/app/app.ts`:

```ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LanguageSwitcher } from './shared/ui/language-switcher/language-switcher';
import { ThemeToggle } from './shared/ui/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSwitcher, ThemeToggle],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
```

- [ ] **Step 2: Insertar `<app-theme-toggle />` antes del language switcher**

`src/app/app.html`, reemplazar el bloque `.app-shell__actions`:

```html
<div class="app-shell__actions">
  <app-theme-toggle />
  <app-language-switcher />
</div>
```

- [ ] **Step 3: Actualizar `app.spec.ts` para asertar el toggle en actions**

Añadir un nuevo test (al final del bloque `describe('App')`) y actualizar el test existente "should keep language switcher inside actions and not duplicate header":

Localizar en `src/app/app.spec.ts`:

```ts
expect(actions?.querySelector('app-language-switcher')).toBeTruthy();
```

Reemplazar por:

```ts
expect(actions?.querySelector('app-theme-toggle')).toBeTruthy();
expect(actions?.querySelector('app-language-switcher')).toBeTruthy();
```

Y al final del `describe('App')`, añadir:

```ts
it('should render theme toggle inside header actions next to language switcher', () => {
  const fixture = TestBed.createComponent(App);
  fixture.detectChanges();
  const compiled = fixture.nativeElement as HTMLElement;
  const actions = compiled.querySelector('.app-shell__actions');
  expect(actions).toBeTruthy();
  const toggle = actions?.querySelector('app-theme-toggle');
  const switcher = actions?.querySelector('app-language-switcher');
  expect(toggle).toBeTruthy();
  expect(switcher).toBeTruthy();
  // Theme toggle is rendered before language switcher
  expect(toggle?.nextElementSibling).toBe(switcher);
});
```

- [ ] **Step 4: Verificar tests del App**

Run: `pnpm test -- --run --testPathPattern=app/app`

Expected: PASS (todos los tests, incluido el nuevo).

- [ ] **Step 5: Commit**

```bash
git add src/app/app.ts src/app/app.html src/app/app.spec.ts
git commit -m "feat(theme): wire ThemeToggle into app header actions"
```

---

### Task 6: Verificación final

**Files:** (sin cambios)

- [ ] **Step 1: Lint**

Run: `pnpm lint`

Expected: sin errores ni warnings.

- [ ] **Step 2: Suite completa de tests**

Run: `pnpm test -- --run`

Expected: PASS todos los specs (`App`, `LanguageSwitcher`, `ThemeService`, `ThemeToggle`, `ContactSubmissionService`, `TerminalSection`, `SectionTitle`, `Home`, `Presentation`, `Projects`, `Skills`, `Experience`, `Contact`).

- [ ] **Step 3: Build de producción**

Run: `pnpm build`

Expected: build exitoso sin warnings de bundle size.

- [ ] **Step 4: Smoke visual manual**

Run: `pnpm start`

Verificar en el navegador (`http://localhost:4200`):

1. **Carga inicial con storage vacío y sistema en dark mode**: fondo oscuro (`gold`), icono sol visible en el toggle.
2. **Click en el toggle**: fondo claro (`goldlight`), icono luna visible, persiste en `localStorage` (verificar en DevTools).
3. **Refresh**: mantiene el theme claro.
4. **Limpiar localStorage y recargar con sistema en light mode**: arranca claro.
5. **Limpiar localStorage y recargar con sistema en dark mode**: arranca oscuro.

- [ ] **Step 5: Verificación final del repo**

```bash
git status
git log --oneline -10
```

Expected: working tree limpio, commits coherentes con los mensajes de las tasks.

---

## Resumen de commits esperados

1. `docs(spec): add theme toggle header design` (ya commiteado en brainstorming)
2. `feat(theme): add ThemeService with init/toggle/set and persistence`
3. `feat(theme): mark gold as default theme and add i18n keys`
4. `feat(theme): add ThemeToggle component using daisyUI swap`
5. `feat(theme): initialize ThemeService on app bootstrap`
6. `feat(theme): wire ThemeToggle into app header actions`
