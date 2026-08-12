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

// ── Imagenes de Open Graph (lo que se ve al compartir un link) ──────────────────
//
// Hay DOS, una por ruta, y son estaticas y comiteadas a proposito: WhatsApp y
// LinkedIn cachean la vista previa de forma muy agresiva, asi que una imagen
// generada al vuelo produce previsualizaciones desincronizadas e imposibles de
// depurar. Si hay que corregir una, lo unico fiable es renombrar el archivo.
//
// Los colores literales de aqui son los mismos 6 tokens de app/globals.css. Este
// es un script de build, no la web: no hay CSS del que leerlos.
const OG_W = 1200
const OG_H = 630

const PURPURA = '#813DF5'
const AZUL = '#3D90F5'
const ROJO = '#F53D5C'
const VERDE = '#64DA2C'

/**
 * Fondo comun de las dos imagenes: tinta, rejilla, tres halos y la cinta de marca.
 * Cada ruta le pasa sus propios halos, que es lo unico que las distingue de lejos
 * cuando las dos aparecen en el mismo chat.
 */
const fondoOg = (halos) =>
  Buffer.from(`<svg width="${OG_W}" height="${OG_H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${halos
        .map(
          (halo, i) => `<radialGradient id="h${i}" cx="${halo.cx}" cy="${halo.cy}" r="${halo.r}">
        <stop offset="0%" stop-color="${halo.color}" stop-opacity="${halo.opacidad}"/>
        <stop offset="100%" stop-color="${halo.color}" stop-opacity="0"/>
      </radialGradient>`,
        )
        .join('\n      ')}
      <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="${ROJO}"/>
        <stop offset="50%" stop-color="${PURPURA}"/>
        <stop offset="100%" stop-color="${AZUL}"/>
      </linearGradient>
      <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M48 0H0V48" fill="none" stroke="${PURPURA}" stroke-opacity="0.10" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="${OG_W}" height="${OG_H}" fill="${INK}"/>
    <rect width="${OG_W}" height="${OG_H}" fill="url(#grid)"/>
    ${halos.map((_, i) => `<rect width="${OG_W}" height="${OG_H}" fill="url(#h${i})"/>`).join('\n    ')}
    <rect y="${OG_H - 8}" width="${OG_W}" height="8" fill="url(#bar)"/>
  </svg>`)

/** JPEG y no PNG: no necesita transparencia y pesa ~6x menos, y estas imagenes se
 *  descargan en cada previsualizacion. */
const guardarOg = (imagen, destino) =>
  imagen.jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true }).toFile(destino)

// ── OG de la portada ───────────────────────────────────────────────────────────
// Sin texto renderizado: el logotipo ya trae el wordmark dibujado, asi que no
// depende de las tipografias comerciales de la marca.
{
  const backdrop = fondoOg([
    { cx: '14%', cy: '4%', r: '72%', color: AZUL, opacidad: 0.42 },
    { cx: '90%', cy: '92%', r: '68%', color: ROJO, opacidad: 0.34 },
    { cx: '66%', cy: '48%', r: '52%', color: PURPURA, opacidad: 0.46 },
  ])

  const bugle = await trimmed('bugle cybperpunk.png')
    .resize({ height: 520, withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true })

  const logo = await trimmed('logo para oscuro.png')
    .resize({ width: 430, withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true })

  const info = await guardarOg(
    sharp(backdrop).composite([
      { input: bugle.data, left: OG_W - bugle.info.width + 40, top: OG_H - bugle.info.height - 30 },
      { input: logo.data, left: 76, top: Math.round((OG_H - logo.info.height) / 2) - 24 },
    ]),
    'public/og.jpg',
  )
  log('../og.jpg', info)
}

// ── OG de /sponsors ────────────────────────────────────────────────────────────
// Tiene que distinguirse de la anterior de un vistazo, porque las dos van a
// circular por los mismos chats. Cambian los halos (verde en vez de rojo) y lleva
// un rotulo que dice para quien es la pagina.
//
// El rotulo SI es texto renderizado, con una pila de fuentes genericas: es una sola
// palabra en versalitas y el resultado se comitea, asi que no depende de que otra
// maquina tenga las mismas fuentes. Todo lo demas del wordmark sigue siendo imagen.
{
  const backdrop = fondoOg([
    { cx: '12%', cy: '6%', r: '70%', color: PURPURA, opacidad: 0.5 },
    { cx: '88%', cy: '90%', r: '66%', color: VERDE, opacidad: 0.22 },
    { cx: '70%', cy: '40%', r: '54%', color: AZUL, opacidad: 0.4 },
  ])

  const rotulo = Buffer.from(`<svg width="520" height="60" xmlns="http://www.w3.org/2000/svg">
    <text x="0" y="40" font-family="Verdana, DejaVu Sans, Arial, sans-serif" font-size="30"
          font-weight="bold" letter-spacing="7" fill="${VERDE}">PATROCINIO</text>
  </svg>`)

  const bugle = await trimmed('bugle cybperpunk.png')
    .resize({ height: 460, withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true })

  const logo = await trimmed('logo para oscuro.png')
    .resize({ width: 400, withoutEnlargement: true })
    .png()
    .toBuffer({ resolveWithObject: true })

  const info = await guardarOg(
    sharp(backdrop).composite([
      { input: bugle.data, left: OG_W - bugle.info.width + 30, top: OG_H - bugle.info.height - 40 },
      { input: rotulo, left: 78, top: Math.round((OG_H - logo.info.height) / 2) - 96 },
      { input: logo.data, left: 76, top: Math.round((OG_H - logo.info.height) / 2) - 24 },
    ]),
    'public/og-sponsors.jpg',
  )
  log('../og-sponsors.jpg', info)
}

await writeFile(
  `${OUT}/README.md`,
  `# public/brand

Generado por \`scripts/prepare-assets.mjs\` (\`pnpm assets\`). **No editar a mano.**

Los originales viven en \`identidad-visual/\`. Si cambia un original, corre \`pnpm assets\`
y comitea el resultado.
`,
)

console.log('\nAssets listos en public/brand/, public/og.jpg y public/og-sponsors.jpg')
