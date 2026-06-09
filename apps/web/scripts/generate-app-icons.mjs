// One-off icon generator. Reads the brand SVG and emits apple-icon.png
// (180x180) and favicon.ico (multi-size). Run with `node scripts/generate-app-icons.mjs`.
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');
const svgPath = resolve(projectRoot, 'src/app/icon.svg');
const svg = readFileSync(svgPath, 'utf-8');

const renderPng = (size) => {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: '#0a0f17',
  });
  const png = resvg.render().asPng();
  return png;
};

// apple-touch-icon 180x180
const apple = renderPng(180);
writeFileSync(resolve(projectRoot, 'src/app/apple-icon.png'), apple);
console.log('✓ wrote src/app/apple-icon.png (180x180)');

// favicon.ico: 16, 32, 48 sizes (ICO is just a header + raw PNG-like entries)
const sizes = [16, 32, 48];
const entries = sizes.map((size) => {
  const png = renderPng(size);
  return { size, png };
});

const ICONDIR_SIZE = 6;
const ICONDIRENTRY_SIZE = 16;
const dirSize = ICONDIR_SIZE + ICONDIRENTRY_SIZE * sizes.length;
let dataOffset = dirSize;
const dirEntries = entries.map(({ size, png }) => {
  const entry = Buffer.alloc(ICONDIRENTRY_SIZE);
  entry.writeUInt8(size === 256 ? 0 : size, 0); // width
  entry.writeUInt8(size === 256 ? 0 : size, 1); // height
  entry.writeUInt8(0, 2); // colors
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(png.length, 8); // size
  entry.writeUInt32LE(dataOffset, 12); // offset
  dataOffset += png.length;
  return { entry, png };
});

const dir = Buffer.alloc(ICONDIR_SIZE);
dir.writeUInt16LE(0, 0); // reserved
dir.writeUInt16LE(1, 2); // type: 1 = icon
dir.writeUInt16LE(sizes.length, 4);

const ico = Buffer.concat([
  dir,
  ...dirEntries.flatMap(({ entry, png }) => [entry, png]),
]);
writeFileSync(resolve(projectRoot, 'src/app/favicon.ico'), ico);
console.log(`✓ wrote src/app/favicon.ico (16/32/48)`);
