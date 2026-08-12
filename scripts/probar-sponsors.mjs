/**
 * Prueba el lector de la hoja de patrocinio SIN tocar la interfaz.
 *
 *   pnpm probar:sponsors                     ← contra la hoja real (necesita credenciales)
 *   pnpm probar:sponsors internals/volcado.json   ← contra un volcado guardado
 *
 * ── Para qué sirve ───────────────────────────────────────────────────────────────────
 * Para separar dos preguntas que, juntas, son dificilísimas de depurar: "¿las
 * credenciales están bien?" y "¿la hoja está bien llenada?". Este script responde las
 * dos por separado y dice exactamente qué filas se descartaron y por qué.
 *
 * ── El formato del volcado ───────────────────────────────────────────────────────────
 * Un JSON con una clave por pestaña y, dentro, la matriz de celdas TAL CUAL está en la
 * hoja, con la fila de cabecera incluida:
 *
 *   {
 *     "Textos":  [["clave", "valor", "mostrable"], ["hero.titulo", "…", "SÍ"]],
 *     "Activos": [["id", "titulo", "descripcion", "icono", "orden", "mostrable"], …],
 *     "Niveles": [...], "Beneficios": [...], "Aliados": [...],
 *     "Metricas": [...], "Testimonios": [...]
 *   }
 *
 * El volcado va en `internals/`, que está fuera de git: puede tener datos que todavía no
 * son públicos.
 *
 * ── Por qué se ejecuta con `--experimental-strip-types` ──────────────────────────────
 * Para poder importar los módulos de `lib/` sin duplicar su lógica. Probar una copia del
 * lector no prueba nada: lo que hay que ejecutar es el mismo código que corre en la web.
 */
import { readFile } from 'node:fs/promises'

import { hayCredencialesDeGoogle, leerRangos } from '../lib/sheets/cliente.ts'
import { aFilas } from '../lib/sheets/filas.ts'
import {
  activosDesdeFilas,
  aliadosDesdeFilas,
  metricasDesdeFilas,
  nivelesDesdeFilas,
  testimoniosDesdeFilas,
  textosDesdeFilas,
} from '../lib/sponsors/esquemas.ts'

const PESTANAS = ['Textos', 'Activos', 'Niveles', 'Beneficios', 'Aliados', 'Metricas', 'Testimonios']

const rutaVolcado = process.argv[2]

/** Devuelve una matriz de celdas por pestaña, venga de donde venga. */
async function obtenerCrudo() {
  if (rutaVolcado) {
    console.log(`Leyendo el volcado ${rutaVolcado}\n`)
    const volcado = JSON.parse(await readFile(rutaVolcado, 'utf8'))
    return PESTANAS.map((pestana) => volcado[pestana] ?? [])
  }

  if (!hayCredencialesDeGoogle()) {
    console.error(
      'No hay credenciales de Google configuradas.\n' +
        'Pon GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY en .env, o pasa un volcado:\n' +
        '  pnpm probar:sponsors internals/volcado.json\n',
    )
    process.exit(1)
  }

  const id = process.env.GOOGLE_SHEETS_SPONSORS_ID?.trim()
  if (!id) {
    console.error('Falta GOOGLE_SHEETS_SPONSORS_ID en .env\n')
    process.exit(1)
  }

  console.log(`Leyendo la hoja ${id} desde Google\n`)
  return leerRangos(id, [
    'Textos!A1:C400',
    'Activos!A1:F200',
    'Niveles!A1:G100',
    'Beneficios!A1:E400',
    'Aliados!A1:F300',
    'Metricas!A1:E100',
    'Testimonios!A1:G200',
  ])
}

const [textos, activos, niveles, beneficios, aliados, metricas, testimonios] = await obtenerCrudo()

// Los avisos de descarte los imprime el propio validador por console.warn: aparecen aquí
// arriba, antes del resumen, y son la mitad del valor de este script.
const contenido = {
  textos: textosDesdeFilas(aFilas(textos)),
  activos: activosDesdeFilas(aFilas(activos)),
  niveles: nivelesDesdeFilas(aFilas(niveles), aFilas(beneficios)),
  aliados: aliadosDesdeFilas(aFilas(aliados)),
  metricas: metricasDesdeFilas(aFilas(metricas)),
  testimonios: testimoniosDesdeFilas(aFilas(testimonios)),
}

const claves = Object.keys(contenido.textos)

console.log('\n── Resumen ──────────────────────────────────────────────')
console.log(`  textos       ${claves.length} claves`)
console.log(`  activos      ${contenido.activos.length}`)
console.log(
  `  niveles      ${contenido.niveles.length}` +
    ` (${contenido.niveles.reduce((total, n) => total + n.beneficios.length, 0)} beneficios)`,
)
console.log(`  aliados      ${contenido.aliados.length}`)
console.log(`  metricas     ${contenido.metricas.length}`)
console.log(`  testimonios  ${contenido.testimonios.length}`)

if (claves.length) console.log(`\n  claves de Textos: ${claves.join(', ')}`)

for (const nivel of contenido.niveles) {
  console.log(
    `\n  nivel "${nivel.id}" (${nivel.nombre})${nivel.destacado ? '  ★ destacado' : ''}` +
      nivel.beneficios.map((b) => `\n    · ${b.beneficio}`).join(''),
  )
}

console.log('\n── Contenido completo ───────────────────────────────────')
console.log(JSON.stringify(contenido, null, 2))
