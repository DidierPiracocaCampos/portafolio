# Presentación ASCII + SEO Programador Angular Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactorizar el apartado de presentación para mostrar el bloque Unicode exacto del nombre como arte visual único con degradado animado, alineación izquierda y comportamiento responsive DIDIER/PIRACOCA apilado en móvil, más entrada `prompt → nombre → mensaje`, sin duplicar "Didier Piracoca" visible y priorizando SEO para "Programador Angular / Angular Developer".

**Architecture:** Mantener `Presentation` como standalone OnPush estático sin signals. El `h1` visible pasa a ser el título profesional orientado a SEO; el arte del nombre vive como bloque decorativo `role="img"` con `aria-label="Didier Piracoca"` y dos `<pre>` (DIDIER y PIRACOCA) para controlar responsive. Animación 100% CSS con `animation-delay` y `prefers-reduced-motion`. Traducciones y `seo.title/description` priorizan rol tecnológico; `sitemap`, `robots`, `hreflang` y `canonical` se mantienen. Corregir `firebase.json` para que Hosting publique el output real de Angular (`dist/portafolio/browser`).

**Tech Stack:** Angular 20.3.18, TypeScript 5.9, Tailwind CSS 4.3, daisyUI 5.5, Cascadia Code, @ngx-translate/core 18, Vitest 3.1, Firebase Hosting

## Global Constraints

- No duplicar "DIDIER PIRACOCA" visible: el arte aparece una sola vez; el `h1` visible es "Programador Angular y Desarrollador Frontend" (ES) / "Angular Developer and Frontend Developer" (EN).
- Usar exactamente el bloque Unicode enviado, dividido en DIDIER y PIRACOCA para responsive.
- Arte con degradado animado y responsive: fila en desktop, columna en móvil.
- Todo alineado a la izquierda.
- Secuencia de entrada `inicializa (prompt) → nombre (arte) → mensaje (h1 + subtítulo + descripción)` solo con CSS, con fallback `prefers-reduced-motion`.
- SEO prioriza "Programador Angular / Angular Developer", no el nombre; no usar `meta keywords`.
- Mantener `ChangeDetectionStrategy.OnPush`, standalone sin `standalone:true`, `TranslatePipe` y `inject()` si hace falta.
- Medidas fluidas con `clamp()`/`min()`/`ch`, sin alturas fijas, sin scroll horizontal en 320px.
- Accesibilidad: `section[aria-labelledby]` apunta al `h1`, prompt `aria-hidden="true"`, arte `role="img" aria-label="Didier Piracoca"`.
- Corregir prefijo duplicado `>` del prompt.

---

## File Structure

**Crear:**

- Ninguno (plan reutiliza componente existente).

**Modificar:**

- `public/i18n/es.json:1-152` — cambiar `presentation.title` a título profesional, añadir `presentation.ascii` si se quiere, actualizar `seo.title`/`seo.description` para SEO programador angular.
- `public/i18n/en.json:1-152` — idem en inglés.
- `src/app/features/home/ui/presentation/presentation.html:1-20` — nuevo markup con prompt corregido, bloque ASCII doble `<pre>`, `h1` SEO, subtítulo y descripción.
- `src/app/features/home/ui/presentation/presentation.css:1-84` — layout left, tipografía fluida, degradado animado, responsive, keyframes y reduced-motion.
- `src/index.html:1-29` — actualizar `<title>` y `<meta name="description">`/`og:*` iniciales para role-first.
- `public/index.html:1-13` — idem para fallback estático.
- `src/app/core/i18n/seo.service.ts:1-154` — actualizar fallbacks de descripción y asegurar títulos role-first.
- `src/app/app.html:1-27` — cambiar `didier@portfolio:~` por `dev@portfolio:~` para no repetir nombre en shell.
- `src/app/features/home/ui/presentation/presentation.spec.ts:1-139` — actualizar tests para nuevo `h1`, arte y orden DOM.
- `src/app/features/home/home.spec.ts:1-451` — actualizar expectativa `h1`.
- `src/app/app.spec.ts:1-77` — actualizar expectativa título ventana.
- `firebase.json:1-15` — cambiar `hosting.public` de `public` a `dist/portafolio/browser`.

**No tocar:**

- `angular.json`, `package.json`, `tsconfig.json`, `src/styles.css` (salvo que sea imprescindible).

