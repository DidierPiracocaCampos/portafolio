# Figma Portfolio Sections Analysis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear cinco analisis Markdown en espanol, cada uno con una captura PNG legible de su seccion correspondiente del archivo de Figma `Porfolio`.

**Architecture:** La salida sera una coleccion plana de cinco documentos y cinco imagenes en `docs/`, mas un indice `docs/README.md`. Las capturas se obtendran con Chrome DevTools MCP desde la unica pantalla vertical `Desktop - 1`; la redaccion separara observaciones verificables de recomendaciones para Angular.

**Tech Stack:** Markdown, PNG, Figma web, Chrome DevTools MCP, Angular 20 como contexto de implementacion.

## Global Constraints

- Usar `docs/` relativo a la raiz del repositorio.
- Documentar exactamente cinco secciones: presentacion, experiencia, habilidades, proyectos y contacto.
- Incluir `DevHelper`, `SPOT` y `DevFormFX` dentro del analisis de proyectos, sin documentos adicionales.
- Obtener las cinco capturas desde Figma usando Chrome DevTools MCP.
- Redactar los documentos en espanol y distinguir hechos observables de recomendaciones.
- No modificar archivos de aplicacion Angular ni la modificacion previa de `.vscode/tasks.json`.
- Mantener las capturas legibles y recortadas al contenido de la seccion, sin depender del banner de registro de Figma.

---

### Task 1: Preparar el contexto de captura

**Files:**

- Create: ninguno
- Modify: ninguno

**Interfaces:**

- Consumes: `https://www.figma.com/design/ctzESfsjFUgqDCjR0IjpvN/Porfolio?node-id=0-1&t=5o0HOjpQ1KTQIAn9-1`
- Produces: una pagina de Figma abierta, sin dialogo de cookies visible, con el canvas configurado al 50%.

- [ ] **Step 1: Abrir el archivo en Chrome DevTools MCP**

Usar `chrome-devtools_navigate_page` con la URL del archivo y esperar hasta 120000 ms.

- [ ] **Step 2: Limpiar los bloqueos de lectura**

Tomar un `chrome-devtools_take_snapshot`. Si aparecen, pulsar `No permitir cookies`, `Descartar` o `Cerrar` usando los UID actuales del snapshot. No iniciar sesion ni modificar el archivo.

- [ ] **Step 3: Configurar la escala**

Abrir el control de zoom de Figma, seleccionar `Zoom al 50 %` y confirmar con `chrome-devtools_take_screenshot` que el frame vertical y su contenido son visibles.

- [ ] **Step 4: Verificar el contexto**

Comprobar que la unica pantalla visible esta etiquetada `Desktop - 1` y que se distinguen los titulos `EXPERIENCE`, `SKILLS`, `PROJECTS` y `CONTACT`.

### Task 2: Capturar y analizar la presentacion

**Files:**

- Create: `docs/01-presentacion.md`
- Create: `docs/01-presentacion.png`

**Interfaces:**

- Consumes: contexto preparado de Figma.
- Produces: analisis de la cabecera visual, identidad, terminal decorativa, titular profesional y propuesta de valor.

- [ ] **Step 1: Posicionar el canvas en la cabecera**

Restablecer la vista con `Zoom para encajar`, volver a `Zoom al 50 %` y dejar visible el inicio de `Desktop - 1`, incluyendo el prompt de terminal, `DIDIER PIRACOCA`, el subtitulo y la descripcion.

- [ ] **Step 2: Capturar la vista de trabajo**

Usar `chrome-devtools_take_screenshot` para guardar una captura temporal de la vista. La captura debe incluir el bloque de presentacion completo y no cortar el titular.

- [ ] **Step 3: Recortar la imagen de entrega**

Recortar la captura temporal al area del frame y guardar el resultado como `docs/01-presentacion.png`. Excluir las barras flotantes y el banner de registro de Figma sin alterar el contenido del diseno.

- [ ] **Step 4: Redactar el analisis**

Crear `docs/01-presentacion.md` con las secciones `Objetivo`, `Observaciones`, `Jerarquia visual`, `UX y accesibilidad`, `Responsive`, `Recomendaciones para Angular` y `Captura`. Enlazar `01-presentacion.png` con Markdown relativo.

- [ ] **Step 5: Verificar el entregable**

Leer el Markdown y confirmar que la imagen existe, se puede abrir y corresponde a la cabecera de Figma.

### Task 3: Capturar y analizar la experiencia

**Files:**

- Create: `docs/02-experiencia.md`
- Create: `docs/02-experiencia.png`

**Interfaces:**

