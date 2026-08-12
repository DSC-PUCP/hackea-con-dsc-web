import type { MetadataRoute } from 'next'

import { urlDelSitio } from '@/lib/site-url'

/**
 * Genera `/robots.txt`: le dice a los buscadores qué pueden recorrer.
 *
 * Es una convención de Next, igual que `sitemap.ts`.
 *
 * Hoy todo el sitio es público e indexable a propósito: es una web de difusión, y que
 * Google la encuentre es parte del objetivo.
 *
 * ── Para dejar una página FUERA de los buscadores ──────────────────────────────────────
 * Se agrega su ruta a `disallow` y NO se la incluye en `app/sitemap.ts`.
 *
 * Aviso importante: esto no la esconde. `robots.txt` es una petición que los buscadores
 * respetan, pero el archivo es público y cualquiera puede leerlo — de hecho, listar ahí
 * una ruta "privada" es una forma clásica de anunciarla. Si algo no debe verse, no basta
 * con robots: no se publica.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Los endpoints internos no aportan nada a un buscador y solo gastan rastreo.
        disallow: ['/api/'],
      },
    ],
    sitemap: `${urlDelSitio}/sitemap.xml`,
    // Sin `host`: es una extensión no estándar (de Yandex) que además espera un nombre de
    // dominio pelado, y `urlDelSitio` puede traer una ruta. Aportaba nada y salía mal
    // formada.
  }
}
