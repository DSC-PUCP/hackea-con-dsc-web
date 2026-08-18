/**
 * Validación y transformación de las filas de la hoja de eventos.
 *
 * Es LA frontera: acá entra texto escrito por personas y sale `ContenidoEventos` bien
 * formado. Todo lo que esté después puede confiar en los tipos.
 *
 * Mismas reglas que en `lib/sponsors/esquemas.ts`, con una diferencia importante:
 *
 *  1. Se descarta primero lo que no sea `mostrable`. Antes que cualquier otra cosa.
 *  2. Una fila inválida se descarta y se registra; nunca tumba la página.
 *  3. **No hay columna `orden`.** Los eventos se ordenan por fecha, que es el único orden
 *     que una agenda puede tener. Una columna `orden` acá sería una segunda fuente de
 *     verdad discrepando con la primera.
 *
 * ── Por qué las columnas se leen por NOMBRE y nunca por posición ─────────────────────
 * `lib/sheets/filas.ts` convierte la cabecera en claves normalizadas (minúsculas, sin
 * tildes, con guion bajo), así que el equipo puede mover columnas, escribir `MOSTRABLE`
 * en mayúsculas o comerse la tilde de `Descripción` sin que nada cambie. Lo que sí rompe
 * es RENOMBRAR una cabecera; está avisado en docs/eventos.md.
 */

import { z } from 'zod'

import { esMostrable, oNulo, type Fila, type Pestana } from '../sheets/filas.ts'
import { urlDeImagen } from '../sheets/imagenes.ts'

import { claveDeOrden, leerCuando } from './fechas.ts'
import type { Evento, Persona, TipoEvento } from './types.ts'

/** Carpeta de `public/` donde se buscan las fotos que la hoja nombra por su nombre. */
const CARPETA_FOTOS = '/eventos/personas'

/**
 * Las marcas diacríticas que `normalize('NFD')` separa de su letra. Se construye con
 * `new RegExp` y no como literal por el mismo motivo que en lib/sheets/filas.ts: escrito
 * como literal serían dos caracteres invisibles entre corchetes, imposibles de revisar en
 * un diff.
 */
const DIACRITICOS = new RegExp('[\\u0300-\\u036f]', 'g')

/**
 * Deja constancia de lo que se descartó.
 *
 * `console.warn` y no un servicio de errores porque no es un error: es el estado normal
 * de una hoja a medio llenar. Lo que importa es que quede rastro para cuando alguien
 * pregunte «¿por qué no sale mi evento?».
 */
function avisar(pestana: string, detalle: string) {
  console.warn(`[eventos] ${pestana}: ${detalle}`)
}

// ═════════════════════════════════════════════════════════════════════════════════════
// Personas
// ═════════════════════════════════════════════════════════════════════════════════════

const esquemaPersona = z.object({
  id_persona: z.string().min(1),
  nombres_y_apellidos: z.string().min(1),
})

/**
 * Las personas, indexadas por su ID en mayúsculas.
 *
 * Se devuelve un `Map` y no una lista porque el único uso es buscar por ID, doce veces
 * por evento. Con una lista sería un `find` dentro de un bucle dentro de otro bucle.
 *
 * El ID se normaliza a mayúsculas y sin espacios en los DOS lados —acá y al leer las
 * columnas de roles— para que `shiara`, `SHIARA` y `Shiara ` sean la misma persona. Quien
 * escribe `SHIARA` en una celda y `Shiara` en otra no está cometiendo un error, y no
 * tiene por qué enterarse de que existe la distinción.
 */
export function personasDesdeFilas(pestana: Pestana): Map<string, Persona> {
  const personas = new Map<string, Persona>()

  pestana.filas.forEach((fila, posicion) => {
    if (!esMostrable(fila)) return

    const revision = esquemaPersona.safeParse(fila)
    if (!revision.success) {
      const campos = revision.error.issues.map((problema) => problema.path.join('.')).join(', ')
      avisar('Personas', `fila ${pestana.cabeceraEnFila + 1 + posicion} descartada, faltan: ${campos}`)
      return
    }

    const id = normalizarId(fila.id_persona)

    if (personas.has(id)) {
      avisar('Personas', `ID repetido "${id}"; se queda la primera aparición`)
      return
    }

    personas.set(id, {
      id,
      nombre: fila.nombres_y_apellidos,
      cargo: oNulo(fila.cargo),
      linkedin: enlaceExterno(fila.linkedin_url),
      github: enlaceExterno(fila.github_url),
      foto: resolverImagen(oNulo(fila.imagen_url)),
    })
  })

  return personas
}

function normalizarId(valor: string): string {
  return valor.trim().toUpperCase()
}

// ═════════════════════════════════════════════════════════════════════════════════════
// Eventos
// ═════════════════════════════════════════════════════════════════════════════════════

const esquemaEvento = z.object({
  nombre_de_evento: z.string().min(1),
})

/**
 * Los tipos que la hoja usa hoy, mapeados a las claves que entiende el componente.
 *
 * La comparación es por CONTENIDO y no por igualdad exacta, en el orden de esta lista:
 * la hoja tiene `Ponencia o taller`, y ese evento se pinta como taller. Es la lectura
 * correcta —el formato dominante manda— y evita tener que pedirle al equipo que se
 * decida antes de poder publicar.
 */
const TIPOS: readonly [string, TipoEvento][] = [
  ['hackathon', 'hackathon'],
  ['taller', 'taller'],
  ['ponencia', 'ponencia'],
  ['networking', 'networking'],
]

function leerTipo(valor: string | undefined): TipoEvento {
  const texto = (valor ?? '').toLowerCase()
  return TIPOS.find(([aguja]) => texto.includes(aguja))?.[1] ?? 'otro'
}

