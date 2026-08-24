# Presentacion Hero (Cabecera) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar la cabecera de presentación de `Desktop - 1` (Figma Porfolio) como sección hero estática, accesible y responsive dentro de `Home`, reproduciendo prompt de terminal, `DIDIER PIRACOCA` dorado glitch, subtítulo y descripción de dos líneas con jerarquía visual fiel.

**Architecture:** `Home` (`src/app/features/home/` lazy en `''`) compone un nuevo componente standalone hijo `Presentation` (`features/home/ui/presentation/`). Contenido 100% estático sin signals, `ChangeDetectionStrategy.OnPush`, template semántico y CSS encapsulado. Tailwind 4 + daisyUI `gold` dark (`base-100` casi negro + `primary` dorado + `base-content` casi blanco + `Cascadia Code` monoespaciada). Escalas fluidas con `clamp()`/`ch`/`min()`, sin dimensiones fijas Figma.

**Tech Stack:** Angular 20.3.18, TypeScript 5.9, Tailwind CSS 4.3.0, daisyUI 5.5.19, Cascadia Code, Vitest 3.1, @angular/build:application, ESLint + Prettier, pnpm

## Global Constraints

- Implementar la cabecera como componente standalone compatible con Angular 20, con contenido estático en la plantilla y estilos encapsulados para no afectar otras pantallas.
- Usar HTML semántico: nombre como `h1` real y subtítulo/descripción como texto semántico, sin convertir información en imagen.
- Tratar el prompt como decorativo si no aporta información funcional; ocultarlo a tecnologías de asistencia (`aria-hidden="true"`) y mantener el contenido profesional accesible por separado.
- Verificar contraste entre texto claro, amarillo del titular y fondo oscuro con herramienta WCAG AA. No depender únicamente del efecto glitch para comunicar el nombre.
- Mantener tamaño de texto y altura de línea legibles al reducir viewport; el tratamiento pixelado del titular no debe impedir reconocer las letras.
- Respetar orden de lectura prompt → nombre → subtítulo → descripción en el DOM, y conservar foco visible si se incorporan controles alrededor de la cabecera.
- Usar medidas fluidas para ancho de columna y tamaño del titular, con límites que eviten que las dos líneas descriptivas se vuelvan demasiado largas o demasiado estrechas.
- Permitir que la descripción se ajuste de forma natural y conservar orden vertical en pantallas pequeñas, sin fijar alturas que recorten el texto.
- Revisar espaciado y tamaño del nombre en anchos reducidos para evitar desbordamiento del efecto pixelado.
- Aplicar layout y escalas fluidas con CSS responsive en lugar de depender de dimensiones fijas tomadas del frame de Figma.
- Mantener identidad visual en CSS: fondo oscuro, tipografía monoespaciada para prompt y cuerpo, y tratamiento separado para titular. Evitar incrustar texto en captura.
- Si la imagen de referencia se muestra dentro de la aplicación, usar `NgOptimizedImage`; la captura de esta documentación no requiere integración en runtime.
- No se necesitan señales para este contenido estático. Si los textos se vuelven configurables, tiparlos como datos de presentación y mantener plantilla solo de estructura.
- Seguir best practices Angular 20: standalone sin `standalone:true`, `ChangeDetectionStrategy.OnPush`, `class`/`style` bindings, `@if`/`@for` si hace falta, `inject()` vs constructor.
- Color system existente: `src/styles.css` tema `gold` (`--color-base-100: oklch(9% 0.004 286)`, `--color-base-content: oklch(96% 0.01 85)`, `--color-primary: oklch(75% 0.16 85)`), `Cascadia Code` vía `@import` + `@theme --font-sans`.

---

## File Structure

**Crear:**

- `src/app/features/home/ui/presentation/presentation.ts` — componente standalone `app-presentation`, OnPush, lógica nula (solo estático)
- `src/app/features/home/ui/presentation/presentation.html` — markup semántico ordenado
- `src/app/features/home/ui/presentation/presentation.css` — layout centrado columna estrecha, tipografía fluida, dorado glitch sutil, prompt mono, responsive sin alturas fijas
- `src/app/features/home/ui/presentation/presentation.spec.ts` — tests Vitest/Angular TestBed para contenido, semántica, aria y orden DOM