---

### Task 1: Actualizar traducciones y SEO i18n para priorizar Programador Angular

**Files:**
- Modify: `public/i18n/es.json:1-152`
- Modify: `public/i18n/en.json:1-152`
- Test: `src/app/features/home/ui/presentation/presentation.spec.ts` (ajuste de expectativas, verificación posterior)

**Interfaces:**
- Consumes: claves actuales `presentation.*` y `seo.*`
- Produces: nuevas claves `presentation.title` con rol profesional y `seo` role-first usadas por `SeoService` y `presentation.html`

- [ ] **Step 1: Verificar estado actual de i18n**

Run: `cat public/i18n/es.json` y `cat public/i18n/en.json` (o Read)
Expected: `presentation.title` es `DIDIER PIRACOCA`, `seo.title` es `Didier Piracoca — Portafolio/Portfolio`

- [ ] **Step 2: Actualizar es.json**

```json
{
  "presentation": {
    "prompt": ["> inicializando portafolio ...", "> cargando proyectos ...", "> sistema listo"],
    "title": "Programador Angular y Desarrollador Frontend",
    "subtitle": "Desarrollador de Aplicaciones Multiplataforma",
    "description": [
      "Actualmente enfocado en Angular y desarrollo frontend moderno.",
      "Experiencia con sistemas Java, Spring MVC y SQL."
    ]
  },
  "seo": {
    "title": "Programador Angular y Desarrollador Frontend | Portafolio",
    "description": "Programador Angular y desarrollador frontend especializado en Angular, desarrollo web moderno, Java, Spring MVC, SQL y Firebase. Portafolio de Didier Piracoca."
  }
}
```

Mantener resto del archivo intacto (language, skills, experience, projects, contact).

- [ ] **Step 3: Actualizar en.json**

```json
{
  "presentation": {
    "prompt": ["> initializing portfolio ...", "> loading projects ...", "> system ready"],
    "title": "Angular Developer and Frontend Developer",
    "subtitle": "Multiplatform Application Developer",
    "description": [
      "Currently focused on Angular and modern frontend development.",
      "Experience with Java, Spring MVC and SQL systems."
    ]
  },
  "seo": {
    "title": "Angular Developer and Frontend Developer | Portfolio",
    "description": "Angular and frontend developer specialized in Angular, modern web development, Java, Spring MVC, SQL and Firebase. Portfolio by Didier Piracoca."
  }
}
```

- [ ] **Step 4: Verificar JSON válido**

Run: `node -e "JSON.parse(require('fs').readFileSync('public/i18n/es.json','utf8')); JSON.parse(require('fs').readFileSync('public/i18n/en.json','utf8')); console.log('ok')"`
Expected: `ok`

- [ ] **Step 5: Commit**

```bash
git add public/i18n/es.json public/i18n/en.json
git commit -m "feat(i18n): prioritize Angular Developer role in presentation and seo titles"
```

---

### Task 2: Refactorizar markup de Presentation — arte ASCII único, h1 SEO y corrección prompt

**Files:**
- Modify: `src/app/features/home/ui/presentation/presentation.html:1-20`
- Modify: `src/app/features/home/ui/presentation/presentation.ts:1-11` (sin cambios lógicos, solo verificar OnPush)
- Test: `src/app/features/home/ui/presentation/presentation.spec.ts`

**Interfaces:**
- Consumes: traducciones de Task 1 (`presentation.title`, `subtitle`, `description`, `prompt`)
- Produces: DOM ordenado `prompt → ascii (DIDIER + PIRACOCA) → h1 → subtitle → description` con `aria-*` correctos

- [ ] **Step 1: Escribir tests fallidos para nuevo comportamiento**

Agregar a `presentation.spec.ts` (bloque dentro de describe):

