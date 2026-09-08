/**
 * El botón de "compartir por WhatsApp" de cada fila de `/agenda`.
 *
 * No hay ruta ni imagen de Open Graph por evento — ver la cabecera de
 * `components/eventos/agenda.tsx` para el porqué. El enlace que se comparte siempre
 * resuelve a `/agenda#evento-<id>`: si el evento sigue publicado, el navegador hace scroll
 * nativo hasta su fila; si ya no existe, cae a `/agenda` tal cual. Cero riesgo de una
 * vista previa cacheada por WhatsApp que quede diciendo una fecha vieja.
 */

import { formatearCuando } from './fechas.ts'
import type { Evento, TipoEvento } from './types.ts'
import { urlDelSitio } from '../site-url.ts'

/**
 * Un cuadrado de color por tipo de evento, paralelo a `COLOR_POR_TIPO` en
 * `components/eventos/agenda.tsx`. Es texto plano —no hay CSS en un mensaje de
 * WhatsApp—, así que el color se sugiere con un emoji. Si algún día cambia el color de un
 * tipo ahí, este mapa se desincroniza y hay que tocar los dos.
 */
const EMOJI_POR_TIPO: Record<TipoEvento, string> = {
  taller: '🟦',
  ponencia: '🟪',
  hackathon: '🟥',
  networking: '🟩',
  otro: '⬜',
}

/** Cuánto se deja de la descripción antes de recortar. Dos líneas largas de WhatsApp. */
const LARGO_DESCRIPCION = 180

/**
 * Recorta por espacio, nunca a mitad de palabra, y colapsa saltos de línea a uno solo:
 * la descripción de la hoja puede traer varios párrafos, y dentro de un mensaje de
 * WhatsApp eso se lee como texto cortado, no como párrafos.
 */
function recortar(texto: string, limite: number): string {
  const limpio = texto.trim().replace(/\s+/g, ' ')
  if (limpio.length <= limite) return limpio

  const corte = limpio.slice(0, limite)
  const ultimoEspacio = corte.lastIndexOf(' ')
  return `${corte.slice(0, ultimoEspacio > 0 ? ultimoEspacio : limite)}…`
}

/**
 * El enlace estable de un evento dentro de `/agenda`. Es SIEMPRE la misma página —nunca
 * una ruta propia—, así que la vista previa de WhatsApp es la del sitio entero, que no
 * cambia con la agenda y no se puede quedar diciendo una fecha vieja.
 */
export function enlaceDeAgenda(evento: Evento): string {
  return `${urlDelSitio}/agenda#evento-${evento.id}`
}

/**
 * El mensaje precargado. El enlace de `/agenda` va ANTES que el de inscripción a
 * propósito: si se pega el mensaje tal cual, WhatsApp genera la vista previa del primer
 * enlace que encuentra, y interesa que sea la ficha del sitio y no la de Luma.
 */
export function mensajeWhatsAppDeEvento(evento: Evento, sinFecha: string): string {
  const encabezado = [EMOJI_POR_TIPO[evento.tipo], evento.tipoEtiqueta].filter(Boolean).join(' ')
  const fecha = formatearCuando(evento.cuando, sinFecha)

  const lineas = [[encabezado, fecha].filter(Boolean).join(' — '), evento.nombre]

  if (evento.descripcion) lineas.push('', recortar(evento.descripcion, LARGO_DESCRIPCION))

  lineas.push('', `Más información: ${enlaceDeAgenda(evento)}`)
  if (evento.inscripcion) lineas.push(`Inscríbete: ${evento.inscripcion}`)

  return lineas.join('\n')
}

/**
 * Sin número de teléfono: es "compartir con quien sea", no un contacto fijo. WhatsApp abre
 * su propio selector de a quién mandárselo. Distinto del CTA de `/sponsors`, que sí apunta
 * a un número del equipo.
 */
export function enlaceWhatsAppDeEvento(evento: Evento, sinFecha: string): string {
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(mensajeWhatsAppDeEvento(evento, sinFecha))}`
}
