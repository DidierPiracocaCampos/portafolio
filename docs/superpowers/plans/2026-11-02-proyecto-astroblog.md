# Proyecto astroblog en la sección Proyectos — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Añadir astroblog (`D:/proyects/astroblog`, paquete npm `@didierp/astroblog`) como cuarta tarjeta de la sección Proyectos, con imagen propia y enlaces a GitHub y npm.

**Architecture:** Los proyectos son la constante tipada `PROJECTS` en `projects.ts`, renderizada por `projects.html`, con textos en `public/i18n/{es,en}.json`. Se añade una entrada al final de la lista y un nuevo tipo de enlace `npm` (tipo TS + icono SVG en el `@switch` + etiqueta i18n). La imagen es una captura de la demo de astroblog servida en local.

**Tech Stack:** Angular 20 (standalone, OnPush), ngx-translate, Vitest vía `ng test`, Chrome headless + sharp-cli para la imagen.

**Spec:** Decisiones del usuario en la conversación del 2026-11-02 (no hay documento de spec):
- Posición: **última** (DevHelper, DevFormFX, SPOT, astroblog).
- Enlaces: demo + GitHub + npm, con un tipo de enlace nuevo `npm`.
- Imagen: captura de la demo, guardada como `public/images/projects/astroblog.webp`.

## Global Constraints

- **La demo NO está desplegada:** `astroblog-demo.pages.dev` no resuelve DNS (comprobado el 2026-11-02). Por tanto **no se añade el enlace `website`** (sería un enlace roto) y la captura se hace sobre la demo servida en local. Si la demo se despliega más adelante, añadir `{ kind: 'website', url: 'https://astroblog-demo.pages.dev/' }` como primer enlace es un cambio aparte.
- URLs exactas: GitHub `https://github.com/DidierPiracocaCampos/astroblog`, npm `https://www.npmjs.com/package/@didierp/astroblog`.
- `id: 'astroblog'`, `name: 'astroblog'` (en minúsculas, como el repo y el paquete), `technologies: 'Astro, TypeScript, Tailwind, daisyUI'`, `statusKey: 'projects.status.completed'` (paquete publicado, v0.3.2).
- Imagen: WebP de 1080×1080, igual que `devhelper.webp` (el marco usa `aspect-ratio: 1 / 1`).
- Todo texto visible va en **ambos** `public/i18n/es.json` y `public/i18n/en.json`.
- Commits en español con prefijo convencional y la línea `Co-Authored-By` de la sesión.

## Review Focus

1. **Clave i18n que falta en un idioma** → ngx-translate muestra la clave cruda (`projects.items.astroblog.description`). El paso de verificación de la Task 2 comprueba que las claves nuevas existen en los dos JSON.
2. **`@switch` sin `@case ('npm')`** → el enlace se renderiza como un `<a>` vacío sin icono. El test de la Task 2 comprueba que el enlace npm contiene un `svg`.
3. **Imagen ausente o con otra proporción** → `NgOptimizedImage` con `fill` muestra un hueco o la recorta. La Task 1 verifica el fichero y sus dimensiones.
4. **Contadores fijos en el spec** (3 artículos, 7 enlaces) → se actualizan a 4 y 9 en la Task 2.
5. **Presupuesto de estilos** (≤ 6 kB de warning por componente) → no se toca `projects.css`; `pnpm build` en la Task 2 lo confirma.

---

### Task 1: Imagen de astroblog a partir de la demo local

**Files:**
- Create: `public/images/projects/astroblog.webp`

**Interfaces:**
- Produces: el fichero `/images/projects/astroblog.webp` (1080×1080 WebP) que usa la Task 2.

- [ ] **Step 1: Compilar y servir la demo de astroblog**

En `D:/proyects/astroblog`: `pnpm install` (si hace falta) y `pnpm build:demo`; luego, en segundo plano, `pnpm --filter demo exec astro preview --port 4321`.
Expected: `curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/` devuelve `200`.

- [ ] **Step 2: Capturar la portada con Chrome headless**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --hide-scrollbars \
  --window-size=1080,1080 --screenshot="<scratchpad>/astroblog.png" http://localhost:4321/
