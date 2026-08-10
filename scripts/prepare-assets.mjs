/**
 * Pipeline de assets de marca.
 *
 * Toma los originales de `identidad-visual/` (PNG grandes, con transparencia) y
 * genera las versiones optimizadas que la web realmente sirve, en `public/brand/`.
 *
 * Se corre a mano, solo cuando cambian los originales:
 *
 *   pnpm assets
 *
 * Los resultados se comitean al repo. Por eso `next.config.mjs` puede quedarse con
 * `images.unoptimized: true`: no hace falta un optimizador de imagenes en runtime
 * (ni `sharp` en el contenedor de produccion), lo que simplifica el despliegue.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import sharp from 'sharp'

const SRC = 'identidad-visual'
const OUT = 'public/brand'

// Fondo base de la identidad visual (ver docs/identidad-visual.md).
const INK = '#0F0D1C'

const log = (name, info) =>
  console.log(`  ✓ ${name.padEnd(34)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`)

/** Recorta el area transparente que rodea al arte, para poder posicionarlo con precision. */
const trimmed = (file) => sharp(`${SRC}/${file}`).trim({ background: '#00000000', threshold: 0 })

await mkdir(OUT, { recursive: true })

// ── Bugle, la mascota. Es el heroe visual de la portada. ────────────────────────
// 1400px de ancho: se muestra a ~700px como maximo, asi que cubre pantallas 2x.
log(
  'bugle-cyberpunk.webp',
  await trimmed('bugle cybperpunk.png')
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 86, effort: 6 })
    .toFile(`${OUT}/bugle-cyberpunk.webp`),
)

// Bugle "de espaldas" con la pantalla holografica. No se usa en la portada todavia;
// queda listo para la futura seccion de eventos.
log(
  'bugle-hacker.webp',
  await trimmed('bugle atras.png')
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 86, effort: 6 })
    .toFile(`${OUT}/bugle-hacker.webp`),
)

// ── Logotipo ───────────────────────────────────────────────────────────────────
// "oscuro" = version para fondos oscuros (letras blancas). Es la que usa la web.
log(
  'logo-hack-with-dsc.webp',
  await trimmed('logo para oscuro.png')
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 92, effort: 6 })
    .toFile(`${OUT}/logo-hack-with-dsc.webp`),
)

// Version para fondos claros. No se usa (la web es dark-only) pero se conserva
// para material impreso o si algun dia se agrega tema claro.
log(
  'logo-hack-with-dsc-light.webp',
  await trimmed('logo para claro.png')
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 92, effort: 6 })
    .toFile(`${OUT}/logo-hack-with-dsc-light.webp`),
)

// ── Grano de pelicula ──────────────────────────────────────────────────────────
// Textura de 128x128 que se repite por toda la pagina con opacidad muy baja.
// Rompe el degradado plano y hace que los glows se sientan menos "digitales".
{
  const size = 128
  const noise = Buffer.alloc(size * size * 2)
  // Semilla fija (LCG) para que el archivo sea identico en cada corrida.
  let seed = 1337
  const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
  for (let i = 0; i < size * size; i++) {
    noise[i * 2] = 255 // luminancia: grano blanco
    noise[i * 2 + 1] = Math.floor(rand() * 255) // alfa: la variacion
  }
  const info = await sharp(noise, { raw: { width: size, height: size, channels: 2 } })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/noise.png`)
  log('noise.png', info)
}

// ── Imagen de Open Graph (lo que se ve al compartir el link) ────────────────────
// Se compone con los assets de marca, sin texto renderizado, para no depender de
// las tipografias comerciales: el logotipo ya trae el wordmark dibujado.
{
  const W = 1200
  const H = 630

  const backdrop = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="a" cx="14%" cy="4%" r="72%">
        <stop offset="0%" stop-color="#3D90F5" stop-opacity="0.42"/>
        <stop offset="100%" stop-color="#3D90F5" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="b" cx="90%" cy="92%" r="68%">
        <stop offset="0%" stop-color="#F53D5C" stop-opacity="0.34"/>
        <stop offset="100%" stop-color="#F53D5C" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="c" cx="66%" cy="48%" r="52%">
        <stop offset="0%" stop-color="#813DF5" stop-opacity="0.46"/>
        <stop offset="100%" stop-color="#813DF5" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#F53D5C"/>
        <stop offset="50%" stop-color="#813DF5"/>
        <stop offset="100%" stop-color="#3D90F5"/>
      </linearGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="#813DF5" stroke-opacity="0.10" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="${W}" height="${H}" fill="${INK}"/>
    <rect width="${W}" height="${H}" fill="url(#grid)"/>
    <rect width="${W}" height="${H}" fill="url(#a)"/>
    <rect width="${W}" height="${H}" fill="url(#b)"/>
    <rect width="${W}" height="${H}" fill="url(#c)"/>
    <rect y="${H - 8}" width="${W}" height="8" fill="url(#bar)"/>
  </svg>`)

  const bugle = await trimmed('bugle cybperpunk.png')
    .resize({ height: 520, withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true })

  const logo = await trimmed('logo para oscuro.png')
    .resize({ width: 430, withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true })

  const info = await sharp(backdrop)
    .composite([
      { input: bugle.data, left: W - bugle.info.width + 40, top: H - bugle.info.height - 30 },
      { input: logo.data, left: 76, top: Math.round((H - logo.info.height) / 2) - 24 },
    ])
    // JPEG en vez de PNG: la imagen no necesita transparencia y pesa ~6x menos,
    // lo que importa porque WhatsApp/Twitter la descargan en cada preview.
    .jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile('public/og.jpg')
  log('../og.jpg', info)
}

await writeFile(
  `${OUT}/README.md`,
  `# public/brand

Generado por \`scripts/prepare-assets.mjs\` (\`pnpm assets\`). **No editar a mano.**

Los originales viven en \`identidad-visual/\`. Si cambia un original, corre \`pnpm assets\`
y comitea el resultado.
`,
)

console.log('\nAssets listos en public/brand/ y public/og.png')