**Modificar:**

- `src/app/features/home/home.ts:1-10` — importar `Presentation` y añadirlo a `imports`
- `src/app/features/home/home.html:1-15` — reemplazar ASCII art placeholder (dos `<p>` con bloques `█`) por `<app-presentation />` dentro de layout existente
- `src/app/app.html:1-7` — mantener `mockup-code` global (decisión usuario: sí mantener)
- `src/styles.css:1-7` — no tocar salvo añadir `@utility` si se requiere, pero respetar tokens existentes

**No tocar:**

- `angular.json`, `package.json`, `tsconfig.json` (salvo fix de `test` target `buildTarget` si bloquea `ng test`)

---

### Task 1: Esqueleto del componente `Presentation` (TDD bootstrap)

**Files:**

- Create: `src/app/features/home/ui/presentation/presentation.ts`
- Create: `src/app/features/home/ui/presentation/presentation.html` (placeholder vacío inicial)
- Create: `src/app/features/home/ui/presentation/presentation.css` (vacío inicial)
- Create: `src/app/features/home/ui/presentation/presentation.spec.ts`
- Test: `src/app/features/home/ui/presentation/presentation.spec.ts`

**Interfaces:**

- Consumes: Angular 20 standalone, `ChangeDetectionStrategy.OnPush`
- Produces: `export default class Presentation` selector `app-presentation` importable por `Home`

- [ ] **Step 1: Escribir el test fallido de existencia del componente**

```ts
// src/app/features/home/ui/presentation/presentation.spec.ts
import { TestBed } from '@angular/core/testing';
import Presentation from './presentation';

describe('Presentation', () => {
  it('should create', async () => {
    await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
    const fixture = TestBed.createComponent(Presentation);
    expect(fixture.componentInstance).toBeTruthy();
  });
  it('should render h1 with DIDIER PIRACOCA', async () => {
    await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
    const fixture = TestBed.createComponent(Presentation);
    fixture.detectChanges();
    const h1 = fixture.nativeElement.querySelector('h1');
    expect(h1?.textContent?.trim()).toBe('DIDIER PIRACOCA');
  });
});
```

- [ ] **Step 2: Ejecutar test y verificar fallo**

Run: `npx vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: FAIL `Cannot find module './presentation'` / `Failed to resolve import`

- [ ] **Step 3: Implementación mínima del componente**

```ts
// src/app/features/home/ui/presentation/presentation.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-presentation',
  imports: [],
  templateUrl: './presentation.html',
  styleUrl: './presentation.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Presentation {}
```

```html
<!-- src/app/features/home/ui/presentation/presentation.html -->
<p>placeholder</p>
```

```css
/* src/app/features/home/ui/presentation/presentation.css */
/* vacío intencional - estilos en Task 3 */
```

- [ ] **Step 4: Ejecutar test y verificar pasa parcialmente**

Run: `npx vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: 1 passed (create), 1 failed (h1 no es DIDIER PIRACOCA) — confirma esqueleto funciona, falta markup real (se completa en Task 2)

- [ ] **Step 5: Commit**

```bash
git add src/app/features/home/ui/presentation/presentation.ts src/app/features/home/ui/presentation/presentation.html src/app/features/home/ui/presentation/presentation.css src/app/features/home/ui/presentation/presentation.spec.ts
git commit -m "feat(presentation): bootstrap standalone Presentation component skeleton"
```

---

### Task 2: Markup semántico estático con orden DOM correcto

**Files:**

- Modify: `src/app/features/home/ui/presentation/presentation.html:1-1`
- Test: `src/app/features/home/ui/presentation/presentation.spec.ts` (ampliar)

**Interfaces:**

- Consumes: `Presentation` de Task 1
- Produces: DOM con `section[aria-labelledby] > p[aria-hidden] prompt (3 líneas) + h1#presentation-title + p.subtitle + div.description(2 p)` en orden exacto

- [ ] **Step 1: Ampliar tests para todo el contenido y accesibilidad**

