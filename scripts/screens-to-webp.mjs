// Konwersja zrzutów ekranu z docs/screens (PNG) na WebP.
// Uruchomienie: node scripts/screens-to-webp.mjs
// PNG-i zostają nietknięte – WebP lądują obok, z tą samą nazwą.

import sharp from "sharp";
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

const ROOT = "docs/screens";
const QUALITY = 90; // tekst na zrzutach lubi wysoką jakość

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`;

let pngTotal = 0;
let webpTotal = 0;
let count = 0;

for (const dir of await readdir(ROOT)) {
  const dirPath = join(ROOT, dir);
  if (!(await stat(dirPath)).isDirectory()) continue;

  for (const file of await readdir(dirPath)) {
    if (!file.endsWith(".png")) continue;

    const src = join(dirPath, file);
    const out = src.replace(/\.png$/, ".webp");

    await sharp(src).webp({ quality: QUALITY, effort: 6 }).toFile(out);

    const before = (await stat(src)).size;
    const after = (await stat(out)).size;
    pngTotal += before;
    webpTotal += after;
    count++;

    console.log(`${dir}/${file.padEnd(24)} ${kb(before).padStart(9)} → ${kb(after).padStart(8)}`);
  }
}

console.log(
  `\n${count} plików: ${kb(pngTotal)} → ${kb(webpTotal)} ` +
    `(-${Math.round((1 - webpTotal / pngTotal) * 100)}%)`
);
