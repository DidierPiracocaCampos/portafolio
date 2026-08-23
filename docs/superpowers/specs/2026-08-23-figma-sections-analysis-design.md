# Analisis de las secciones del portafolio en Figma

## Objetivo

Documentar las cinco secciones principales de la pantalla vertical `Desktop - 1`
del archivo de Figma `Porfolio`, incluyendo una captura visual de cada seccion y
recomendaciones utiles para su implementacion en el proyecto Angular existente.

## Alcance

Se generaran cinco documentos independientes dentro de `docs/`:

- `01-presentacion.md`
- `02-experiencia.md`
- `03-habilidades.md`
- `04-proyectos.md`
- `05-contacto.md`

Cada documento tendra una imagen con el mismo prefijo de nombre. La seccion de
proyectos incluira el analisis de `DevHelper`, `SPOT` y `DevFormFX` sin crear
documentos adicionales para esas tarjetas.

## Capturas

Las imagenes se obtendran mediante Chrome DevTools MCP desde el archivo publico
de Figma. Se capturara cada tramo de la pantalla con suficiente escala para que
el contenido sea legible y se conservara el estilo visual original.

## Estructura de cada analisis

Cada Markdown incluira:

- Objetivo y contenido observado.
- Composicion, jerarquia, color y tipografia.
- Lectura de UX, responsive y accesibilidad.
- Problemas o inconsistencias visibles.
- Recomendaciones concretas para el proyecto Angular actual.
- Enlace a la captura correspondiente.

Tambien se incluira `docs/README.md` como indice de las cinco secciones.

## Criterios de aceptacion

- Existen cinco analisis Markdown en `docs/`.
- Cada analisis enlaza una captura PNG correspondiente.
- Las cinco capturas fueron obtenidas desde Figma usando Chrome DevTools MCP.
- El analisis distingue hechos observables de recomendaciones.
- Se documentan las inconsistencias visibles, incluyendo la repeticion del nombre
  `SPOT` en la tarjeta informativa de `DevFormFX`.
- No se modifican los archivos de aplicacion Angular ni la modificacion previa de
  `.vscode/tasks.json`.
