# Theme Toggle (Header) Design

## Objetivo

Agregar un botón en el header de `App` (`.app-shell__actions`) que permita alternar
entre los temas daisyUI `gold` (oscuro) y `goldlight` (claro), usando el componente
`swap` con efecto `swap-rotate`. Default oscuro, persistencia en `localStorage` con
fallback a `prefers-color-scheme` en el primer load.

## Alcance

- Servicio `ThemeService` reactivo (`signal`) que aplica el theme activo en
  `<html data-theme>` y lo persiste en `localStorage`.
- Componente standalone `ThemeToggle` reutilizable, accesible y consistente con el
  estilo visual del `LanguageSwitcher` existente.
- Marcado del theme `gold` como `default: true` en la configuración de daisyUI para
  que el default real (cuando no hay storage ni media query) sea oscuro.
- Inicialización del servicio en `APP_INITIALIZER` siguiendo el patrón de
  `LanguageService`.
- Traducciones i18n (`theme.toggle`).
- Tests unitarios para servicio y componente.

Fuera de alcance:

- Más de dos themes. Solo `gold` y `goldlight` (los declarados actualmente).
- Selector dropdown de themes (sólo toggle binario).
- Atajos de teclado globales.
- Animaciones personalizadas más allá de `swap-rotate` nativo de daisyUI.

## Decisiones de diseño

### 1. Servicio reactivo `ThemeService`

`src/app/core/theme/theme.service.ts` — `providedIn: 'root'`, espejo de
`LanguageService` para mantener coherencia con el código existente:

- Constantes:
  - `THEMES = ['gold', 'goldlight'] as const`
  - `type AppTheme = (typeof THEMES)[number]`
  - `STORAGE_KEY = 'theme'`
  - `DEFAULT_THEME: AppTheme = 'gold'`
- Estado interno:
  - `private readonly _theme = signal<AppTheme>('gold')`
  - `readonly currentTheme = computed<AppTheme>(() => this._theme())`
- API pública:
  - `init(): void` — resuelve theme en orden `localStorage` → `matchMedia('(prefers-color-scheme: dark)')` → `DEFAULT_THEME`. Aplica a `<html data-theme>`. Idempotente (no-op en llamadas repetidas).
  - `toggle(): void` — alterna entre `gold` y `goldlight`, persiste y aplica.
  - `set(theme: AppTheme): void` — set explícito, persiste y aplica.
- Helpers privados: `getStoredTheme()`, `getSystemPreference()`,
  `persist(theme)`, `applyTheme(theme)` (escribe `data-theme` en
  `document.documentElement`).
- SSR-safe: todas las referencias a `window`, `localStorage`, `matchMedia` y
  `document` van dentro de `typeof window !== 'undefined'` y/o `try/catch`.

### 2. Marcado del theme `gold` como default

`src/styles.css` — añadir `default: true;` al bloque `@plugin "daisyui/theme"` de
`gold`. Esto garantiza que daisyUI reconozca el oscuro como default cuando no hay
`data-theme` aplicado y ningún theme controller activo.

`prefersdark: true;` se mantiene para que en el primer load (antes de que
`ThemeService.init()` corra) daisyUI ya pinte oscuro si el sistema lo pide.

### 3. Componente `ThemeToggle`

Standalone, `ChangeDetectionStrategy.OnPush`, selector `app-theme-toggle`.

Markup (`theme-toggle.html`) — basado en el ejemplo "Theme Controller using a swap"
de daisyUI:

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
  <!-- sun: visible cuando theme oscuro está activo (swap-on) -->
  <svg class="swap-on h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">…</svg>
  <!-- moon: visible cuando theme claro está activo (swap-off) -->
  <svg class="swap-off h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">…</svg>
</label>
```

Estilos (`theme-toggle.css`) — mínimo:

```css
:host {
  display: inline-flex;
}

.theme-toggle {
  /* Mantiene coherencia con .language-switcher__trigger */
}
```

Justificación de clases:

- `swap swap-rotate` — efecto nativo de daisyUI; sin JS adicional para animar.
- `btn btn-ghost btn-sm btn-square` — mismo aspecto que `LanguageSwitcher` para
  consistencia visual.
- `theme-controller` — clase clave de daisyUI 5 que enlaza el checkbox al theme
  cuyo `value` coincida con `checked`.

Lógica del componente (`theme-toggle.ts`):

```ts
protected readonly theme = inject(ThemeService);

protected onToggle(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.theme.set(input.checked ? 'gold' : 'goldlight');
}
```

Nota: el `[checked]` se bindea a la signal, pero el cambio real se hace vía
`set()` en `onToggle` para que el servicio controle persistencia y `data-theme`.
El `<input>` también refleja visualmente el cambio sin necesidad de re-render
manual.

### 4. Integración en `App`

`src/app/app.ts` — añadir `ThemeToggle` al array `imports`:

```ts
imports: [RouterOutlet, LanguageSwitcher, ThemeToggle]
```

`src/app/app.html` — insertar `<app-theme-toggle />` antes de
`<app-language-switcher />` dentro de `.app-shell__actions`:

```html
<div class="app-shell__actions">
  <app-theme-toggle />
  <app-language-switcher />
