/**
 * Cuándo ocurre un evento, leído de una celda que escribe una persona.
 *
 * ── Por qué esto no usa `Date` para mostrar ──────────────────────────────────────────
 * `new Date('2026-08-20 12:00')` interpreta la cadena en la zona horaria del proceso.
 * En local eso es Lima; en el contenedor de la MV y en Vercel es UTC. La misma celda
 * saldría «20 de agosto, 12:00» en la laptop de quien desarrolla y «20 de agosto, 07:00»
 * en producción, sin que nada falle ni avise.
 *
 * Por eso una fecha acá NO es un instante en el tiempo: es lo que alguien escribió en un
 * calendario de pared. Se guarda descompuesta (año, mes, día, hora, minuto) y se imprime
 * pieza por pieza. No hay conversión de zona horaria posible porque nunca hay una zona
 * horaria de por medio.
 *
 * `Date` sí se usa, pero solo para UNA cosa: averiguar el día de la semana, y ahí se
 * construye con `Date.UTC`, que no depende del entorno.
 *
 * ── Por qué la precisión es parte del dato ───────────────────────────────────────────
 * Cuando se planifica un programa, la mitad de las fechas no existen todavía. El equipo
 * sabe «en setiembre» mucho antes de saber «el jueves 3 a las 12». Si el modelo obligara
 * a una fecha completa, esa información —que es real y le sirve a quien lee— habría que
 * tirarla o inventarla.
 *
 * Así que se admiten cuatro grados de certeza, y la web dice exactamente lo que se sabe:
 *
 *   2026-08-20 12:00  →  «Jueves 20 de agosto de 2026 · 12:00»
 *   2026-08-20        →  «Jueves 20 de agosto de 2026»
 *   2026-09           →  «Setiembre de 2026»
 *   (celda vacía)     →  lo resuelve quien llama; acá es `null`
 *
 * ── Formatos que se aceptan al leer ──────────────────────────────────────────────────
 * El formato bueno, y el único que hay que escribir de ahora en adelante, es ISO en una
 * celda de TEXTO PLANO: `2026-08-20 12:00`.
 *
 * También se acepta `20/08/2026 12:00:00`, que es lo que devuelve Google cuando la celda
 * quedó como fecha de verdad: la API se pide con `FORMATTED_VALUE` (ver
 * lib/sheets/cliente.ts) y entonces llega ya pintada según el idioma de la hoja. Se lee
 * DÍA PRIMERO, que es como está configurada la hoja hoy.
 *
 * Ese segundo formato es una red de seguridad, no una opción: depende del formato de la
 * columna, así que el día que alguien lo cambie a «20 ago 2026» deja de leerse. Con texto
 * plano no hay nada que pueda cambiar.
 */

/**
 * Un momento con la precisión que se sepa. `dia` en `null` significa que solo se conoce
 * el mes; `hora` en `null`, que solo se conoce el día.
 */
export type Instante = {
  anio: number
  /** 1–12, como lo escribe una persona. No es el 0–11 de `Date`. */
  mes: number
  dia: number | null
  hora: number | null
  minuto: number | null
}

/** Un evento va de un `inicio` a un `fin` opcional. Sin fin, dura lo que dure. */
export type Cuando = {
  inicio: Instante
  fin: Instante | null
}

const MESES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  // «Setiembre» y no «septiembre»: es la forma corriente en Perú y la que usa el equipo.
  'setiembre',
  'octubre',
  'noviembre',
  'diciembre',
]

const DIAS_DE_LA_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']

/** Versiones cortas, para el bloque de fecha de la lista. Mismo orden que las largas. */
const MESES_CORTOS = MESES.map((mes) => mes.slice(0, 3))
const DIAS_CORTOS = DIAS_DE_LA_SEMANA.map((dia) => dia.slice(0, 3))

/** `2026-08-20`, `2026-8-20 12:00`, `2026-08-20T12:00:00`, `2026-09`. */
const ISO = /^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?(?:[ T](\d{1,2}):(\d{2}))?/

/** `20/08/2026`, `3/09/2026 12:00:00`. Día primero. */
const CON_BARRAS = /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ ,]+(\d{1,2}):(\d{2}))?/

/**
 * Lee una celda y devuelve el instante que describa, o `null` si no describe ninguno.
 *
 * Nunca lanza. Una celda con «por definir», con una frase, o con una fecha imposible
 * (`2026-13-40`) devuelve `null`, y quien llama decide qué mostrar. Descartar en silencio
 * es correcto acá: la celda a medio llenar es el estado normal de esta hoja.
 */
export function leerInstante(valor: string | null | undefined): Instante | null {
  const limpio = valor?.trim()
  if (!limpio) return null

  const iso = limpio.match(ISO)
  if (iso) {
    return validar({
      anio: Number(iso[1]),
      mes: Number(iso[2]),
      dia: iso[3] ? Number(iso[3]) : null,
      hora: iso[4] ? Number(iso[4]) : null,
      minuto: iso[5] ? Number(iso[5]) : null,
    })
  }

  const barras = limpio.match(CON_BARRAS)
  if (barras) {
    return validar({
      anio: Number(barras[3]),
      mes: Number(barras[2]),
      dia: Number(barras[1]),
      hora: barras[4] ? Number(barras[4]) : null,
      minuto: barras[5] ? Number(barras[5]) : null,
    })
  }

  return null
}