```

Expected: existe `<scratchpad>/astroblog.png`. Abrirlo con Read y confirmar que muestra la portada del blog (no una página de error). Si la portada resulta poco representativa, capturar en su lugar la página de un post.

- [ ] **Step 3: Convertir a WebP 1080×1080**

```bash
pnpm dlx sharp-cli -i "<scratchpad>/astroblog.png" -o public/images/projects/astroblog.webp -f webp -q 80 resize 1080 1080
```

Expected: `file public/images/projects/astroblog.webp` → `WebP image ... 1080x1080` (o VP8 1080x1080). Detener el `astro preview`.

- [ ] **Step 4: Commit**

```bash
git add public/images/projects/astroblog.webp
git commit -m "feat: añadir imagen de vista previa de astroblog"
```

---

### Task 2: Tarjeta de astroblog con enlace npm

**Files:**
- Modify: `src/app/features/home/ui/projects/projects.ts` (tipos `ProjectLinkKind` y `Project['id']`, constante `PROJECTS`)
- Modify: `src/app/features/home/ui/projects/projects.html` (nuevo `@case ('npm')` en el `@switch`)
- Modify: `public/i18n/es.json`, `public/i18n/en.json` (`projects.actions.npm`, `projects.items.astroblog`)
- Test: `src/app/features/home/ui/projects/projects.spec.ts`

**Interfaces:**
- Consumes: `/images/projects/astroblog.webp` (Task 1).
- Produces: `ProjectLinkKind = 'github' | 'website' | 'instagram' | 'figma' | 'npm'`; `Project['id']` incluye `'astroblog'`.

- [ ] **Step 1: Actualizar el spec (tests en rojo)**

En `projects.spec.ts`:
- Traducciones del spec: añadir `actions.npm` (en: `'View package on npm'`, es: `'Ver paquete en npm'`) e `items.astroblog` con `description` e `imageAlt` (en: `'astroblog preview'`, es: `'Vista previa de astroblog'`).
- `should create with three stable projects` → renombrar a `...four stable projects`; ids `['devhelper', 'devformfx', 'spot', 'astroblog']`.
- `should use real project image paths` → añadir `'/images/projects/astroblog.webp'` al final.
- `should expose configurable links per project` → añadir:
  ```ts
  expect(byId.get('astroblog')?.links.map((link) => link.kind)).toEqual(['github', 'npm']);
  expect(byId.get('astroblog')?.links.map((link) => link.url)).toEqual([
    'https://github.com/DidierPiracocaCampos/astroblog',
    'https://www.npmjs.com/package/@didierp/astroblog',
  ]);
  ```
- `should render the section heading and three project articles` → `articles.length` toBe `4` (y renombrar a `four`).
- `should not render project links while URLs are empty` → total `.projects__action` toBe `9` y el comentario `DevHelper 4, DevFormFX 1, SPOT 2, astroblog 2 = 9`.
- `should render each card with accessible article label` → `articles[3]` aria-labelledby `'project-astroblog-title'`.
- Test nuevo `should render the npm link with icon and accessible label`:
  ```ts
  const npmLink = articles[3].querySelectorAll('.projects__action')[1] as HTMLElement;
  expect(npmLink.getAttribute('href')).toBe('https://www.npmjs.com/package/@didierp/astroblog');
  expect(npmLink.getAttribute('aria-label')).toBe('View package on npm astroblog');
  expect(npmLink.querySelector('svg')).toBeTruthy();
  ```

- [ ] **Step 2: Ejecutar el spec y verificar que falla**

Run: `pnpm exec ng test --include src/app/features/home/ui/projects/projects.spec.ts`
Expected: FAIL (ids, rutas de imagen, número de artículos/enlaces y el test de npm).

- [ ] **Step 3: Implementar en `projects.ts`**

Añadir `'npm'` a `ProjectLinkKind` y `'astroblog'` al tipo de `id`. Añadir **al final** de `PROJECTS`:
`id: 'astroblog'`, `name: 'astroblog'`, `imageSrc: '/images/projects/astroblog.webp'`, `imageAltKey: 'projects.items.astroblog.imageAlt'`, `statusKey: 'projects.status.completed'`, `technologies: 'Astro, TypeScript, Tailwind, daisyUI'`, `descriptionKey: 'projects.items.astroblog.description'`, `links` = GitHub y luego npm con las URLs de Global Constraints.

- [ ] **Step 4: Icono npm en `projects.html`**

Añadir `@case ('npm')` tras el de `figma`, con un `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">` de relleno `currentColor` siguiendo el estilo de los demás (p. ej. el logotipo cuadrado de npm: un cuadrado con el hueco en forma de "n"). Sin estilos nuevos en `projects.css`.

- [ ] **Step 5: Textos i18n**

En `public/i18n/en.json`:
- `projects.actions.npm`: `"View package on npm"`
- `projects.items.astroblog.description`: `"Astro integration that turns an empty project into a complete static blog: SEO, RSS, Pagefind search, legal pages and AdSense-ready consent, deployable to Cloudflare Pages."`
- `projects.items.astroblog.imageAlt`: `"astroblog preview, static blog generated with Astro"`

En `public/i18n/es.json`:
- `projects.actions.npm`: `"Ver paquete en npm"`
- `projects.items.astroblog.description`: `"Integración de Astro que convierte un proyecto vacío en un blog estático completo: SEO, RSS, búsqueda con Pagefind, páginas legales y consentimiento listo para AdSense, desplegable en Cloudflare Pages."`
- `projects.items.astroblog.imageAlt`: `"Vista previa de astroblog, blog estático generado con Astro"`

- [ ] **Step 6: Verificar tests, claves i18n, lint y build**

- `pnpm exec ng test --include src/app/features/home/ui/projects/projects.spec.ts` → PASS.
- `node -e "for (const l of ['es','en']) { const p = require('./public/i18n/' + l + '.json').projects; if (!p.actions.npm || !p.items.astroblog?.description || !p.items.astroblog?.imageAlt) throw new Error(l) } console.log('ok')"` → `ok`. Como el paquete es `"type": "module"`, si `require` falla, usar `node --input-type=commonjs -e ...`.
- `pnpm lint` → sin errores. `pnpm test` → todo en verde.
- `pnpm build` → termina sin errores de presupuesto.

- [ ] **Step 7: Comprobación visual**

`pnpm start`, abrir `http://localhost:4200/es` y `/en`, esperar a que se desbloquee la sección Proyectos y confirmar: cuarta tarjeta astroblog con imagen, textos traducidos e iconos de GitHub y npm alineados con los demás, en los temas `gold` y `goldlight`.

- [ ] **Step 8: Commit**

```bash
git add src/app/features/home/ui/projects public/i18n/es.json public/i18n/en.json
git commit -m "feat: añadir astroblog a proyectos con enlace a npm"
```