</div>
```

`src/app/app.config.ts` — encadenar `ThemeService.init()` al initializer existente
o agregar uno nuevo:

```ts
provideAppInitializer(() => {
  const initializer = inject(LanguageService).init();
  inject(ThemeService).init();
  return initializer;
}),
```

### 5. i18n

Añadir en `public/i18n/en.json` y `public/i18n/es.json`:

```json
"theme": {
  "toggle": "Toggle theme"
}
```

```json
"theme": {
  "toggle": "Cambiar tema"
}
```

## Estructura de archivos

**Crear:**

- `src/app/core/theme/theme.service.ts` — servicio `providedIn: 'root'` con signals.
- `src/app/core/theme/theme.service.spec.ts` — tests: detección de preferencia de
  sistema, lectura/escritura en localStorage, `toggle()`, `set()`, SSR-safe,
  aplicación de `data-theme`.
- `src/app/shared/ui/theme-toggle/theme-toggle.ts` — componente standalone.
- `src/app/shared/ui/theme-toggle/theme-toggle.html` — markup con `swap`.
- `src/app/shared/ui/theme-toggle/theme-toggle.css` — estilos mínimos.
- `src/app/shared/ui/theme-toggle/theme-toggle.spec.ts` — tests: render de SVGs,
  binding de `checked`, llamada a `set()` en change.

**Modificar:**

- `src/styles.css` — `default: true;` en el bloque del theme `gold`.
- `src/app/app.ts` — importar `ThemeToggle`.
- `src/app/app.html` — colocar `<app-theme-toggle />` en `.app-shell__actions`.
- `src/app/app.config.ts` — invocar `ThemeService.init()` en APP_INITIALIZER.
- `public/i18n/en.json` y `public/i18n/es.json` — clave `theme.toggle`.

**No tocar:**

- `angular.json`, `package.json`, `tsconfig.json`.
- `LanguageService`, `LanguageSwitcher`, `index.html`, `home`, `terminal-section`.

## Accesibilidad

- `<label>` envuelve el checkbox oculto para que el click en toda el área cambie
  el estado.
- `aria-label` traducible en el `<label>`.
- SVGs marcados `aria-hidden="true"` (decorativos).
- Foco visible heredado de las clases `btn` de daisyUI (outline por defecto).
- `prefers-reduced-motion`: el efecto `swap-rotate` de daisyUI respeta
  automáticamente la media query (no hay animación forzada con CSS custom).

## Pruebas

### `ThemeService`

- `getStoredTheme()` devuelve `'gold'` cuando `localStorage` tiene `'gold'`.
- `getStoredTheme()` devuelve `null` cuando `localStorage` está vacío o tiene un
  valor inválido.
- `getSystemPreference()` devuelve `'gold'` cuando
  `matchMedia('(prefers-color-scheme: dark)').matches === true`.
- `init()` aplica `<html data-theme="gold">` cuando storage está vacío y sistema
  es dark.
- `init()` aplica `<html data-theme="goldlight">` cuando storage está vacío y
  sistema es light.
- `init()` respeta storage aunque el sistema indique lo contrario.
- `toggle()` cambia `_theme` signal y persiste en `localStorage`.
- SSR-safe: ejecutar código sin `window` no lanza excepción.

### `ThemeToggle`

- Renderiza los dos SVGs (`swap-on` sol, `swap-off` luna).
- El `<input>` está `checked` cuando `theme.currentTheme() === 'gold'`.
- Disparar `change` en el input llama a `theme.set()` con el valor correcto.
- `aria-label` está presente y traducido.

## Verificación final

- `pnpm lint` sin errores.
- `pnpm test` pasa todos los specs (incluyendo los nuevos).
- `pnpm build` compila sin warnings de tipo.
- Smoke visual manual:
  - Carga inicial → fondo oscuro (`gold`).
  - Click en el toggle → fondo claro (`goldlight`), icono de luna visible.
  - Refresh → mantiene el theme claro (persistencia funciona).
  - Limpiar localStorage y recargar con sistema en modo claro → arranca claro.
  - Limpiar localStorage y recargar con sistema en modo oscuro → arranca oscuro.

## Riesgos y mitigaciones

- **FOUC (flash of unstyled content)**: `ThemeService.init()` corre en
  `APP_INITIALIZER`, lo que retrasa el bootstrap hasta que el theme esté aplicado.
  Aún puede haber un flash si el `data-theme` se aplica después del primer paint.
  Mitigación: añadir un `<script>` inline en `index.html` (tiny, síncrono, antes
  de `<app-root>`) que lea `localStorage` y asigne `data-theme` antes de que
  Angular arranque. Esto es opcional y se evaluará durante implementación si
  aparece el flash.
- **Conflicto entre `[checked]` y `theme-controller`**: la clase
  `theme-controller` de daisyUI puede reaccionar al `checked` del input; si
  bindeamos manualmente, podría haber un loop visual. Mitigación: usar
  `(change)` para notificar al servicio y dejar que el servicio controle
  `data-theme`; el `[checked]` solo refleja el estado actual del servicio.
- **SSR / Angular Universal**: el proyecto actual no usa SSR explícito, pero el
  código se mantiene defensivo (`typeof window`) por consistencia con
  `LanguageService`.

## Próximo paso

Invocar la skill `writing-plans` con este spec como entrada para producir el
plan de implementación detallado (task-by-task, estilo TDD).