```ts
// Añadir a src/app/features/home/ui/presentation/presentation.spec.ts dentro de describe
it('should render prompt with 3 lines and aria-hidden', async () => {
  await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  const prompt = fixture.nativeElement.querySelector('.presentation__prompt');
  expect(prompt.getAttribute('aria-hidden')).toBe('true');
  const lines = prompt.textContent;
  expect(lines).toContain('> initializing portfolio ...');
  expect(lines).toContain('> loading projects ...');
  expect(lines).toContain('> system ready');
});
it('should render subtitle and two description lines in correct DOM order', async () => {
  await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  const el = fixture.nativeElement;
  const order = Array.from(
    el.querySelectorAll(
      '.presentation__prompt, h1, .presentation__subtitle, .presentation__description p',
    ),
  ).map((n: Element) => n.textContent?.trim());
  expect(order[0]).toContain('initializing');
  expect(order[1]).toBe('DIDIER PIRACOCA');
  expect(order[2]).toBe('Multiplatform Application Developer');
  expect(order[3]).toBe('Currently focused on Angular and modern frontend development.');
  expect(order[4]).toBe('Experience with Java, Spring MVC and SQL systems.');
});
it('should use section with aria-labelledby pointing to h1', async () => {
  await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  const section = fixture.nativeElement.querySelector('section');
  const h1 = fixture.nativeElement.querySelector('h1');
  expect(section.getAttribute('aria-labelledby')).toBe(h1.id);
  expect(h1.id).toBe('presentation-title');
});
```

- [ ] **Step 2: Ejecutar y verificar fallo**

Run: `npx vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: FAIL — prompt no encontrado, h1 es placeholder, orden incorrecto

- [ ] **Step 3: Implementar plantilla semántica completa**

```html
<!-- src/app/features/home/ui/presentation/presentation.html -->
<section class="presentation" aria-labelledby="presentation-title">
  <div class="presentation__inner">
    <p class="presentation__prompt" aria-hidden="true">
      <span>&gt; initializing portfolio ...</span>
      <span>&gt; loading projects ...</span>
      <span>&gt; system ready</span>
    </p>

    <h1 id="presentation-title" class="presentation__title">DIDIER PIRACOCA</h1>

    <p class="presentation__subtitle">Multiplatform Application Developer</p>

    <div class="presentation__description">
      <p>Currently focused on Angular and modern frontend development.</p>
      <p>Experience with Java, Spring MVC and SQL systems.</p>
    </div>
  </div>
</section>
```

- [ ] **Step 4: Ejecutar y verificar PASS**

Run: `npx vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: 4 passed (create + h1 + prompt + subtitle/description + aria-labelledby) — 5 tests totales

- [ ] **Step 5: Commit**

```bash
git add src/app/features/home/ui/presentation/presentation.html src/app/features/home/ui/presentation/presentation.spec.ts
git commit -m "feat(presentation): add semantic static markup with correct DOM order and aria"
```

---

### Task 3: Estilos encapsulados — layout, tipografía fluida y efecto dorado glitch sutil

**Files:**

- Modify: `src/app/features/home/ui/presentation/presentation.css:1-1`
- Test: `src/app/features/home/ui/presentation/presentation.spec.ts` (opcional test visual regresión no requerido, pero añadir test de clase)

**Interfaces:**

- Consumes: tokens CSS `src/styles.css` (`--color-base-100`, `--color-base-content`, `--color-primary`, `--font-sans Cascadia Code`)
- Produces: columna centrada estrecha `min(100%,55ch)`, fondo oscuro, prompt mono `clamp(0.7rem,2vw,0.875rem)` opacity, titular `clamp(2.2rem,10vw,5.2rem)` dorado con contorno+glitch sutil, subtítulo `clamp(1rem,3vw,1.35rem)`, descripción `clamp(0.875rem,2.4vw,1rem)` natural wrap, gaps breves, sin alturas fijas

- [ ] **Step 1: Escribir test de clases presentes (opcional pero útil para regresión)**

```ts
it('should apply BEM classes for styling hooks', async () => {
  await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  const el = fixture.nativeElement;
  expect(el.querySelector('.presentation')).toBeTruthy();
  expect(el.querySelector('.presentation__inner')).toBeTruthy();
  expect(el.querySelector('.presentation__prompt')).toBeTruthy();
  expect(el.querySelector('.presentation__title')).toBeTruthy();
  expect(el.querySelector('.presentation__subtitle')).toBeTruthy();
  expect(el.querySelector('.presentation__description')).toBeTruthy();
});
```