- Consumes: contexto preparado de Figma y el bloque `EXPERIENCE` de `Desktop - 1`.
- Produces: analisis de la linea temporal, experiencia en AXPE Consulting y formacion 2021-2023.

- [ ] **Step 1: Posicionar el bloque `EXPERIENCE`**

Desde la vista al 50%, desplazar el canvas con un evento `wheel` sobre el canvas hasta mostrar completo el encabezado `EXPERIENCE`, los dos registros y sus listas de responsabilidades.

- [ ] **Step 2: Capturar la vista de trabajo**

Usar `chrome-devtools_take_screenshot` y conservar el bloque de experiencia legible, incluyendo la linea amarilla lateral.

- [ ] **Step 3: Recortar la imagen de entrega**

Guardar el recorte limpio como `docs/02-experiencia.png`, excluyendo la interfaz de Figma y evitando cortar el primer o ultimo registro.

- [ ] **Step 4: Redactar el analisis**

Crear `docs/02-experiencia.md` con `Objetivo`, `Contenido observado`, `Composicion`, `Legibilidad`, `UX y accesibilidad`, `Responsive`, `Riesgos o inconsistencias`, `Recomendaciones para Angular` y `Captura`. Registrar literalmente los periodos `2023-present` y `2021 - 2023` como texto observado.

- [ ] **Step 5: Verificar el entregable**

Confirmar que el Markdown enlaza la imagen correcta y que la imagen contiene ambos registros completos.

### Task 4: Capturar y analizar las habilidades

**Files:**

- Create: `docs/03-habilidades.md`
- Create: `docs/03-habilidades.png`

**Interfaces:**

- Consumes: contexto preparado de Figma y el bloque `SKILLS` de `Desktop - 1`.
- Produces: analisis de las cinco agrupaciones de habilidades: Frontend, Backend, Tools, Database y Mobile.

- [ ] **Step 1: Posicionar el bloque `SKILLS`**

Desplazar el canvas hasta que el titulo `SKILLS` y las cinco agrupaciones sean visibles sin quedar cubiertas por los controles de Figma.

- [ ] **Step 2: Capturar la vista de trabajo**

Usar `chrome-devtools_take_screenshot` y confirmar que se leen `Angular`, `TailwindCSS`, `Bootstrap`, `Java`, `Spring`, `Git / GitLab / GitHub`, `VS Code`, `Eclipse`, `OpenCode`, `Figma`, `Firebase`, `OracleDB`, `SQL`, `Android Studio` e `Ionic + Cordova`.

- [ ] **Step 3: Recortar la imagen de entrega**

Guardar el recorte del bloque como `docs/03-habilidades.png`, conservando las tres columnas y las dos filas visuales.

- [ ] **Step 4: Redactar el analisis**

Crear `docs/03-habilidades.md` con `Objetivo`, `Inventario`, `Sistema visual`, `UX y accesibilidad`, `Responsive`, `Riesgos o inconsistencias`, `Recomendaciones para Angular` y `Captura`. Evaluar la agrupacion, densidad de informacion y semantica de las listas.

- [ ] **Step 5: Verificar el entregable**

Comprobar que las cinco agrupaciones estan presentes en la imagen y que el Markdown no inventa niveles de dominio no visibles en Figma.

### Task 5: Capturar y analizar los proyectos

**Files:**

- Create: `docs/04-proyectos.md`
- Create: `docs/04-proyectos.png`

**Interfaces:**

- Consumes: contexto preparado de Figma y las tres tarjetas visuales de `PROJECTS`.
- Produces: analisis de `DevHelper`, `SPOT` y `DevFormFX`, incluyendo el problema de contenido repetido en la tercera tarjeta.

- [ ] **Step 1: Posicionar el bloque `PROJECTS`**

Desplazar el canvas hasta mostrar el titulo `PROJECTS` y las tres filas de tarjetas completas, con sus miniaturas, paneles informativos e iconos de GitHub/Figma.

- [ ] **Step 2: Capturar la vista de trabajo**

Usar `chrome-devtools_take_screenshot` y asegurar que se distinguen las miniaturas y los textos de estado, tecnologia y enlace.

- [ ] **Step 3: Recortar la imagen de entrega**

Guardar el recorte como `docs/04-proyectos.png`, incluyendo las tres tarjetas completas y sin incluir el titulo de `CONTACT` salvo que sea necesario para no cortar la ultima fila.

- [ ] **Step 4: Redactar el analisis**

Crear `docs/04-proyectos.md` con `Objetivo`, `Inventario de proyectos`, `Composicion de tarjetas`, `Jerarquia y CTA`, `UX y accesibilidad`, `Responsive`, `Problemas detectados`, `Recomendaciones para Angular` y `Captura`. Documentar que la tarjeta de `DevFormFX` muestra `SPOT` en el panel informativo y que los textos de tecnologia/enlace aparecen repetidos.

