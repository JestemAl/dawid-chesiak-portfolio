import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '..', 'public')

// dawid.png (907x1130, 424KB) – wyświetlany jako max-h-[50vh] object-cover w-full
// Realnie max ~600px w 1x, 1200px w 2x → wygenerujmy 600w i 1200w
const tasks = [
  {
    src: path.join(publicDir, 'photos', 'dawid.png'),
    outputs: [
      { out: path.join(publicDir, 'photos', 'dawid-600.webp'), width: 600, format: 'webp', quality: 80 },
      { out: path.join(publicDir, 'photos', 'dawid-1200.webp'), width: 1200, format: 'webp', quality: 78 },
    ],
  },
  {
    src: path.join(publicDir, 'images', 'dji-mini.png'),
    outputs: [
      { out: path.join(publicDir, 'images', 'dji-mini-600.webp'), width: 600, format: 'webp', quality: 82 },
      { out: path.join(publicDir, 'images', 'dji-mini-1000.webp'), width: 1000, format: 'webp', quality: 80 },
    ],
  },
  {
    src: path.join(publicDir, 'podpis', 'podpis-czerwony.webp'),
    outputs: [
      // Hero używa max 280px szer., footer aż 480px → render 560px @ retina dla obu
      { out: path.join(publicDir, 'podpis', 'podpis-czerwony-560.webp'), width: 560, format: 'webp', quality: 55 },
    ],
  },
]

// Galeria – pliki fota*.webp są oryginalnie ~3800–4600px szerokości i 200–870KB.
// Na siatce wyświetlają się max ~600–800px w jednej kolumnie. Generujemy 800w i 1600w (retina).
for (let n = 1; n <= 9; n++) {
  if (n === 2) continue // brak fota2 w projekcie
  const src = path.join(publicDir, 'photos', `fota${n}.webp`)
  try {
    await fs.access(src)
  } catch {
    continue
  }
  tasks.push({
    src,
    outputs: [
      { out: path.join(publicDir, 'photos', `fota${n}-800.webp`), width: 800, format: 'webp', quality: 75 },
      { out: path.join(publicDir, 'photos', `fota${n}-1600.webp`), width: 1600, format: 'webp', quality: 72 },
    ],
  })
}

for (const task of tasks) {
  for (const o of task.outputs) {
    await sharp(task.src)
      .resize({ width: o.width, withoutEnlargement: true })
      .toFormat(o.format, { quality: o.quality })
      .toFile(o.out)
    const stat = await fs.stat(o.out)
    console.log(`${path.relative(publicDir, o.out)} — ${(stat.size / 1024).toFixed(1)} KB`)
  }
}
