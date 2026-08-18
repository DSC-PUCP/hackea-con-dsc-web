/**
 * Lo único que la portada necesita saber: `obtenerEventosProximos()`.
 *
 * Acá viven las decisiones que no deben repetirse en ningún otro sitio: cuánto dura la
 * caché, qué pasa cuando Google falla, y qué se considera «próximo».
 *
 * ── La caché ─────────────────────────────────────────────────────────────────────────
 * Una hora, igual que patrocinio. Lo que importa no es el número sino el comportamiento:
 * si la copia está vencida, Next sirve la vieja al instante y regenera por detrás. **Nadie
 * espera nunca a Google.**
 *
 * Para no esperar la hora hay `POST /api/revalidate?secret=...&tag=eventos`. Ese enlace
 * es el que se le pasa al equipo cuando pregunte por qué su cambio en la hoja todavía no
 * se ve.
 *
 * ── Por qué NO hay contenido de reserva ──────────────────────────────────────────────
 * `/sponsors` tiene `lib/sponsors/fallback.ts` con una copia del contenido en el repo,
 * porque una página de patrocinio vacía no sirve de nada y sus textos casi no cambian.
 *
 * Una agenda es lo contrario: son fechas, y una fecha vieja es peor que ninguna fecha.
 * Un respaldo en el repo anunciaría talleres que ya pasaron o que se movieron, y quien lo
 * lea se va a presentar el día equivocado. Así que si la hoja no se puede leer, la sección
 * no se pinta y la portada se queda con `Hero` y `QueEs`. Es una degradación honesta:
 * mejor no decir nada que decir algo que quizá ya no sea cierto.
 *
 * En la práctica casi nunca se llega a eso: `unstable_cache` sigue sirviendo la última
 * copia buena mientras Google esté caído. El caso sin nada es un arranque en frío con la
 * API de Google fuera de servicio a la vez.
 */

import { unstable_cache } from 'next/cache'

import { hayCredencialesDeGoogle } from '../sheets/cliente.ts'

import { hoyEnLima, yaPaso } from './fechas.ts'
import { leerEventosDesdeSheets } from './sheets.ts'
import type { Evento } from './types.ts'

/**
 * La etiqueta de caché de la agenda. Se exporta para que `/api/revalidate` la use en su
 * lista blanca en vez de repetir la cadena: dos cadenas iguales escritas en dos sitios
 * distintos son dos cadenas que algún día no van a ser iguales.
 */
export const ETIQUETA_EVENTOS = 'eventos'

const leerConCache = unstable_cache(leerEventosDesdeSheets, ['eventos'], {
  revalidate: 3600,
  tags: [ETIQUETA_EVENTOS],
})

/** La agenda partida en dos, que es como la pinta la página. */
export type Agenda = {
  /** Lo que viene, de lo más próximo a lo más lejano. Los sin fecha, al final. */
  proximos: Evento[]
  /** Lo que ya ocurrió, **del más reciente al más antiguo**. Ver abajo. */
  pasados: Evento[]
}

/**
 * La agenda completa, partida entre lo que viene y lo que ya pasó.
 *
 * ── Por qué el corte está acá y no dentro de la caché ────────────────────────────────
 * Porque depende de qué día es hoy. Metido en `leerEventosDesdeSheets`, la respuesta
 * quedaría congelada dentro de la copia cacheada y un evento seguiría anunciándose hasta
 * una hora después de haber terminado — o peor, si la copia se regeneró de madrugada,
 * hasta el día siguiente. Partir en cada llamada cuesta un recorrido de doce elementos.
 *
 * ── Por qué los pasados van al revés ─────────────────────────────────────────────────
 * Porque se leen con otra intención. Los próximos se leen para decidir a cuál ir, así que
 * mandan los más cercanos primero. Los pasados se leen para ver qué hace este programa, y
 * ahí lo más reciente es lo más representativo — nadie quiere empezar por el taller de
 * hace tres meses.
 *
 * Lo que NUNCA cae en pasados: los eventos sin fecha. Un taller que existe pero al que
 * todavía no se le puso día sigue siendo algo que viene. Ver `yaPaso` en `./fechas.ts`.
 */
export async function obtenerAgenda(): Promise<Agenda> {
  // Sin credenciales no se intenta nada, ni se registra nada. Es el estado normal en
  // desarrollo local, no una excepción. Sin esta comprobación, cada arranque en local
  // intentaría hablar con Google, fallaría, y cachearía el fallo durante una hora.
  if (!hayCredencialesDeGoogle()) return { proximos: [], pasados: [] }

  const contenido = await leerConCache()
  if (!contenido) return { proximos: [], pasados: [] }

  const hoy = hoyEnLima()
  const proximos: Evento[] = []
  const pasados: Evento[] = []

  for (const evento of contenido.eventos) {
    if (yaPaso(evento.cuando, hoy)) pasados.push(evento)
    else proximos.push(evento)
  }

  return { proximos, pasados: pasados.reverse() }
}
