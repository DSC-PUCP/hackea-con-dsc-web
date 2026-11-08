/** La vista previa del recap usa la misma foto, textos y colores que la página. */
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'

import { recapDscHack, seoDscHack } from '../lib/site-config.ts'

const css = await readFile('app/globals.css', 'utf8')
const token = (nombre) => {
  const valor = css.match(new RegExp(`--brand-${nombre}:\\s*([^;]+);`))?.[1]
  if (!valor) throw new Error(`Falta el token de marca ${nombre}`)
  return valor
}
const escapar = (texto) => texto.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
const tinta = token('ink')
const claro = token('light')
const morado = token('purple')
const rojo = token('red')
const verde = token('green')

// Se conservan las caras de la foto original; el texto vive en su propio panel.
const foto = await sharp(`public${recapDscHack.fotoPortada.src}`)
  .resize(690, 630, { fit: 'cover', position: 'bottom' })
  .toBuffer()
const logo = await sharp('public/brand/logo-hack-with-dsc.webp')
  .resize({ width: 290 })
  .toBuffer()
const panel = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="510" height="630" fill="${tinta}"/>
  <rect x="500" width="10" height="630" fill="${morado}"/>
  <rect x="40" y="238" width="76" height="6" fill="${rojo}"/>
  <text x="40" y="300" font-family="Verdana, Arial, sans-serif" font-size="44" font-weight="bold" fill="${claro}">${escapar(seoDscHack.ogTitulo)}</text>
  <text x="40" y="365" font-family="Verdana, Arial, sans-serif" font-size="44" font-weight="bold" fill="${verde}">${escapar(seoDscHack.ogEdicion)}</text>
  <text x="40" y="442" font-family="Verdana, Arial, sans-serif" font-size="22" fill="${claro}">${escapar(seoDscHack.ogResumen)}</text>
  <rect x="0" y="622" width="1200" height="8" fill="${morado}"/>
</svg>`)

const resultado = await sharp({ create: { width: 1200, height: 630, channels: 3, background: tinta } })
  .composite([
    { input: foto, left: 510, top: 0 },
    { input: panel, left: 0, top: 0 },
    { input: logo, left: 40, top: 46 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(`public${seoDscHack.ogImagen}`)

console.log(`Recap OG: ${resultado.width}×${resultado.height}, ${Math.round(resultado.size / 1024)} KB`)