- [ ] **Step 5: Verificar el entregable**

Confirmar visualmente la presencia de `DevHelper`, `SPOT` y `DevFormFX`, y revisar que el problema de la tercera tarjeta esta descrito como observacion, no como correccion aplicada.

### Task 6: Capturar y analizar el contacto

**Files:**

- Create: `docs/05-contacto.md`
- Create: `docs/05-contacto.png`

**Interfaces:**

- Consumes: contexto preparado de Figma y el bloque `CONTACT` de `Desktop - 1`.
- Produces: analisis del formulario de contacto con nombre, email, mensaje y boton `> send`.

- [ ] **Step 1: Posicionar el bloque `CONTACT`**

Desplazar el canvas hasta mostrar completo el encabezado `CONTACT`, el texto `> Initializing contact module ...`, los campos `name`, `email`, `message` y el boton `> send`.

- [ ] **Step 2: Capturar la vista de trabajo**

Usar `chrome-devtools_take_screenshot` y confirmar que los tres campos y el boton quedan dentro de la captura.

- [ ] **Step 3: Recortar la imagen de entrega**

Guardar el recorte limpio como `docs/05-contacto.png`, conservando el encabezado, los labels y el boton.

- [ ] **Step 4: Redactar el analisis**

Crear `docs/05-contacto.md` con `Objetivo`, `Flujo visible`, `Jerarquia del formulario`, `UX y accesibilidad`, `Responsive`, `Riesgos o inconsistencias`, `Recomendaciones para Angular` y `Captura`. Separar el aspecto visual observado de la logica de envio que no esta especificada en Figma.

- [ ] **Step 5: Verificar el entregable**

Comprobar que la imagen contiene todos los campos y que el analisis recomienda labels asociados, estados de validacion, foco visible y feedback de envio sin afirmar que ya existen.

### Task 7: Crear el indice y validar el paquete documental

**Files:**

- Create: `docs/README.md`
- Verify: `docs/01-presentacion.md`, `docs/01-presentacion.png`, `docs/02-experiencia.md`, `docs/02-experiencia.png`, `docs/03-habilidades.md`, `docs/03-habilidades.png`, `docs/04-proyectos.md`, `docs/04-proyectos.png`, `docs/05-contacto.md`, `docs/05-contacto.png`

**Interfaces:**

- Consumes: los diez entregables de las tareas 2 a 6.
- Produces: un indice navegable y un paquete coherente de documentacion.

- [ ] **Step 1: Crear el indice**

Crear `docs/README.md` con el titulo `Analisis del portafolio en Figma`, el enlace al archivo fuente y una tabla o lista plana con enlaces a los cinco Markdown.

- [ ] **Step 2: Validar enlaces y archivos**

Ejecutar en PowerShell desde `D:\proyects\portafolio`:

```powershell
Test-Path "docs\README.md"
Test-Path "docs\01-presentacion.md"
Test-Path "docs\01-presentacion.png"
Test-Path "docs\02-experiencia.md"
Test-Path "docs\02-experiencia.png"
Test-Path "docs\03-habilidades.md"
Test-Path "docs\03-habilidades.png"
Test-Path "docs\04-proyectos.md"
Test-Path "docs\04-proyectos.png"
Test-Path "docs\05-contacto.md"
Test-Path "docs\05-contacto.png"
```

Expected: cada linea imprime `True`.

- [ ] **Step 3: Revisar el contenido**

Leer los seis Markdown, comprobar que cada uno enlaza su PNG con una ruta relativa y buscar marcadores no resueltos:

```powershell
$markers = @('T' + 'BD', 'TO' + 'DO', 'FIX' + 'ME', 'lorem' + ' ipsum')
Select-String -Path "docs\*.md" -Pattern $markers
```

Expected: ninguna coincidencia.

- [ ] **Step 4: Revisar cambios fuera de alcance**

Ejecutar:

```powershell
git status --short
git diff -- .vscode/tasks.json src package.json angular.json
```

Expected: solo aparecen los nuevos archivos documentales de `docs/`; no se modifica `.vscode/tasks.json`, `src/`, `package.json` ni `angular.json`.

- [ ] **Step 5: Crear el commit documental**

```powershell
git add -- docs/README.md docs/01-presentacion.md docs/01-presentacion.png docs/02-experiencia.md docs/02-experiencia.png docs/03-habilidades.md docs/03-habilidades.png docs/04-proyectos.md docs/04-proyectos.png docs/05-contacto.md docs/05-contacto.png
git commit -m "docs: analyze Figma portfolio sections"
```
