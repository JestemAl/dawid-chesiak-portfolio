import sharp from 'sharp'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.resolve(__dirname, '..', 'public')

const WIDTH = 1200
const HEIGHT = 630

// Źródło: fota7 (coupé nad wodą o zachodzie słońca, 1600x900) – kadr cover do 1200x630
const srcPhoto = path.join(publicDir, 'photos', 'fota7-1600.webp')
// Podpis: największy czerwony (901x632, z kanałem alfa)
const srcPodpis = path.join(publicDir, 'podpis', 'podpis-czerwony.webp')
const outDir = path.join(publicDir, 'og')
const outFile = path.join(outDir, 'og-image.jpg')

await fs.mkdir(outDir, { recursive: true })

// Delikatny gradient przyciemniający dolne ~35% obrazu – dla czytelności podpisu
const gradientSvg = Buffer.from(`
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="g" x1="0" y1="0.65" x2="0" y2="1">
        <stop offset="0" stop-color="rgba(0,0,0,0)"/>
        <stop offset="1" stop-color="rgba(0,0,0,0.45)"/>
      </linearGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#g)"/>
  </svg>
`)

// Podpis przeskalowany do ~300px szerokości, prawy dolny róg (48px od prawej, 40px od dołu)
const podpisWidth = 300
const podpis = await sharp(srcPodpis).resize({ width: podpisWidth }).toBuffer()
const podpisMeta = await sharp(podpis).metadata()

await sharp(srcPhoto)
  .resize(WIDTH, HEIGHT, { fit: 'cover', position: 'centre' })
  .composite([
    { input: gradientSvg, top: 0, left: 0 },
    {
      input: podpis,
      left: WIDTH - podpisWidth - 48,
      top: HEIGHT - podpisMeta.height - 40,
    },
  ])
  .jpeg({ quality: 85, progressive: true, mozjpeg: true })
  .toFile(outFile)

const stat = await fs.stat(outFile)
const meta = await sharp(outFile).metadata()
console.log(`${path.relative(publicDir, outFile)} — ${meta.width}x${meta.height}, ${(stat.size / 1024).toFixed(1)} KB`)