- [ ] **Step 2: Ejecutar y verificar que clases existen (ya pasan, estilos aún vacíos)**

Run: `npx vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: PASS clases, pero visualmente sin estilo (validar manual con `pnpm start` luego)

- [ ] **Step 3: Implementar CSS completo encapsulado**

```css
/* src/app/features/home/ui/presentation/presentation.css */
:host {
  display: block;
}

.presentation {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
  background: var(--color-base-100);
  color: var(--color-base-content);
}

.presentation__inner {
  width: min(100%, 55ch);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: clamp(0.5rem, 2vw, 0.9rem);
}

.presentation__prompt {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  font-family: var(--font-sans), ui-monospace, monospace;
  font-size: clamp(0.7rem, 1.8vw, 0.875rem);
  line-height: 1.6;
  color: color-mix(in oklch, var(--color-base-content) 70%, transparent);
  letter-spacing: 0.02em;
}

.presentation__title {
  margin: 0;
  font-size: clamp(2.2rem, 10vw, 5.2rem);
  line-height: 0.9;
  letter-spacing: -0.03em;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--color-primary);
  -webkit-text-stroke: 0.6px oklch(75% 0.16 85 / 0.9);
  text-shadow:
    2px 0 0 oklch(75% 0.16 85 / 0.35),
    -2px 0 0 oklch(63% 0.24 305 / 0.18),
    0 0 18px oklch(75% 0.16 85 / 0.25);
  text-wrap: balance;
  max-width: 100%;
  overflow-wrap: break-word;
}

.presentation__subtitle {
  margin: 0;
  font-size: clamp(1rem, 3vw, 1.35rem);
  line-height: 1.3;
  font-weight: 500;
  color: var(--color-base-content);
  text-wrap: balance;
}

.presentation__description {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  max-width: 60ch;
  font-size: clamp(0.875rem, 2.4vw, 1rem);
  line-height: 1.65;
  color: color-mix(in oklch, var(--color-base-content) 78%, transparent);
}

.presentation__description p {
  margin: 0;
  text-wrap: pretty;
}

@media (max-width: 360px) {
  .presentation__title {
    font-size: clamp(1.8rem, 11vw, 2.6rem);
    -webkit-text-stroke-width: 0.4px;
    text-shadow:
      1px 0 0 oklch(75% 0.16 85 / 0.3),
      -1px 0 0 oklch(63% 0.24 305 / 0.15);
  }
}
```

- [ ] **Step 4: Verificar visual y tests**

Run: `npx vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: 6 passed

Run manual: `pnpm start` → verificar responsive 320px, 768px, 1280px: columna no excede `55ch`, titular no desborda, glitch no corta letras.

Verificar contraste: `primary` sobre `base-100` ≈ 8.2:1, `base-content` 96% sobre 9% ≈ 18:1 (WCAG AA).

- [ ] **Step 5: Commit**

```bash
git add src/app/features/home/ui/presentation/presentation.css
git commit -m "feat(presentation): fluid layout centered column and gold glitch title styles"
```

---

### Task 4: Accesibilidad (WCAG AA) y responsive hardening

**Files:**

- Modify: `src/app/features/home/ui/presentation/presentation.html:1-13` (si añade `role`/`aria` adicional)
- Modify: `src/app/features/home/ui/presentation/presentation.css:1-70` (ajustes contraste/line-height)
- Test: `src/app/features/home/ui/presentation/presentation.spec.ts` (añadir axe test si disponible, si no manual)

**Interfaces:**

- Consumes: markup Task 2, estilos Task 3
- Produces: WCAG AA verificado, `aria-hidden` correcto, `h1` único, foco visible heredado, responsive sin recorte, line-height ≥1.5 para body

- [ ] **Step 1: Escribir tests de accesibilidad estructurales**

```ts
it('should keep description as semantic paragraphs not aria-hidden', async () => {
  await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  const desc = fixture.nativeElement.querySelector('.presentation__description');
  expect(desc.getAttribute('aria-hidden')).toBeNull();
  expect(desc.querySelectorAll('p').length).toBe(2);
});
it('should not have more than one h1', async () => {
  await TestBed.configureTestingModule({ imports: [Presentation] }).compileComponents();
  const fixture = TestBed.createComponent(Presentation);
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelectorAll('h1').length).toBe(1);
});
```

