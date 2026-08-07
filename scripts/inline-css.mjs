// Wkleja arkusz CSS z dist/assets/*.css bezpośrednio do dist/index.html.
// Powód: pojedynczy <link rel="stylesheet"> blokuje render, a przy SPA opóźnia
// to pierwszy paint o pełny round-trip. Arkusz jest mały (~10 kB gzip), więc
// inline jest tańszy niż osobne żądanie.
// Uruchamiane automatycznie po `vite build`.

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const DIST = "dist";
const htmlPath = join(DIST, "index.html");

let html = await readFile(htmlPath, "utf8");

const linkRe = /<link[^>]+rel="stylesheet"[^>]*href="\/([^"]+\.css)"[^>]*>/g;
const links = [...html.matchAll(linkRe)];

if (!links.length) {
  console.log("inline-css: brak <link rel=stylesheet> — nic do zrobienia");
  process.exit(0);
}

for (const [tag, href] of links) {
  const css = await readFile(join(DIST, href), "utf8");
  html = html.replace(tag, `<style>${css}</style>`);
  console.log(`inline-css: ${href} → <style> (${(css.length / 1024).toFixed(1)} kB)`);
}

await writeFile(htmlPath, html);
