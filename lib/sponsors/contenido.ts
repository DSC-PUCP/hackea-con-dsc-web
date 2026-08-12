/**
 * Lo único que la página necesita saber: `obtenerContenidoSponsors()`.
 *
 * Acá viven las dos decisiones que no deben repetirse en ningún otro sitio: cuánto dura
 * la caché, y quién gana cuando la hoja y el repo dicen cosas distintas.
 *
 * ── La caché ─────────────────────────────────────────────────────────────────────────
 * Una hora, como pidió el equipo. La propiedad que importa no es el número sino el
 * comportamiento: si la copia está vencida, Next sirve la vieja al instante y regenera
 * por detrás. **Nadie espera nunca a Google**, y si Google falla la web sigue en pie con
 * los últimos datos buenos.
 *
 * Para no esperar la hora hay `POST /api/revalidate?secret=...&tag=sponsors`.
 */

import { unstable_cache } from 'next/cache'

import { hayCredencialesDeGoogle } from '../sheets/cliente.ts'

import { contenidoDeReserva } from './fallback.ts'
import { leerSponsorsDesdeSheets } from './sheets.ts'
import type { ContenidoSponsors } from './types.ts'

/**
 * La etiqueta de caché de esta página. Se exporta para que `/api/revalidate` la use en
 * su lista blanca en vez de repetir la cadena: dos cadenas iguales escritas en dos sitios
 * distintas son dos cadenas que algún día no van a ser iguales.
 */
export const ETIQUETA_SPONSORS = 'sponsors'

const leerConCache = unstable_cache(leerSponsorsDesdeSheets, ['sponsors'], {
  revalidate: 3600,
  tags: [ETIQUETA_SPONSORS],
})

/**
 * El contenido de la página, venga de donde venga.
 *
 * Quién gana:
 *
 *  · **Sin credenciales** → contenido de reserva, y ni un error ni un aviso en consola.
 *    Es el estado normal en desarrollo local, no una excepción. Por eso se comprueba
 *    antes de entrar en la caché: sin esto, cada arranque en local intentaría hablar con
 *    Google, fallar y cachear el fallo.
 *  · **Con credenciales pero la hoja falla** → contenido de reserva, con el motivo en el
 *    log del servidor.
 *  · **La hoja responde** → gana la hoja, salvo en los textos, donde se mezcla clave por
 *    clave. Así una clave que el equipo todavía no escribió sale con el texto del repo en
 *    vez de salir en blanco.
 *
 * Las listas (activos, niveles, aliados…) NO se mezclan: si la hoja responde y una
 * pestaña está vacía, la sección desaparece. Es el interruptor editorial funcionando, no
 * un fallo que haya que tapar con el respaldo.
 */
export async function obtenerContenidoSponsors(): Promise<ContenidoSponsors> {
  if (!hayCredencialesDeGoogle()) return contenidoDeReserva

  const remoto = await leerConCache()
  if (!remoto) return contenidoDeReserva

  return {
    ...remoto,
    textos: { ...contenidoDeReserva.textos, ...remoto.textos },
  }
}