/**
 * Lee `Permite externos`. Solo un sí o un no rotundos cuentan; cualquier otra cosa
 * («Maso», «Depende», vacío) devuelve `null` y la tarjeta no dice nada al respecto.
 *
 * Se usa una lista propia y no `esMostrable` porque el significado es distinto: acá una
 * celda vacía NO es un no, es un «todavía no se sabe». Reusar la función haría que un
 * evento sin decidir se anunciara como cerrado a externos.
 */
function leerPermiteExternos(valor: string | undefined): boolean | null {
  const texto = (valor ?? '').normalize('NFD').replace(DIACRITICOS, '').trim().toLowerCase()

  if (['si', 'yes', 'true', 'x'].includes(texto)) return true
  if (['no', 'false'].includes(texto)) return false

  return null
}

/**
 * Resuelve una columna de roles (`SHIARA, ANT_CUEVA`) a personas de verdad.
 *
 * Un ID que no existe en la pestaña de personas **se descarta con aviso**, y no se
 * inventa una persona con ese nombre: publicar «ANT_CUEVA» como si fuera el nombre de
 * alguien es peor que no publicar nada. Casi siempre significa una de dos cosas, y las
 * dos se arreglan en la hoja: un ID mal escrito, o una persona que existe pero tiene su
 * propio `Mostrable` en No.
 *
 * Se aceptan comas y saltos de línea como separadores, porque en una celda de Sheets
 * escribir una lista con Alt+Enter es tan natural como con comas.
 */
function leerRol(
  crudo: string | undefined,
  personas: Map<string, Persona>,
  evento: string,
  rol: string,
): Persona[] {
  const resultado: Persona[] = []

  for (const trozo of (crudo ?? '').split(/[,\n]/)) {
    const id = normalizarId(trozo)
    // Un guion es como el equipo escribe «ninguno». No es un ID que falte.
    if (!id || id === '-') continue

    const persona = personas.get(id)
    if (!persona) {
      avisar('Eventos', `"${evento}" → ${rol}: no existe la persona "${id}"`)
      continue
    }

    // Alguien puesto dos veces en el mismo rol sale una sola vez.
    if (!resultado.some((otra) => otra.id === id)) resultado.push(persona)
  }

  return resultado
}

/**
 * Convierte la pestaña de eventos en la lista lista para pintar, ya ordenada por fecha.
 *
 * NO filtra los eventos que ya pasaron: eso depende de qué día es hoy, y meterlo acá lo
 * dejaría congelado dentro de la caché de una hora. Lo hace el componente, en cada
 * render. Ver `lib/eventos/contenido.ts`.
 */
export function eventosDesdeFilas(pestana: Pestana, personas: Map<string, Persona>): Evento[] {
  const eventos: Evento[] = []

  pestana.filas.forEach((fila, posicion) => {
    if (!esMostrable(fila)) return

    const revision = esquemaEvento.safeParse(fila)
    if (!revision.success) {
      const enLaHoja = pestana.cabeceraEnFila + 1 + posicion
      avisar('Eventos', `fila ${enLaHoja} descartada: no tiene nombre`)
      return
    }

    const nombre = fila.nombre_de_evento

    eventos.push({
      id: oNulo(fila.id) ?? `fila-${posicion}`,
      nombre,
      tipo: leerTipo(fila.tipo),
      tipoEtiqueta: oNulo(fila.tipo),
      cuando: leerCuando(fila.inicio, fila.fin),
      descripcion: oNulo(fila.descripcion_web),
      ponentes: leerRol(fila.ponentes, personas, nombre, 'ponentes'),
      mentores: leerRol(fila.mentores, personas, nombre, 'mentores'),
      jurados: leerRol(fila.jurados, personas, nombre, 'jurados'),
      inscripcion: enlaceExterno(fila.link_de_inscripcion_luma),
      permiteExternos: leerPermiteExternos(fila.permite_externos_a_pucp),
    })
  })

  return eventos.sort((a, b) => claveDeOrden(a.cuando) - claveDeOrden(b.cuando))
}

// ═════════════════════════════════════════════════════════════════════════════════════
// Utilidades compartidas
// ═════════════════════════════════════════════════════════════════════════════════════

/**
 * Solo se admiten enlaces `http(s)`. Cualquiera con permiso de edición en la hoja podría
 * escribir `javascript:...` en una celda de URL, y eso acabaría dentro de un `href`.
 */
function enlaceExterno(valor: string | undefined): string | null {
  const limpio = oNulo(valor)
  if (!limpio) return null

  if (!/^https?:\/\//i.test(limpio)) {
    avisar('Eventos/Personas', `enlace ignorado por no ser http(s): "${limpio}"`)
    return null
  }

  return limpio
}

/**
 * Resuelve la columna de imagen a algo que se pueda poner en un `src`: una URL absoluta
 * —incluidos los enlaces de Drive, que se traducen a su versión servible— o el nombre de
 * un archivo de `public/eventos/personas/`.
 *
 * Del nombre de archivo se toma SOLO la última parte: si alguien escribe `../../.env` en
 * la celda, queda en `.env` y se resuelve dentro de la carpeta de fotos, que no lleva a
 * ninguna parte. Es texto que edita gente distinta a la que despliega.
 */
function resolverImagen(valor: string | null): string | null {
  if (!valor) return null
  if (/^https?:\/\//i.test(valor)) return urlDeImagen(valor)

  const archivo = valor.split(/[\\/]/).pop()?.trim()
  return archivo ? `${CARPETA_FOTOS}/${archivo}` : null
}
