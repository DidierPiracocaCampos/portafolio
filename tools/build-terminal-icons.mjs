import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const SOURCE = process.env.NERD_FONT_SOURCE;

if (!SOURCE) {
  console.error(
    'Uso: NERD_FONT_SOURCE=<ruta a un .ttf Nerd Font> node tools/build-terminal-icons.mjs',
  );
  process.exit(1);
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '..', 'public', 'fonts');
const OUTPUT_PATH = join(OUTPUT_DIR, 'terminal-icons.woff2');

const SOURCE_GLYPHS = ['\uF007', '\uF07B', '\uF408'];

function glyphLineHex(cp) {
  return `\\U${cp.toString(16).toUpperCase().padStart(4, '0')}`;
}

async function main() {
  const sourceBuffer = readFileSync(SOURCE);
  const subsetBuffer = await subsetFont(sourceBuffer, SOURCE_GLYPHS.join(''), {
    targetFormat: 'woff2',
  });

  mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(OUTPUT_PATH, subsetBuffer);

  console.log(`Generado ${OUTPUT_PATH}`);
  console.log(`Glifos: ${SOURCE_GLYPHS.map((g) => glyphLineHex(g.codePointAt(0))).join(' ')}`);
  console.log(`Tamaño: ${subsetBuffer.length} bytes`);
}

main();
