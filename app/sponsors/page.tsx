import type { Metadata } from 'next'

import { Activos } from '@/components/sponsors/activos'
import { Aliados } from '@/components/sponsors/aliados'
import { LetraChica, LlamadoFinal } from '@/components/sponsors/cierre'
import { Galeria } from '@/components/sponsors/galeria'
import { HeroSponsors } from '@/components/sponsors/hero'
import { Intro } from '@/components/sponsors/intro'
import { Metricas } from '@/components/sponsors/metricas'
import { Niveles } from '@/components/sponsors/niveles'
import { Testimonios } from '@/components/sponsors/testimonios'
import { seoSponsors, site } from '@/lib/site-config'
import { urlDelSitio } from '@/lib/site-url'
import { obtenerContenidoSponsors } from '@/lib/sponsors/contenido'

/**
 * Metadatos ESTÁTICOS, no `generateMetadata` leyendo la hoja.
 *
 * WhatsApp y LinkedIn cachean la vista previa de un enlace de forma agresiva y por
 * mucho tiempo. Si el título o la imagen cambiaran con la hoja, habría previsualizaciones
 * desincronizadas circulando por ahí e imposibles de depurar. Lo que se comparte tiene
 * que ser estable aunque el contenido de la página evolucione.
 *
 * Si algún día hay que corregir la imagen, lo fiable es renombrar el archivo
 * (`og-sponsors-2.jpg`): es la única forma segura de romper esos cachés.
 *
 * El dominio no está escrito a mano. Sale de `urlDelSitio`, así que el canonical sigue
 * siendo correcto el día que el sitio se mude al subdirectorio de la universidad.
 */
export const metadata: Metadata = {
  title: seoSponsors.title,
  description: seoSponsors.description,
  alternates: {
    canonical: `${urlDelSitio}/sponsors`,
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: `${urlDelSitio}/sponsors`,
    siteName: site.name,
    title: seoSponsors.title,
    description: seoSponsors.description,
    images: [{ url: '/og-sponsors.jpg', width: 1200, height: 630, alt: seoSponsors.ogAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: seoSponsors.title,
    description: seoSponsors.description,
    images: ['/og-sponsors.jpg'],
  },
}

/**
 * Página de patrocinio.
 *
 * Es solo su `<main>`: el header, el pie, el parallax y la aparición al hacer scroll
 * viven en `app/layout.tsx` y se heredan. Montarlos otra vez acá los duplicaría.
 *
 * El orden de las secciones es deliberado — **prueba antes que oferta**: primero los
 * números y las fotos de lo que ya pasó, después qué es el programa, y recién entonces
 * qué ofrecemos y en qué niveles.
 *
 * Cada sección decide sola si se pinta. Sin datos no deja título huérfano ni hueco: al
 * principio las métricas, la galería, los aliados y los testimonios van a estar vacíos,
 * y la página tiene que verse terminada igual.
 */
export default async function PaginaSponsors() {
  const contenido = await obtenerContenidoSponsors()

  return (
    <main>
      <HeroSponsors
        textos={contenido.textos}
        hayNiveles={contenido.niveles.length > 0}
        hayActivos={contenido.activos.length > 0}
      />
      <Metricas metricas={contenido.metricas} />
      <Galeria />
      <Intro textos={contenido.textos} />
      <Activos activos={contenido.activos} textos={contenido.textos} />
      <Niveles niveles={contenido.niveles} textos={contenido.textos} />
      <Aliados aliados={contenido.aliados} textos={contenido.textos} />
      <Testimonios testimonios={contenido.testimonios} textos={contenido.textos} />
      <LlamadoFinal textos={contenido.textos} />
      <LetraChica textos={contenido.textos} />
    </main>
  )
}
