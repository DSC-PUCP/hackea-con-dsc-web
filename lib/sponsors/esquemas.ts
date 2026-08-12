/**
 * Validación y transformación de las filas de la hoja de patrocinio.
 *
 * Es LA frontera del sistema: acá entra texto escrito por personas y sale
 * `ContenidoSponsors` bien formado. Todo lo que esté después puede confiar en los tipos.
 *
 * Las tres reglas, en orden:
 *
 *  1. Se descarta primero lo que no sea `mostrable`. Antes que cualquier otra cosa.
 *  2. Una fila inválida **se descarta y se registra**; nunca tumba la página. Es
 *     preferible una web con tres niveles que una web caída por el cuarto.
 *  3. Se ordena por la columna `orden`, con la posición en la hoja como desempate.
 *
 * Se usa Zod y no comprobaciones a mano porque acá las reglas son el documento: se leen
 * de un vistazo y el mensaje de error dice qué columna faltó.
 */

import { z } from 'zod'

import { aOrden, esMostrable, oNulo, porOrden, type Fila, type Pestana } from '../sheets/filas.ts'
import { urlDeImagen } from '../sheets/imagenes.ts'

import type {
  Activo,
  Aliado,
  Beneficio,
  IconoActivo,
  Metrica,
  Nivel,
  Testimonio,
  Textos,
} from './types.ts'

/** Carpetas de `public/` donde se buscan los archivos que la hoja nombra por su nombre. */
const CARPETA_LOGOS = '/sponsors/aliados'
const CARPETA_FOTOS = '/sponsors/testimonios'

/** Claves válidas de la columna `icono`. Tienen que coincidir con el mapa del componente. */
const ICONOS: readonly IconoActivo[] = ['visibilidad', 'comunidad', 'premio', 'campus', 'contenido']

/**
 * Deja constancia de lo que se descartó.
 *
 * Va a `console.warn` y no a un servicio de errores porque no es un error: es el estado
 * normal de una hoja a medio llenar. Lo que importa es que quede rastro para cuando
 * alguien pregunte "¿por qué no sale mi fila?".
 */
function avisar(pestana: string, detalle: string) {
  console.warn(`[sponsors] ${pestana}: ${detalle}`)
}

/**
 * Aplica el filtro de `mostrable`, valida cada fila con su esquema y ordena el resultado.
 *
 * Está factorizado porque las seis pestañas hacen exactamente esto, y repetirlo seis
 * veces garantizaba que una se quedara sin el filtro de `mostrable` — que es el fallo que
 * publica contenido a medio escribir.
 */
function filasValidas<T extends { orden: number }>(
  nombre: string,
  pestana: Pestana,
  esquema: z.ZodType<unknown>,
  aDominio: (fila: Fila, orden: number) => T,
): T[] {
  const resultado: T[] = []

  pestana.filas.forEach((fila, posicion) => {
    if (!esMostrable(fila)) return

    const revision = esquema.safeParse(fila)
    if (!revision.success) {
      const campos = revision.error.issues.map((problema) => problema.path.join('.')).join(', ')
      // El número que se imprime es el de la hoja, no el del array: quien lo lee va a ir
      // a Google Sheets y a buscar esa fila con el dedo.
      const enLaHoja = pestana.cabeceraEnFila + 1 + posicion
      avisar(nombre, `fila ${enLaHoja} descartada, faltan datos en: ${campos || 'la fila'}`)
      return
    }

    resultado.push(aDominio(fila, aOrden(fila, posicion)))
  })

  return porOrden(resultado)
}

/**
 * Resuelve el valor de una columna de imagen a algo que se pueda poner en un `src`.
 *
 * La hoja admite dos formatos:
 *
 *  · una URL absoluta — incluidos los enlaces de Google Drive, que se traducen a su
 *    versión servible (ver lib/sheets/imagenes.ts: el enlace de "Compartir" es una
 *    página HTML, no la imagen);
 *  · el nombre de un archivo del repo, que se resuelve contra `public/`.
 *
 * Del nombre de archivo se toma SOLO la última parte: si alguien escribe `../../.env` en
 * la celda, queda en `.env` y se resuelve dentro de la carpeta de logos, que no lleva a
 * ninguna parte. Es texto que edita gente distinta a la que despliega.
 */