/**
 * Rechaza lo que parece una fecha pero no lo es.
 *
 * Se comprueba el rango y no que el día exista de verdad en ese mes: un 31 de febrero se
 * publica tal cual. Es deliberado — si alguien lo escribió, verlo impreso en la web es la
 * forma más rápida de que se dé cuenta, mucho más que un `null` que hace desaparecer la
 * fecha sin explicación.
 *
 * ── La hora se descarta aparte, y no tumba la fecha ──────────────────────────────────
 * Un año, mes o día fuera de rango dejan la celda sin significado, así que se devuelve
 * `null` entera. Una hora imposible (`99:99`, de teclear mal) no: la fecha que la
 * acompaña es perfectamente buena, y perder «jueves 20 de agosto» por un error en los
 * minutos es tirar información correcta. Se publica el día y se calla la hora.
 */
function validar(instante: Instante): Instante | null {
  const { anio, mes, dia, hora, minuto } = instante

  if (mes < 1 || mes > 12) return null
  if (dia !== null && (dia < 1 || dia > 31)) return null
  if (anio < 2000 || anio > 2100) return null

  const horaValida =
    hora !== null && hora >= 0 && hora <= 23 && (minuto === null || (minuto >= 0 && minuto <= 59))

  return horaValida ? instante : { ...instante, hora: null, minuto: null }
}

/**
 * Junta las columnas `Inicio` y `Fin` en un solo dato.
 *
 * Un `Fin` sin `Inicio` no significa nada, así que se ignora: sin principio no hay rango
 * que mostrar, y publicar «hasta las 14:00» sería peor que no publicar nada.
 */
export function leerCuando(inicio: string | null | undefined, fin: string | null | undefined): Cuando | null {
  const desde = leerInstante(inicio)
  if (!desde) return null

  return { inicio: desde, fin: leerInstante(fin) }
}

/**
 * Escribe el `Cuando` como lo leería una persona, diciendo solo lo que se sabe.
 *
 * El año va SIEMPRE, incluso en el año en curso. Podría omitirse cuando coincide con el
 * actual, pero entonces el texto dependería de cuándo se renderiza la página: la misma
 * copia guardada en caché diría una cosa en diciembre y otra en enero. Que sea siempre
 * igual vale más que ahorrar cinco caracteres.
 */
export function formatearCuando(cuando: Cuando | null, sinFecha: string): string {
  if (!cuando) return sinFecha

  const { inicio, fin } = cuando

  // Solo se sabe el mes.
  if (inicio.dia === null) return capitalizar(`${MESES[inicio.mes - 1]} de ${inicio.anio}`)

  // Varios días: hackathons, sobre todo. Se dice el rango y se callan las horas, que en
  // un evento de dos días no le sirven a nadie.
  if (fin?.dia != null && (fin.dia !== inicio.dia || fin.mes !== inicio.mes)) {
    const desde =
      fin.mes === inicio.mes ? `${inicio.dia}` : `${inicio.dia} de ${MESES[inicio.mes - 1]}`
    return `Del ${desde} al ${fin.dia} de ${MESES[fin.mes - 1]} de ${fin.anio}`
  }

  const diaSemana = DIAS_DE_LA_SEMANA[diaDeLaSemana(inicio)]
  const fecha = `${diaSemana} ${inicio.dia} de ${MESES[inicio.mes - 1]} de ${inicio.anio}`

  if (inicio.hora === null) return capitalizar(fecha)

  const horas =
    fin?.hora != null ? `${reloj(inicio)}–${reloj(fin)}` : reloj(inicio)

  return capitalizar(`${fecha} · ${horas}`)
}

/**
 * Día de la semana (0 = domingo).
 *
 * `Date.UTC` y no `new Date(a, m, d)`: el segundo construye la fecha en la zona del
 * proceso, y con eso vuelve por la puerta de atrás justo el problema que este módulo
 * evita. En UTC el resultado es el mismo en la laptop y en el contenedor.
 */
function diaDeLaSemana({ anio, mes, dia }: Instante): number {
  return new Date(Date.UTC(anio, mes - 1, dia ?? 1)).getUTCDay()
}