```ts
it('should render h1 with Angular Developer role not DIDIER', async () => {
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  await fixture.whenStable();
  const h1 = fixture.nativeElement.querySelector('#presentation-title');
  expect(h1?.textContent?.trim()).toBe('Angular Developer and Frontend Developer');
  expect(h1?.textContent?.trim()).not.toBe('DIDIER PIRACOCA');
});
it('should render single visual ASCII art with DIDIER and PIRACOCA blocks and accessible label', async () => {
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  await fixture.whenStable();
  const ascii = fixture.nativeElement.querySelector('.presentation__ascii');
  expect(ascii).toBeTruthy();
  expect(ascii.getAttribute('role')).toBe('img');
  expect(ascii.getAttribute('aria-label')).toBe('Didier Piracoca');
  const didier = fixture.nativeElement.querySelector('.presentation__ascii-didier');
  const piracoca = fixture.nativeElement.querySelector('.presentation__ascii-piracoca');
  expect(didier).toBeTruthy();
  expect(piracoca).toBeTruthy();
  expect(didier.textContent).toContain('██████╗');
  expect(piracoca.textContent).toContain('██████╗');
  // No duplicar DIDIER PIRACOCA como texto visible fuera del arte
  const h1 = fixture.nativeElement.querySelector('h1');
  expect(h1.textContent).not.toContain('DIDIER PIRACOCA');
});
it('should keep prompt without duplicated > prefix and aria-hidden', async () => {
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  await fixture.whenStable();
  const prompt = fixture.nativeElement.querySelector('.presentation__prompt');
  expect(prompt.getAttribute('aria-hidden')).toBe('true');
  expect(prompt.textContent).not.toContain('> >');
  expect(prompt.textContent).toContain('> initializing portfolio');
});
it('should keep DOM order prompt -> ascii -> h1 -> subtitle -> description', async () => {
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  await fixture.whenStable();
  const order = Array.from(
    fixture.nativeElement.querySelectorAll('.presentation__prompt, .presentation__ascii, h1, .presentation__subtitle, .presentation__description p')
  ).map((n: Element) => n.className || n.tagName);
  expect(order[0]).toContain('presentation__prompt');
  expect(order[1]).toContain('presentation__ascii');
  expect(order[2]).toBe('H1');
});
```

Run: `pnpm exec vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: FAIL (h1 sigue siendo DIDIER, ascii no existe, prompt duplicado)

- [ ] **Step 2: Actualizar presentation.html completo**

```html
<section class="presentation" aria-labelledby="presentation-title">
  <div class="presentation__inner">
    <p class="presentation__prompt" aria-hidden="true">
      <span>{{ 'presentation.prompt.0' | translate }}</span>
      <span>{{ 'presentation.prompt.1' | translate }}</span>
      <span>{{ 'presentation.prompt.2' | translate }}</span>
    </p>

    <div class="presentation__ascii" role="img" aria-label="Didier Piracoca" aria-hidden="false">
      <pre class="presentation__ascii-block presentation__ascii-didier" aria-hidden="true">██████╗░██╗██████╗░██╗███████╗██████╗░
██╔══██╗██║██╔══██╗██║██╔════╝██╔══██╗
██║░░██║██║██║░░██║██║█████╗░░██████╔╝
██║░░██║██║██║░░██║██║██╔══╝░░██╔══██╗
██████╔╝██║██████╔╝██║███████╗██║░░██║
╚═════╝░╚═╝╚═════╝░╚═╝╚══════╝╚═╝░░╚═╝</pre>
      <pre class="presentation__ascii-block presentation__ascii-piracoca" aria-hidden="true">██████╗░██╗██████╗░░█████╗░░█████╗░░█████╗░░█████╗░░█████╗░
██╔══██╗██║██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗██╔══██╗
██████╔╝██║██████╔╝███████║██║░░╚═╝██║░░██║██║░░╚═╝███████║
██╔═══╝░██║██╔══██╗██╔══██║██║░░██╗██║░░██║██║░░██╗██╔══██║
██║░░░░░██║██║░░██║██║░░██║╚█████╔╝╚█████╔╝╚█████╔╝██║░░██║
╚═╝░░░░░╚═╝╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░░╚════╝░░╚════╝░╚═╝░░╚═╝</pre>
    </div>

    <h1 id="presentation-title" class="presentation__title">{{ 'presentation.title' | translate }}</h1>

    <p class="presentation__subtitle">{{ 'presentation.subtitle' | translate }}</p>

    <div class="presentation__description">
      <p>{{ 'presentation.description.0' | translate }}</p>
      <p>{{ 'presentation.description.1' | translate }}</p>
    </div>
  </div>
