import type { MetadataRoute } from 'next'

import { urlDelSitio } from '@/lib/site-url'

/**
 * Genera `/sitemap.xml`: la lista de páginas que los buscadores deben conocer.
 *
 * Es una convención de Next: por existir este archivo, la ruta aparece sola.
 *
 * El dominio NO está escrito acá. Sale de `lib/site-url.ts`, que es el único sitio donde
 * se decide cuál es la URL del sitio — así el sitemap es correcto tanto en Vercel como en
 * la MV, sin tocar nada.
 *
 * ── Al agregar una página ──────────────────────────────────────────────────────────────
 * Se añade una entrada más a este array, como la de `/sponsors` de abajo.
 *
 * Si una página NO debe salir en buscadores, no se agrega acá y además se la excluye en
 * `app/robots.ts`. Las dos cosas: el sitemap invita, robots prohíbe.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: urlDelSitio,
      // Se evalúa al compilar, así que refleja la fecha del último despliegue. Es lo que
      // se quiere: un sitemap que dice "cambié" cada vez que de verdad se publicó algo.
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${urlDelSitio}/sponsors`,
      lastModified: new Date(),
      // Cambia más seguido que la portada: su contenido se edita desde Google Sheets sin
      // desplegar, así que `lastModified` (que es la fecha del build) se queda corto.
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]
}