function resolverImagen(valor: string | null, carpeta: string): string | null {
  if (!valor) return null
  if (/^https?:\/\//i.test(valor)) return urlDeImagen(valor)

  const archivo = valor.split(/[\\/]/).pop()?.trim()
  return archivo ? `${carpeta}/${archivo}` : null
}

// ═════════════════════════════════════════════════════════════════════════════════════
// Esquemas. Solo declaran lo IMPRESCINDIBLE para que la fila tenga sentido.
// Todo lo demás es opcional, porque una hoja incompleta es lo normal, no la excepción.
// ═════════════════════════════════════════════════════════════════════════════════════

const obligatorio = z.string().min(1)

const esquemaActivo = z.object({ id: obligatorio, titulo: obligatorio })
const esquemaNivel = z.object({ id: obligatorio, nombre: obligatorio })
const esquemaBeneficio = z.object({ nivel_id: obligatorio, beneficio: obligatorio })
const esquemaAliado = z.object({ nombre: obligatorio })
const esquemaMetrica = z.object({ valor: obligatorio, etiqueta: obligatorio })
const esquemaTestimonio = z.object({ autor: obligatorio, texto: obligatorio })

// ═════════════════════════════════════════════════════════════════════════════════════
// Pestaña → dominio
// ═════════════════════════════════════════════════════════════════════════════════════

/**
 * Pestaña `Textos`: pares clave–valor.
 *
 * Una fila `mostrable` gana SIEMPRE, incluso con el valor en blanco: así el equipo puede
 * vaciar un texto a propósito (por ejemplo, quitar la nota sobre el aporte) sin que el
 * contenido de reserva del repo se lo vuelva a poner. Para volver al texto del repo se
 * pone `mostrable` en NO, o se borra la fila.
 */
export function textosDesdeFilas(pestana: Pestana): Textos {
  const textos: Textos = {}

  for (const fila of pestana.filas) {
    if (!esMostrable(fila)) continue

    const clave = fila.clave
    if (!clave) continue

    textos[clave] = fila.valor ?? ''
  }

  return textos
}

export function activosDesdeFilas(pestana: Pestana): Activo[] {
  return filasValidas('Activos', pestana, esquemaActivo, (fila, orden) => {
    const icono = fila.icono as IconoActivo

    // Una clave de icono desconocida NO descarta la fila: se pinta sin icono. Perder un
    // activo entero por una palabra mal escrita sería desproporcionado.
    if (fila.icono && !ICONOS.includes(icono)) {
      avisar('Activos', `icono desconocido "${fila.icono}" en "${fila.id}", se omite el icono`)
    }

    return {
      id: fila.id,
      titulo: fila.titulo,
      descripcion: fila.descripcion ?? '',
      icono: ICONOS.includes(icono) ? icono : null,
      orden,
    }
  })
}

/**
 * Pestañas `Niveles` + `Beneficios`, que se unen por `nivel_id`.
 *
 * Dos decisiones que el spec pide explícitamente:
 *
 *  · un beneficio cuyo `nivel_id` no exista se descarta con aviso — **no** se inventa un
 *    nivel fantasma, porque aparecería en la página un nivel que nadie definió;
 *  · un nivel sin beneficios se muestra igual, con su resumen. Es el estado normal
 *    mientras se define la oferta.
 */
export function nivelesDesdeFilas(pestanaNiveles: Pestana, pestanaBeneficios: Pestana): Nivel[] {
  const niveles = filasValidas('Niveles', pestanaNiveles, esquemaNivel, (fila, orden) => ({
    id: fila.id,
    nombre: fila.nombre,
    resumen: fila.resumen ?? '',
    aporteTexto: oNulo(fila.aporte_texto),
    destacado: esDestacado(fila),
    orden,
    beneficios: [] as Beneficio[],
  }))

  const porId = new Map(niveles.map((nivel) => [nivel.id, nivel]))

  filasValidas('Beneficios', pestanaBeneficios, esquemaBeneficio, (fila, orden) => ({
    nivelId: fila.nivel_id,
    beneficio: fila.beneficio,
    detalle: oNulo(fila.detalle),
    orden,
  })).forEach((fila) => {
    const nivel = porId.get(fila.nivelId)
    if (!nivel) {
      avisar('Beneficios', `"${fila.beneficio}" apunta al nivel "${fila.nivelId}", que no existe`)
      return
    }

    nivel.beneficios.push({ beneficio: fila.beneficio, detalle: fila.detalle, orden: fila.orden })
  })

  for (const nivel of niveles) nivel.beneficios = porOrden(nivel.beneficios)

  return soloUnDestacado(niveles)
}

/** Reutiliza el mismo criterio permisivo de `mostrable` para la columna `destacado`. */
function esDestacado(fila: Fila): boolean {
  return esMostrable({ mostrable: fila.destacado ?? '' })
}

/**
 * Como máximo un nivel destacado. Si la hoja marca varios se respeta el primero por
 * `orden` y se avisa: dos tarjetas resaltadas no resaltan ninguna.
 */
function soloUnDestacado(niveles: Nivel[]): Nivel[] {
  let yaHay = false

  return niveles.map((nivel) => {
    if (!nivel.destacado) return nivel

    if (yaHay) {
      avisar('Niveles', `"${nivel.id}" también estaba destacado; solo se resalta el primero`)
      return { ...nivel, destacado: false }
    }

    yaHay = true
    return nivel
  })
}

export function aliadosDesdeFilas(pestana: Pestana): Aliado[] {
  return filasValidas('Aliados', pestana, esquemaAliado, (fila, orden) => ({
    nombre: fila.nombre,
    logo: resolverImagen(oNulo(fila.logo), CARPETA_LOGOS),
    url: enlaceExterno(fila.url),
    edicion: oNulo(fila.edicion),
    orden,
  }))
}

export function metricasDesdeFilas(pestana: Pestana): Metrica[] {
  return filasValidas('Metricas', pestana, esquemaMetrica, (fila, orden) => ({
    valor: fila.valor,
    etiqueta: fila.etiqueta,
    nota: oNulo(fila.nota),
    orden,
  }))
}

export function testimoniosDesdeFilas(pestana: Pestana): Testimonio[] {
  return filasValidas('Testimonios', pestana, esquemaTestimonio, (fila, orden) => ({
    autor: fila.autor,
    rol: oNulo(fila.rol),
    texto: fila.texto,
    url: enlaceExterno(fila.url),
    foto: resolverImagen(oNulo(fila.foto), CARPETA_FOTOS),
    orden,
  }))
}

/**
 * Solo se admiten enlaces `http(s)`. Cualquiera con permiso de edición en la hoja podría
 * escribir `javascript:...` en una celda de URL, y eso acabaría dentro de un `href`.
 */
function enlaceExterno(valor: string | undefined): string | null {
  const limpio = oNulo(valor)
  if (!limpio) return null

  if (!/^https?:\/\//i.test(limpio)) {
    avisar('Aliados/Testimonios', `enlace ignorado por no ser http(s): "${limpio}"`)
    return null
  }

  return limpio
}
