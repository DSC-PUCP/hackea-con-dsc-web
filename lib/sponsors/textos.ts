/**
 * Utilidades para consumir los textos de la hoja desde la interfaz.
 *
 * Existen para que los componentes no tengan que saber nada de la forma de los datos:
 * piden una clave y reciben algo seguro de pintar, o una cadena vacía. Una cadena vacía
 * es la señal de "esta pieza no se muestra" — así los estados vacíos salen solos, sin
 * condicionales repetidos por toda la página.
 */

import type { Textos } from './types'

/**
 * Lee una clave de `Textos`. Devuelve '' si no existe o si viene en blanco.
 *
 * El respaldo clave por clave NO se hace acá sino al construir el contenido
 * (`lib/sponsors/contenido.ts`), para que exista un solo sitio donde se decide qué gana:
 * la hoja o el repo.
 */
export function texto(textos: Textos, clave: string): string {
  return textos[clave]?.trim() ?? ''
}

/**
 * Parte un texto en párrafos: dos saltos de línea seguidos abren uno nuevo.
 *
 * Es todo el "formato" que se admite. No hay Markdown ni HTML a propósito: la hoja la
 * edita gente con permiso de edición, y `dangerouslySetInnerHTML` con contenido ajeno es
 * exactamente cómo se cuela un script en una web.
 */
export function parrafos(valor: string): string[] {
  return valor
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean)
}

/**
 * Deja pasar solo enlaces `http(s)` y `mailto:`.
 *
 * Sin este filtro, cualquiera con permiso de edición en la hoja podría escribir
 * `javascript:...` en la columna `url` y convertir un logo en un ataque. Es barato y
 * cierra la puerta entera.
 */
export function enlaceSeguro(valor: string | null | undefined): string | null {
  const limpio = valor?.trim()
  if (!limpio) return null
  return /^(https?:\/\/|mailto:)/i.test(limpio) ? limpio : null
}

/**
 * A dónde apunta el botón de la llamada a la acción.
 *
 * Primero el formulario (`cta.url`); si no está, el correo de contacto como `mailto:`.
 * Si no hay ninguno de los dos devuelve `null` y el botón no se pinta: es preferible una
 * página sin botón que un botón que no lleva a ningún lado.
 */
export function destinoDelCta(textos: Textos): string | null {
  const formulario = enlaceSeguro(texto(textos, 'cta.url'))
  if (formulario) return formulario

  const correo = texto(textos, 'contacto.email')
  return correo ? `mailto:${correo}` : null
}
