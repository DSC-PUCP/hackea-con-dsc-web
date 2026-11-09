/** La imagen social usa la foto pública del equipo, sin recortar a sus integrantes. */
import { readFile } from 'node:fs/promises'
import sharp from 'sharp'

import { organizacion, seoOrganizacion } from '../lib/site-config.ts'

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
const verde = token('green')
const foto = await sharp(`public${organizacion.foto.src}`).resize({ width: 670 }).toBuffer()
const logo = await sharp('public/brand/logo-hack-with-dsc.webp').resize({ width: 310 }).toBuffer()
const panel = Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="500" height="630" fill="${tinta}"/>
  <rect x="500" width="10" height="630" fill="${morado}"/>
  <text x="40" y="305" font-family="Verdana, Arial, sans-serif" font-size="46" font-weight="bold" fill="${claro}">${escapar(seoOrganizacion.ogTitulo)}</text>
  <text x="40" y="365" font-family="Verdana, Arial, sans-serif" font-size="20" fill="${verde}">${escapar(seoOrganizacion.ogResumen)}</text>
  <rect y="622" width="1200" height="8" fill="${morado}"/>
</svg>`)
await sharp({ create: { width: 1200, height: 630, channels: 3, background: tinta } })
  .composite([
    { input: foto, left: 520, top: 64 },
    { input: panel, left: 0, top: 0 },
    { input: logo, left: 40, top: 56 },
  ])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile(`public${seoOrganizacion.ogImagen}`)
console.log(`Organización OG: ${seoOrganizacion.ogImagen}`)