function reloj({ hora, minuto }: Instante): string {
  return `${String(hora ?? 0).padStart(2, '0')}:${String(minuto ?? 0).padStart(2, '0')}`
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/**
 * El bloque de fecha que va a la izquierda de cada fila de la lista.
 *
 * Es lo que permite escanear la agenda de un vistazo sin leer nada: la columna de números
 * baja en orden y el ojo salta al día que le interesa. Por eso `principal` es siempre
 * corto —dos caracteres cuando se puede— y nunca crece: en un móvil de 350 px esta
 * columna se lleva 48 px fijos, y si un evento de varios días pusiera «28–30» ahí, la
 * columna dejaría de estar alineada con las demás.
 *
 * El rango completo no se pierde: sale en `formatearCuandoBreve`, en la misma fila.
 */
export function fechaCompacta(cuando: Cuando | null): {
  principal: string
  secundario: string | null
  hora: string | null
} {
  if (!cuando) return { principal: '—', secundario: null, hora: null }

  const { mes, dia, hora } = cuando.inicio

  // Solo se sabe el mes: el bloque lo dice, y así la fila no se queda sin ancla visual.
  if (dia === null) {
    return { principal: MESES_CORTOS[mes - 1], secundario: String(cuando.inicio.anio), hora: null }
  }

  return {
    principal: String(dia),
    secundario: DIAS_CORTOS[diaDeLaSemana(cuando.inicio)],
    hora: hora === null ? null : reloj(cuando.inicio),
  }
}

/**
 * La línea que acompaña al título SOLO cuando el bloque de fecha se queda corto.
 *
 * Devuelve `null` en el caso normal —un evento de un día a una hora— porque el bloque ya
 * lo dice entero, y repetirlo era exactamente el defecto de la versión anterior: la misma
 * información dos veces en la misma fila. Acá solo se habla cuando hay algo que añadir:
 *
 *   evento de varios días  →  «Hasta el 30 de agosto»
 *   con hora de fin        →  «Hasta las 14:00»
 *   sin fecha              →  el texto de respaldo que le pasen
 */
export function notaDeFecha(cuando: Cuando | null, sinFecha: string): string | null {
  if (!cuando) return sinFecha

  const { inicio, fin } = cuando
  if (!fin) return null

  if (fin.dia != null && (fin.dia !== inicio.dia || fin.mes !== inicio.mes)) {
    return `Hasta el ${fin.dia} de ${MESES[fin.mes - 1]}`
  }

  return fin.hora != null ? `Hasta las ${reloj(fin)}` : null
}

/**
 * A qué mes pertenece un evento, para agrupar la lista bajo un encabezado.
 *
 * Devuelve también una `clave` estable porque el rótulo no sirve como identidad: dos
 * «Agosto» de años distintos son grupos distintos, y el programa puede cruzar diciembre.
 *
 * Los eventos sin fecha caen todos en un grupo propio, que la lista pone al final.
 */
export function grupoDeMes(
  cuando: Cuando | null,
  sinFecha: string,
): { clave: string; rotulo: string } {
  if (!cuando) return { clave: 'sin-fecha', rotulo: sinFecha }

  const { anio, mes } = cuando.inicio
  return {
    clave: `${anio}-${String(mes).padStart(2, '0')}`,
    rotulo: capitalizar(`${MESES[mes - 1]} ${anio}`),
  }
}

/**
 * Clave numérica para ordenar. Los eventos sin fecha van al final, que es donde tiene
 * sentido leerlos: primero lo que ya tiene día, después lo que todavía se está cociendo.
 */
export function claveDeOrden(cuando: Cuando | null): number {
  if (!cuando) return Number.MAX_SAFE_INTEGER

  const { anio, mes, dia, hora, minuto } = cuando.inicio
  return anio * 1e8 + mes * 1e6 + (dia ?? 0) * 1e4 + (hora ?? 0) * 1e2 + (minuto ?? 0)
}

/** El día de hoy en Lima, descompuesto igual que un `Instante`. */
export type Hoy = { anio: number; mes: number; dia: number }

/**
 * Qué día es hoy en Lima, sin importar dónde corra el servidor.
 *
 * `en-CA` porque su formato de fecha es exactamente `YYYY-MM-DD`, que es lo único que se
 * necesita. La alternativa sería hacer cuentas con desplazamientos horarios a mano, que
 * es donde se cuelan los errores de un día entero.
 */
export function hoyEnLima(): Hoy {
  const [anio, mes, dia] = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Lima',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
    .format(new Date())
    .split('-')
    .map(Number)

  return { anio, mes, dia }
}

/**
 * ¿Ya pasó? Se compara solo la fecha, nunca la hora: un evento que empieza hoy a las 12
 * sigue anunciándose toda la jornada, porque a las 13 todavía le sirve a quien está
 * decidiendo si va.
 *
 * Reglas de los casos incompletos, y las dos son a favor de seguir mostrando:
 *  · sin fecha (`null`) → nunca pasa. Es un evento del programa que aún no tiene día.
 *  · solo mes → pasa cuando termina ese mes, no cuando empieza.
 */
export function yaPaso(cuando: Cuando | null, hoy: Hoy): boolean {
  if (!cuando) return false

  // El fin manda cuando existe: una hackathon de tres días no «pasó» el primero.
  const referencia = cuando.fin?.dia != null ? cuando.fin : cuando.inicio
  const { anio, mes, dia } = referencia

  if (anio !== hoy.anio) return anio < hoy.anio
  if (mes !== hoy.mes) return mes < hoy.mes

  return dia !== null && dia < hoy.dia
}