</section>
```

Notas:
- Elimina `&gt;` manual para evitar `> >` (prompt ya trae `>`).
- Divide exactamente el bloque proporcionado: DIDIER = columnas izquierdas, PIRACOCA = columnas derechas (respetar salto y ancho original).
- `role="img"` con `aria-label` da nombre accesible sin duplicar texto visible.

- [ ] **Step 3: Ejecutar tests y verificar PASS parcial**

Run: `pnpm exec vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: nuevos tests PASS, viejos que esperan DIDIER fallan (se corrigen en Task 5)

- [ ] **Step 4: Commit**

```bash
git add src/app/features/home/ui/presentation/presentation.html
git commit -m "feat(presentation): single ascii art with DIDIER/PIRACOCA blocks and SEO h1"
```

---

### Task 3: Estilos — left align, degradado animado, responsive y secuencia de entrada

**Files:**
- Modify: `src/app/features/home/ui/presentation/presentation.css:1-84`

**Interfaces:**
- Consumes: tokens `src/styles.css` (`--color-primary`, `--color-secondary`, `--color-accent`, `--color-base-100`, `--font-sans`)
- Produces: layout izquierda, ascii fluido con gradiente, animación entrada y mobile stacking

- [ ] **Step 1: Escribir test de clases y responsive hooks (opcional)**

```ts
it('should have left-aligned ascii with gradient class', async () => {
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  await fixture.whenStable();
  const ascii = fixture.nativeElement.querySelector('.presentation__ascii');
  const didier = fixture.nativeElement.querySelector('.presentation__ascii-didier');
  const piracoca = fixture.nativeElement.querySelector('.presentation__ascii-piracoca');
  expect(ascii).toBeTruthy();
  expect(didier).toBeTruthy();
  expect(piracoca).toBeTruthy();
});
```

