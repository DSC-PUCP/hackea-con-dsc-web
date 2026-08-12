/**
 * Fuerza el refresco de un contenido cacheado sin esperar a que venza.
 *
 *   POST /api/revalidate?secret=<REVALIDATE_SECRET>&tag=sponsors
 *   GET  /api/revalidate?secret=<REVALIDATE_SECRET>&tag=sponsors
 *
 * ── Por qué también por GET ──────────────────────────────────────────────────────────
 * Porque la persona que edita la hoja no usa `curl`. Cuando no vea su cambio reflejado
 * va a querer abrir un enlace en el navegador, y un navegador solo hace GET. La
 * operación es idempotente (marca una etiqueta como vencida, nada más) y sigue exigiendo
 * el secreto, así que abrirla por GET no añade riesgo. Sin esta puerta, la única vía
 * sería pedirle ayuda a alguien del equipo técnico cada vez.
 *
 * ── La lista blanca ──────────────────────────────────────────────────────────────────
 * `tag` no se pasa directo a `revalidateTag`. Solo se aceptan las etiquetas que este
 * proyecto usa de verdad; cualquier otra cosa devuelve 400. Sin la lista, el parámetro
 * sería una entrada arbitraria a la caché interna de Next.
 *
 * La ruta es compartida con la futura Fase 2 de eventos: cuando esa lectura exista, ya
 * está su etiqueta contemplada acá y no hay que crear una segunda ruta.
 */

import { revalidateTag } from 'next/cache'

import { ETIQUETA_SPONSORS } from '@/lib/sponsors/contenido'

/** Etiqueta por defecto: mantiene el comportamiento que se diseñó primero para eventos. */
const ETIQUETA_EVENTOS = 'eventos'

const ETIQUETAS_PERMITIDAS: readonly string[] = [ETIQUETA_EVENTOS, ETIQUETA_SPONSORS]

/** Nunca se cachea: cachear la respuesta de "vacía la caché" sería absurdo. */
export const dynamic = 'force-dynamic'

async function revalidar(peticion: Request) {
  const parametros = new URL(peticion.url).searchParams
  const secretoEsperado = process.env.REVALIDATE_SECRET?.trim()

  // Sin secreto configurado en el servidor no hay nada contra qué comparar, y dejar
  // pasar a todo el mundo sería peor que no tener la ruta. 503 y no 401: el problema es
  // del despliegue, no de quien llama.
  if (!secretoEsperado) {
    return Response.json(
      { ok: false, error: 'REVALIDATE_SECRET no está configurado en el servidor' },
      { status: 503 },
    )
  }

  if (parametros.get('secret') !== secretoEsperado) {
    return Response.json({ ok: false, error: 'Secreto inválido' }, { status: 401 })
  }

  const etiqueta = parametros.get('tag')?.trim() || ETIQUETA_EVENTOS

  if (!ETIQUETAS_PERMITIDAS.includes(etiqueta)) {
    return Response.json(
      {
        ok: false,
        error: `Etiqueta no permitida: "${etiqueta}"`,
        permitidas: ETIQUETAS_PERMITIDAS,
      },
      { status: 400 },
    )
  }

  /*
   * El segundo argumento es obligatorio desde Next 16. `'max'` significa "marca la
   * etiqueta como vencida, pero sigue sirviendo la copia guardada mientras se regenera":
   * exactamente la propiedad que hace que nadie espere nunca a Google.
   *
   * La alternativa de vencimiento inmediato es `updateTag`, y no sirve acá: solo se puede
   * llamar desde una Server Action, no desde un route handler.
   */
  revalidateTag(etiqueta, 'max')

  return Response.json({
    ok: true,
    etiqueta,
    // Sirve para saber, desde el navegador, si el clic llegó de verdad. La página se
    // regenera en la siguiente visita, así que sin esto no hay ninguna señal.
    revalidadoEn: new Date().toISOString(),
  })
}

export async function POST(peticion: Request) {
  return revalidar(peticion)
}

export async function GET(peticion: Request) {
  return revalidar(peticion)
}