- [ ] **Step 2: Ejecutar y verificar fallo/paso**

Run: `npx vitest run src/app/features/home/ui/presentation/presentation.spec.ts`
Expected: PASS

- [ ] **Step 3: Ajustes finos CSS/HTML si needed**

- Confirmar `line-height` descripción 1.65 (≥1.5 WCAG).
- Confirmar `font-size` mínimo nunca <12px incluso con `clamp` en 320px (0.7rem ≈ 11.2px límite bajo — subir a `0.75rem` si Axe alerta).
- Verificar tab order: `prompt` no enfocable, `h1` no enfocable, orden lectura correcto.

- [ ] **Step 4: Verificación responsive manual**

Run: `pnpm start` + Chrome DevTools Device Toolbar

- 320px: titular no overflow, prompt legible, descripción wrap natural, columna ~90% ancho
- 768px: columna centrada, gaps breves, titular ~4rem
- 1440px: columna max 55ch, no estirada, titular max 5.2rem
- Zoom 200%: sin recorte, sin scroll horizontal

- [ ] **Step 5: Commit**

```bash
git add src/app/features/home/ui/presentation/presentation.html src/app/features/home/ui/presentation/presentation.css src/app/features/home/ui/presentation/presentation.spec.ts
git commit -m "feat(presentation): a11y and responsive hardening WCAG AA"
```

---

### Task 5: Integración en `Home`, limpieza placeholder y verificación final

**Files:**

- Modify: `src/app/features/home/home.ts:1-10`
- Modify: `src/app/features/home/home.html:1-15`
- Modify: `src/app/features/home/home.css:1-0` (dejar vacío o añadir host padding si needed)
- Modify: `src/app/app.html:1-7` (opcional: mantener `mockup-code` como decidido)
- Test: `src/app/features/home/home.spec.ts` (crear si no existe) + `src/app/app.spec.ts`

**Interfaces:**

- Consumes: `Presentation` terminado
- Produces: `Home` renderiza `<app-presentation />` como primera sección de la página vertical `Desktop - 1`

- [ ] **Step 1: Escribir test de integración en Home**

```ts
// src/app/features/home/home.spec.ts (crear si no existe)
import { TestBed } from '@angular/core/testing';
import Home from './home';

describe('Home', () => {
  it('should render app-presentation as first section', async () => {
    await TestBed.configureTestingModule({ imports: [Home] }).compileComponents();
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.querySelector('app-presentation')).toBeTruthy();
    expect(el.querySelector('h1')?.textContent?.trim()).toBe('DIDIER PIRACOCA');
  });
});
```

- [ ] **Step 2: Ejecutar y verificar fallo (Home aún tiene ASCII art)**

Run: `npx vitest run src/app/features/home/home.spec.ts`
Expected: FAIL `app-presentation` null

- [ ] **Step 3: Implementar integración**

```ts
// src/app/features/home/home.ts
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
```

```html
<!-- src/app/features/home/home.html -->
<app-presentation />
```

- [ ] **Step 4: Verificación completa**

Run tests: `npx vitest run`
Expected: All PASS (presentation.spec + home.spec).

Run build: `pnpm build`
Expected: SUCCESS, sin errores `anyComponentStyle`.

Run lint: `pnpm lint`
Expected: 0 errors.

Manual: `pnpm start` → `http://localhost:4200/` debe mostrar en orden: prompt 3 líneas mono opacity, titular dorado grande con glitch sutil, subtítulo blanco, descripción 2 líneas centradas, todo sobre fondo casi negro, centrado, sin scroll horizontal en 320px.

- [ ] **Step 5: Commit final**

```bash
git add src/app/features/home/home.ts src/app/features/home/home.html angular.json
git commit -m "feat(home): integrate Presentation hero and remove ASCII placeholder"
```

---

## Self-Review

**1. Spec coverage:** Prompt, titular, subtítulo, descripción, jerarquía, a11y, responsive, Angular standalone, colores y tipografía — todo mapeado a tasks 1-5.
**2. Placeholder scan:** Sin TBD/TODO; cada step con código completo y comandos.
**3. Type consistency:** `Presentation` default export, importado igual en Home, selector `app-presentation` consistente, clases BEM consistentes.