Run: `pnpm exec vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: PASS (clases existen tras Task 2, estilos aún vacíos)

- [ ] **Step 2: Implementar CSS completo**

```css
:host { display: block; }
.presentation {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
  background: var(--color-base-100);
  color: var(--color-base-content);
}
.presentation__inner {
  width: min(100%, 75ch);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: clamp(0.6rem, 2vw, 1rem);
}
.presentation__prompt {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-family: var(--font-sans), ui-monospace, monospace;
  font-size: clamp(0.75rem, 1.8vw, 0.875rem);
  line-height: 1.6;
  color: color-mix(in oklch, var(--color-base-content) 70%, transparent);
  letter-spacing: 0.02em;
  animation: presentation-enter 0.5s ease-out both;
  animation-delay: 0.1s;
}
.presentation__ascii {
  display: flex;
  flex-direction: row;
  gap: clamp(0.75rem, 2vw, 1.5rem);
  align-items: flex-start;
  width: 100%;
  overflow-x: auto;
  scrollbar-width: none;
  animation: presentation-enter 0.6s ease-out both;
  animation-delay: 0.45s;
}
.presentation__ascii::-webkit-scrollbar { display: none; }
.presentation__ascii-block {
  margin: 0;
  font-family: var(--font-sans), ui-monospace, monospace;
  font-size: clamp(0.22rem, 0.9vw, 0.58rem);
  line-height: 1.05;
  letter-spacing: 0;
  white-space: pre;
  background: linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-accent), var(--color-primary));
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: ascii-gradient 4.5s linear infinite;
  flex-shrink: 0;
}
.presentation__title {
  margin: 0;
  font-size: clamp(1.6rem, 4.5vw, 2.6rem);
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 800;
  color: var(--color-base-content);
  text-wrap: balance;
  max-width: 22ch;
  animation: presentation-enter 0.55s ease-out both;
  animation-delay: 0.85s;
}
.presentation__subtitle {
  margin: 0;
  font-size: clamp(1rem, 3vw, 1.25rem);
  line-height: 1.3;
  font-weight: 500;
  color: color-mix(in oklch, var(--color-base-content) 85%, transparent);
  text-wrap: balance;
  animation: presentation-enter 0.5s ease-out both;
  animation-delay: 1.05s;
}
.presentation__description {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 62ch;
  font-size: clamp(0.875rem, 2.4vw, 1rem);
  line-height: 1.65;
  color: color-mix(in oklch, var(--color-base-content) 78%, transparent);
  animation: presentation-enter 0.5s ease-out both;
  animation-delay: 1.2s;
}
.presentation__description p { margin: 0; text-wrap: pretty; }
@keyframes presentation-enter {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes ascii-gradient {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@media (max-width: 640px) {
  .presentation { padding: 1.5rem 1rem; }
  .presentation__ascii { flex-direction: column; gap: 0.35rem; }
  .presentation__ascii-block { font-size: clamp(0.28rem, 1.8vw, 0.52rem); }
  .presentation__title { font-size: clamp(1.45rem, 7vw, 1.9rem); }
}
@media (prefers-reduced-motion: reduce) {
  .presentation__prompt, .presentation__ascii, .presentation__title, .presentation__subtitle, .presentation__description {
    animation: none !important;
  }
  .presentation__ascii-block { animation: none !important; }
}
```

- [ ] **Step 3: Verificar visual y tests**

Run: `pnpm exec vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: PASS

Manual: `pnpm start` → verificar: 320px una palabra debajo de otra, 640px+ fila, degradado animado, left align, sin overflow horizontal, secuencia visible prompt→nombre→mensaje.

- [ ] **Step 4: Commit**

```bash
git add src/app/features/home/ui/presentation/presentation.css
git commit -m "feat(presentation): left align, gradient ascii and entrance sequence"
```

---

### Task 4: Actualizar SEO, index.html, app shell y deploy config

**Files:**
- Modify: `src/index.html:1-29`
- Modify: `public/index.html:1-13`
- Modify: `src/app/core/i18n/seo.service.ts:1-154`
- Modify: `src/app/app.html:1-27`
- Modify: `firebase.json:1-15`

**Interfaces:**
- Consumes: i18n seo keys de Task 1
- Produces: títulos role-first en HTML inicial y runtime, shell sin nombre y hosting apunta a build real

- [ ] **Step 1: Actualizar src/index.html**

```html
<title>Programador Angular y Desarrollador Frontend | Portafolio — Didier Piracoca</title>
<meta name="description" content="Programador Angular y desarrollador frontend especializado en Angular, desarrollo web moderno, Java, Spring MVC, SQL y Firebase. Portafolio de Didier Piracoca." />
<meta property="og:title" content="Programador Angular y Desarrollador Frontend | Portafolio — Didier Piracoca" />
<meta property="og:description" content="Programador Angular y desarrollador frontend especializado en Angular, desarrollo web moderno, Java, Spring MVC, SQL y Firebase. Portafolio de Didier Piracoca." />
```

Mantener charset, viewport, hreflang, canonical y og:locale.

Versión EN fallback se actualizará vía SeoService al cambiar idioma.

- [ ] **Step 2: Actualizar public/index.html** (usado como fallback estático)

```html
<title>Programador Angular y Desarrollador Frontend | Portafolio — Didier Piracoca</title>
```

O si se prefiere genérico, usar el mismo título que src/index.html.

- [ ] **Step 3: Actualizar seo.service.ts fallbacks**

```ts
const fallbackDesc =
  lang === 'es'
    ? 'Programador Angular y desarrollador frontend especializado en Angular, desarrollo web moderno, Java, Spring MVC, SQL y Firebase. Portafolio de Didier Piracoca.'
    : 'Angular and frontend developer specialized in Angular, modern web development, Java, Spring MVC, SQL and Firebase. Portfolio by Didier Piracoca.';
```

Verificar `setTitleAndDescription` sigue usando `translate.instant('seo.title')`.

- [ ] **Step 4: Cambiar app.html shell title**

Reemplazar:
```html
<span class="app-shell__title">didier@portfolio:~</span>
```
por:
```html
<span class="app-shell__title">dev@portfolio:~</span>
```

- [ ] **Step 5: Corregir firebase.json**

```json
{
  "hosting": {
    "public": "dist/portafolio/browser",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  },
  "database": { "rules": "database.rules.json" }
}
```

- [ ] **Step 6: Verificar**

Run: `node -e "JSON.parse(require('fs').readFileSync('firebase.json','utf8')); console.log('firebase ok')"`
Run: `pnpm run build` (verificar output en dist/portafolio/browser/index.html contiene nuevo title)
Expected: BUILD SUCCESS, firebase ok

- [ ] **Step 7: Commit**

```bash
git add src/index.html public/index.html src/app/core/i18n/seo.service.ts src/app/app.html firebase.json
git commit -m "feat(seo): role-first titles and fix hosting public path"
```

---

### Task 5: Ajustar tests y verificación final

**Files:**
- Modify: `src/app/features/home/ui/presentation/presentation.spec.ts:1-139`
- Modify: `src/app/features/home/home.spec.ts:1-451`
- Modify: `src/app/app.spec.ts:1-77`

**Interfaces:**
- Consumes: markup de Task 2 y estilos de Task 3
- Produces: suite verde con expectativas SEO

- [ ] **Step 1: Corregir presentation.spec.ts**

- Cambiar expectativa `DIDIER PIRACOCA` por `Angular Developer and Frontend Developer`
- Añadir nuevos tests de Task 2 si no se añadieron antes
- Mantener tests de orden, aria, BEM

Fragmento de `enTranslations` actualizado:

```ts
const enTranslations = {
  presentation: {
    prompt: ['> initializing portfolio ...', '> loading projects ...', '> system ready'],
    title: 'Angular Developer and Frontend Developer',
    subtitle: 'Multiplatform Application Developer',
    description: [
      'Currently focused on Angular and modern frontend development.',
      'Experience with Java, Spring MVC and SQL systems.',
    ],
  },
  seo: {
    title: 'Angular Developer and Frontend Developer | Portfolio',
    description: 'Angular and frontend developer specialized in Angular, modern web development, Java, Spring MVC, SQL and Firebase. Portfolio by Didier Piracoca.'
  }
};
```

Y para ES:

```ts
translate.setTranslation('es', {
  presentation: {
    prompt: ['> inicializando portafolio ...', '> cargando proyectos ...', '> sistema listo'],
    title: 'Programador Angular y Desarrollador Frontend',
    subtitle: 'Desarrollador de Aplicaciones Multiplataforma',
    description: [
      'Actualmente enfocado en Angular y desarrollo frontend moderno.',
      'Experiencia con sistemas Java, Spring MVC y SQL.',
    ],
  },
  seo: { title: 'Programador Angular y Desarrollador Frontend | Portafolio', description: '...' }
});
```

Actualizar:

```ts
it('should render h1 with DIDIER PIRACOCA' -> 'should render h1 with Angular Developer...')
expect(h1?.textContent?.trim()).toBe('Angular Developer and Frontend Developer');
```

Y mantener test de switch a español que verifica `Programador Angular...`

- [ ] **Step 2: Corregir home.spec.ts**

Cambiar:

```ts
expect(el.querySelector('h1')?.textContent?.trim()).toBe('DIDIER PIRACOCA');
```

por:

```ts
expect(el.querySelector('h1')?.textContent?.trim()).toBe('Angular Developer and Frontend Developer');
```

Y en `enTranslations`/`esTranslations` de home.spec, actualizar `presentation.title` igual que arriba.

- [ ] **Step 3: Corregir app.spec.ts**

Cambiar:

```ts
expect(compiled.querySelector('.app-shell__title')?.textContent?.trim()).toBe('didier@portfolio:~');
```

por:

```ts
expect(compiled.querySelector('.app-shell__title')?.textContent?.trim()).toBe('dev@portfolio:~');
```

- [ ] **Step 4: Ejecutar suite completa**

Run: `pnpm exec vitest run`
Expected: All PASS (presentation, home, app, experience, skills, projects, contact)

Run: `pnpm run build`
Expected: SUCCESS, sin errores anyComponentStyle

Run: `pnpm run lint`
Expected: 0 errors (o warnings preexistentes)

Manual: `pnpm start` → verificar en 320px stacking, left align, degradado, entrada secuencial, no duplicado visible, h1 SEO.

- [ ] **Step 5: Commit final**

```bash
git add src/app/features/home/ui/presentation/presentation.spec.ts src/app/features/home/home.spec.ts src/app/app.spec.ts
git commit -m "test: update expectations for Angular role SEO and ascii presentation"
```

---

## Self-Review

**1. Spec coverage:** Arte único DIDIER/PIRACOCA + degradado (Tasks 2-3), left align + responsive mobile stacking (Task 3), entrada inicializa→nombre→mensaje CSS-only + reduced-motion (Task 3), sin duplicar DIDIER visible (Tasks 2,5), SEO programador angular (Tasks 1,4).
**2. Placeholder scan:** Sin TBD/TODO; cada step con código completo.
**3. Type consistency:** `app-presentation` OnPush, `TranslatePipe` único import, clases BEM `presentation__ascii(-didier|-piracoca)` consistentes, `seo.title/description` keys consistentes.
