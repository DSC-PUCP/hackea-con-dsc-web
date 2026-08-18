/**
 * Prueba el lector de la hoja de eventos SIN tocar la interfaz.
 *
 *   pnpm probar:eventos          ← comprueba las fechas y, si hay credenciales, lee la hoja
 *
 * Hace dos cosas que conviene no confundir:
 *
 *  1. **Comprueba `lib/eventos/fechas.ts`** contra una tabla de casos. No necesita
 *     credenciales ni red, y es lo que hay que ejecutar después de tocar ese archivo.
 *  2. **Lee la hoja real** y dice qué se publicaría hoy y qué se descartó y por qué. Es
 *     la respuesta rápida a «¿por qué no sale mi evento?», sin arrancar la web.
 *
 * ── Por qué las fechas tienen su propia tabla de casos ───────────────────────────────
 * Porque es el único sitio del proyecto donde un fallo es invisible: una fecha mal leída
 * no rompe nada, no sale en consola y no se nota mirando la página — simplemente anuncia
 * el día equivocado, y alguien se presenta un jueves a un taller que era el martes.
 *
 * Ya cazó uno: una hora imposible (`99:99`) descartaba la fecha ENTERA en vez de solo la
 * hora, así que un error de tecleo en los minutos borraba el día del evento.
 *
 * ── Por qué se ejecuta con `--experimental-strip-types` ──────────────────────────────
 * Para importar los módulos de `lib/` sin duplicar su lógica. Probar una copia del lector
 * no prueba nada: lo que hay que ejecutar es el mismo código que corre en la web.
 */
import { hayCredencialesDeGoogle } from '../lib/sheets/cliente.ts'
import {
  claveDeOrden,
  fechaCompacta,
  formatearCuando,
  hoyEnLima,
  leerCuando,
  notaDeFecha,
  yaPaso,
} from '../lib/eventos/fechas.ts'
import { leerEventosDesdeSheets } from '../lib/eventos/sheets.ts'

const SIN_FECHA = 'Fecha por confirmar'
let fallos = 0

function comprobar(descripcion, obtenido, esperado) {
  const ok = obtenido === esperado
  if (!ok) fallos++
  console.log(`${ok ? '  ok  ' : ' FALLA'} ${descripcion}`)
  if (!ok) console.log(`         obtenido: ${obtenido}\n         esperaba: ${esperado}`)
}

// ═════════════════════════════════════════════════════════════════════════════════════
// 1. Fechas
// ═════════════════════════════════════════════════════════════════════════════════════

console.log('\n═══ FECHAS: cómo se imprime cada formato ═══\n')

/** [inicio, fin, texto esperado] */
const CASOS = [
  // El formato bueno: ISO en una celda de texto plano.
  ['2026-08-20 12:00', '', 'Jueves 20 de agosto de 2026 · 12:00'],
  ['2026-08-20T12:00:00', '', 'Jueves 20 de agosto de 2026 · 12:00'],
  ['2026-08-20', '', 'Jueves 20 de agosto de 2026'],
  ['2026-09', '', 'Setiembre de 2026'],

  // La red de seguridad: lo que llega si la celda quedó como fecha de verdad. Día primero.
  ['20/08/2026 12:00:00', '', 'Jueves 20 de agosto de 2026 · 12:00'],
  ['3/09/2026 12:00', '', 'Jueves 3 de setiembre de 2026 · 12:00'],

  // Rangos.
  ['2026-08-20 12:00', '2026-08-20 14:00', 'Jueves 20 de agosto de 2026 · 12:00–14:00'],
  ['2026-08-28 16:00', '2026-08-30 20:00', 'Del 28 al 30 de agosto de 2026'],
  ['2026-08-30 16:00', '2026-09-01 20:00', 'Del 30 de agosto al 1 de setiembre de 2026'],

  // Todo lo que no es una fecha cae al texto de respaldo, sin lanzar.
  ['', '', SIN_FECHA],
  ['   ', '', SIN_FECHA],
  ['por definir', '', SIN_FECHA],
  ['2026-13-40', '', SIN_FECHA],
  ['1850-01-01', '', SIN_FECHA],
  // Un fin sin inicio no describe nada.
  ['', '2026-08-20 14:00', SIN_FECHA],
  // Una hora imposible se calla, pero NO se lleva por delante el día.
  ['2026-08-20 99:99', '', 'Jueves 20 de agosto de 2026'],
]

for (const [inicio, fin, esperado] of CASOS) {
  comprobar(
    `${JSON.stringify(inicio).padEnd(22)} ${JSON.stringify(fin).padEnd(20)}`,
    formatearCuando(leerCuando(inicio, fin), SIN_FECHA),
    esperado,
  )
}

console.log('\n═══ FECHAS: el bloque de día de la lista ═══\n')

/** [inicio, `principal/secundario/hora` esperados] */
const CASOS_BLOQUE = [
  ['2026-08-20 12:00', '20 / jue / 12:00'],
  ['2026-08-20', '20 / jue / —'],
  ['2026-09', 'set / 2026 / —'],
  ['', '— / — / —'],
]

