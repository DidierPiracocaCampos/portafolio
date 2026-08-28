# Contacto Firebase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implementar la sección `CONTACT` documentada en `docs/05-contacto.md`, guardar envíos en Firebase Realtime Database, permitir únicamente nuevas escrituras públicas, bloquear todas las lecturas, añadir cooldown de 60 segundos y traducir el bloque ES/EN.

**Architecture:** Un componente standalone `Contact` usará un formulario reactivo tipado. Un servicio dedicado escribirá en `contactSubmissions/$submissionId` mediante AngularFire/Firebase SDK, sin métodos de lectura. Las reglas de Realtime Database validarán estructura, tipos, longitudes y timestamp; el límite de 60 segundos será una protección por navegador mediante `localStorage`, no un rate limit por IP.

**Tech Stack:** Angular 20.3, TypeScript 5.9, Angular Reactive Forms, AngularFire Database, Firebase Realtime Database, ngx-translate, Tailwind CSS 4, daisyUI 5, Vitest.

## Global Constraints

- Usar componentes standalone sin declarar `standalone: true`.
- Usar `ChangeDetectionStrategy.OnPush`.
- Usar formulario reactivo tipado.
- Usar `@if` y `@switch` en lugar de directivas estructurales antiguas.
- Mantener los textos funcionales en `public/i18n/es.json` y `public/i18n/en.json`.
- No realizar lecturas desde el cliente.
- Permitir únicamente la creación de nuevos envíos en Firebase.
- No permitir actualizaciones ni borrados.
- Aplicar límites de 80 caracteres para nombre, 254 para email y 2.000 para mensaje.
- El cooldown será de un envío cada 60 segundos por navegador.
- No afirmar que las reglas ofrecen rate limiting por IP.
- Preservar los cambios no relacionados actualmente presentes en el worktree.

---

## File Structure

**Crear:**

- `src/app/features/home/ui/contact/contact.ts` — componente standalone, formulario, estados y cooldown.
- `src/app/features/home/ui/contact/contact.html` — markup semántico y accesible.
- `src/app/features/home/ui/contact/contact.css` — layout responsive y estilo terminal.
- `src/app/features/home/ui/contact/contact.spec.ts` — pruebas del formulario, traducciones y estados.
- `src/app/core/contact/contact-submission.service.ts` — escritura tipada en Realtime Database.
- `src/app/core/contact/contact-submission.service.spec.ts` — pruebas unitarias del servicio.
- `src/app/core/contact/contact-db.ts` — wrapper testeable sobre firebase/database.
- `tools/database-rules.spec.ts` — pruebas de seguridad usando Firebase Emulator.

**Modificar:**

- `public/i18n/es.json`
- `public/i18n/en.json`
- `src/app/features/home/home.ts`
- `src/app/features/home/home.html`
- `src/app/features/home/home.spec.ts`
- `database.rules.json`
- `package.json`

**Verificar sin modificar inicialmente:**

- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

## Task 1: Markup Bilingüe

Pruebas de renderizado de heading, línea de inicialización, labels, inputs y botón. Traducciones ES/EN para contact.heading, contact.initializing, contact.fields.*, contact.actions.send, contact.validation.* y contact.status.*. Componente inicial sin lógica de envío.

## Task 2: Servicio y Formulario

Servicio `ContactSubmissionService` con método `submit` que escribe en `contactSubmissions/$pushId` con `serverTimestamp`. Formulario reactivo tipado con validadores `required`, `nonBlankValidator`, `trimmedEmailValidator`, `maxLength`. Normalización de valores (trim + lowerCase email) y manejo de estados `idle/submitting/success/error` con signals. Cooldown de 60s vía `localStorage` y `setInterval` con cleanup en `DestroyRef`. Tests de validación, normalización, cooldown, persistencia y accesibilidad.

## Task 3: Reglas Write-Only

`database.rules.json` con `.read:false` global, `.write:false` en raíz y `contactSubmissions`, y `"$submissionId": { ".read": false, ".write": "!data.exists() && newData.exists() && $submissionId.matches(/^[A-Za-z0-9_-]{20}$/)", ".validate": "..." }` validando 4 children, longitudes, email regex y timestamp dentro de 5 minutos. Script `test:rules` y spec `tools/database-rules.spec.ts` para emulator.

## Task 4: Integración Home

`Home` importa `Contact` y lo renderiza después de `Projects`. Home spec verifica orden `presentation -> experience -> skills -> projects -> contact` y contenido bilingüe de `CONTACT`/`CONTACTO`.

## Task 5: Estilos y Verificación

CSS responsive con `.contact`, `.contact__inner` max 42rem, heading con rules magenta, labels amarillos, bordes claros, textarea alto, botón alineado a derecha con hover dorado, focus visible accent, y feedback aria-live. Verificación con `pnpm test`, `pnpm build`, `pnpm lint`, revisión manual responsive 320/768/1440 y zoom 200%.

