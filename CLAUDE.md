# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Portafolio personal de una sola página con estética de terminal. Angular 20 (standalone, signals, SSR con prerender estático), Tailwind CSS 4 + daisyUI 5, ngx-translate (es/en) y Firebase (Hosting + Realtime Database para el formulario de contacto).

## Comandos

Gestor de paquetes: **pnpm** (`angular.json` → `cli.packageManager`).

```bash
pnpm start                 # ng serve (configuración development) en http://localhost:4200
pnpm build                 # build de producción → dist/portafolio/browser (prerender estático)
pnpm test                  # tests unitarios (builder @angular/build:unit-test con Vitest)
pnpm exec ng test --include src/app/core/theme/theme.service.spec.ts   # un solo spec
pnpm test:rules            # tests de database.rules.json contra el emulador de Firebase (requiere firebase CLI)
pnpm lint                  # eslint (los *.spec.ts y *.html están excluidos)
pnpm lint:fix
pnpm format                # prettier (printWidth 100, singleQuote, parser angular para .html)
```

`tools/build-terminal-icons.mjs` regenera `public/fonts/terminal-icons.woff2` (subset de una Nerd Font): `NERD_FONT_SOURCE=<ruta .ttf> node tools/build-terminal-icons.mjs`.

## Arquitectura

### Render y rutas
- `outputMode: "static"`: las rutas `''`, `/es` y `/en` se prerenderizan (`app.routes.server.ts`); el resto es CSR. Firebase Hosting reescribe todo a `/index.csr.html`. Todas las rutas cargan el mismo componente `features/home/home`.
- El código corre también en el servidor durante el prerender: el acceso a `window`/`localStorage`/`navigator` debe ir protegido (`isPlatformBrowser` o `typeof window`), como hacen `LanguageService` y `ThemeService`.

### Arranque (`app.config.ts`)
- `provideAppInitializer` ejecuta `LanguageService.init()` y `ThemeService.init()`.
- Idioma: prioridad URL (`/es`, `/en`) > `localStorage['lang']` > navegador > `en`. `LanguageService` mantiene sincronizados ngx-translate, `<html lang>`, la URL y el SEO (`SeoService`: canonical/hreflang/meta). Desde `/` redirige a `/<lang>` tras el primer render.
- Traducciones en `public/i18n/{es,en}.json` (cargadas por HTTP desde `/i18n/`). Todo texto visible usa claves de traducción; al añadir texto hay que actualizar **ambos** ficheros.
- Temas daisyUI `gold` (oscuro, por defecto) y `goldlight`, definidos en `src/styles.css`; `ThemeService` los persiste en `localStorage['theme']`.

### Secuencia de la home
`features/home/home.ts` es una máquina de estados (`SEQUENCE_STEP`) que va desbloqueando secciones en orden: presentación → about-me → projects → contact (+ footer). Cada sección va envuelta en `shared/ui/terminal-section`, que "teclea" un comando (`commandKey` → clave i18n `terminal.commands.*`) y emite `completed`; Home avanza al siguiente paso y la siguiente sección se carga con `@defer (on immediate)`. Una sección nueva necesita un paso en `SEQUENCE_STEP`, su handler `on…Completed` y su bloque en `home.html`.

### Estructura
- `core/` — servicios singleton (`i18n`, `theme`, `contact`).
- `features/home/ui/*` — secciones de la home; `shared/ui/*` — componentes reutilizables (terminal-section, section-title, theme-toggle, language-switcher, cv-download).
- Los componentes de sección usan `export default class` y se importan sin llaves. Contenido estático (proyectos, entradas "about me") vive como constantes tipadas en el `.ts` del componente, con textos referenciados por clave i18n.
- Assets en `public/` (`images/`, `icons/`, `fonts/`, `documents/` con el CV).

### Formulario de contacto y Firebase
- `ContactSubmissionService` escribe en `contactSubmissions/<pushId>` de Realtime Database a través del wrapper `core/contact/contact-db.ts` (existe para poder mockear las funciones de `firebase/database` en tests).
- `database.rules.json` sólo permite crear (nunca leer/sobrescribir) registros con `name`, `email`, `message` y `createdAt` validados; cualquier cambio en el payload requiere actualizar las reglas y `tools/database-rules.spec.ts`.
- `src/environments/environment.ts` contiene placeholders `FIREBASE_*` que el CI sustituye con `sed` usando secrets. `app.config.ts` tolera placeholders (fallback a la URL regional `europe-west1` del proyecto `portafolio-71784`) y, si la base de datos no se puede inicializar, el formulario queda en modo error en lugar de romper el bootstrap. `environment.development.ts` es local y está en `.gitignore`.

## Convenciones
- Componentes standalone con `ChangeDetectionStrategy.OnPush` (por defecto en los schematics, que además usan `skipTests: true`); estado con signals.
- Presupuestos de producción: estilos por componente ≤ 6 kB (warning) / 10 kB (error); bundle inicial ≤ 600 kB / 1 MB.
- Mensajes de commit en español con prefijo convencional (`feat:`, `fix:`, `style:`…).
- `docs/` contiene el análisis por sección del diseño en Figma y los specs/planes previos (`docs/superpowers/`).

## Despliegue
GitHub Actions: push a `main` despliega a Firebase Hosting (proyecto `portafolio-71784`); cada PR del mismo repo despliega un canal de preview `pr-<n>` (7 días).