for (const [inicio, esperado] of CASOS_BLOQUE) {
  const { principal, secundario, hora } = fechaCompacta(leerCuando(inicio, ''))
  comprobar(
    `bloque de ${JSON.stringify(inicio).padEnd(20)}`,
    `${principal} / ${secundario ?? '—'} / ${hora ?? '—'}`,
    esperado,
  )
}

console.log('\n═══ FECHAS: la nota solo habla cuando el bloque se queda corto ═══\n')

/*
 * Esta es la regla que arregla el defecto de la versión anterior, donde la misma fecha
 * salía dos veces en la misma fila: si el bloque ya lo dice todo, la nota es `null` y la
 * fila no pinta esa línea.
 */
const CASOS_NOTA = [
  ['2026-08-20 12:00', '', null, 'un día a una hora: el bloque ya lo dice, la nota calla'],
  ['2026-08-20', '', null, 'solo el día: idem'],
  ['2026-08-20 12:00', '2026-08-20 14:00', 'Hasta las 14:00', 'hora de fin'],
  ['2026-08-28 16:00', '2026-08-30 20:00', 'Hasta el 30 de agosto', 'varios días'],
  ['', '', SIN_FECHA, 'sin fecha, lo dice la nota'],
]

for (const [inicio, fin, esperado, porque] of CASOS_NOTA) {
  comprobar(porque, String(notaDeFecha(leerCuando(inicio, fin), SIN_FECHA)), String(esperado))
}

console.log('\n═══ FECHAS: orden (lo que tiene día primero, lo que no se sabe al final) ═══\n')

const ORDEN_ESPERADO = ['2026-08-20 12:00', '2026-08-20 16:00', '2026-09', '']
const revuelto = ['', '2026-09', '2026-08-20 16:00', '2026-08-20 12:00']
comprobar(
  'ordena por fecha y deja lo indefinido al final',
  revuelto
    .map((v) => [claveDeOrden(leerCuando(v, '')), v])
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v)
    .join(' | '),
  ORDEN_ESPERADO.join(' | '),
)

console.log('\n═══ FECHAS: qué se considera pasado (hoy simulado: 10 de setiembre de 2026) ═══\n')

const HOY = { anio: 2026, mes: 9, dia: 10 }
const CASOS_PASADO = [
  ['2026-09-09 12:00', '', true, 'ayer ya no se anuncia'],
  ['2026-09-10 12:00', '', false, 'hoy se anuncia todo el día'],
  ['2026-09-11 12:00', '', false, 'mañana se anuncia'],
  ['2026-09-08 16:00', '2026-09-12 20:00', false, 'hackathon en curso sigue anunciándose'],
  ['2026-08', '', true, 'un mes que ya terminó'],
  ['2026-09', '', false, 'el mes en curso'],
  ['', '', false, 'sin fecha NUNCA desaparece'],
]

for (const [inicio, fin, esperado, porque] of CASOS_PASADO) {
  comprobar(porque, String(yaPaso(leerCuando(inicio, fin), HOY)), String(esperado))
}

// ═════════════════════════════════════════════════════════════════════════════════════
// 2. La hoja real
// ═════════════════════════════════════════════════════════════════════════════════════

console.log('\n═══ HOJA ═══\n')

if (!hayCredencialesDeGoogle()) {
  console.log('  Sin credenciales de Google: solo se comprobaron las fechas.')
  console.log('  Para leer la hoja: GOOGLE_SERVICE_ACCOUNT_EMAIL y GOOGLE_PRIVATE_KEY en .env')
} else if (!process.env.GOOGLE_SHEETS_EVENTS_ID?.trim()) {
  console.log('  Falta GOOGLE_SHEETS_EVENTS_ID en .env')
} else {
  const contenido = await leerEventosDesdeSheets()

  if (!contenido) {
    console.log('  ❌ No se pudo leer la hoja. El motivo está arriba, en el error.')
    fallos++
  } else {
    const hoy = hoyEnLima()
    console.log(`  Hoy en Lima: ${hoy.anio}-${hoy.mes}-${hoy.dia}`)
    console.log(`  ${contenido.eventos.length} eventos con Mostrable = Sí\n`)

    for (const evento of contenido.eventos) {
      const pasado = yaPaso(evento.cuando, hoy)
      const gente = ['ponentes', 'mentores', 'jurados']
        .map((rol) => (evento[rol].length ? `${rol}: ${evento[rol].length}` : null))
        .filter(Boolean)
        .join(', ')

      console.log(`  ${pasado ? '(pasado)' : 'EN LA WEB'}  ${evento.nombre}`)
      console.log(`      ${formatearCuando(evento.cuando, SIN_FECHA)}`)
      console.log(`      tipo: ${evento.tipo}  ·  inscripción: ${evento.inscripcion ?? 'todavía no'}`)
      if (gente) console.log(`      ${gente}`)
    }
  }
}

console.log(fallos === 0 ? '\n✅ Todo correcto\n' : `\n❌ ${fallos} fallo(s)\n`)
process.exit(fallos === 0 ? 0 : 1)
