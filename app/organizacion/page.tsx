import { MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

import { Chevron } from '@/components/brand/icons'
import { Equipo } from '@/components/organizacion/equipo'
import { obtenerEquipoOrganizador } from '@/lib/eventos/contenido'
import { copy, links, organizacion, seoOrganizacion, site } from '@/lib/site-config'
import { assetPublico, urlDelSitio } from '@/lib/site-url'

export const metadata: Metadata = {
  title: seoOrganizacion.title,
  description: seoOrganizacion.description,
  alternates: { canonical: `${urlDelSitio}${organizacion.ruta}` },
  openGraph: {
    type: 'website', locale: 'es_PE', siteName: site.name,
    url: `${urlDelSitio}${organizacion.ruta}`,
    title: seoOrganizacion.title, description: seoOrganizacion.description,
    images: [{ url: seoOrganizacion.ogImagen, width: 1200, height: 630, alt: seoOrganizacion.ogAlt }],
  },
  twitter: {
    card: 'summary_large_image', title: seoOrganizacion.title,
    description: seoOrganizacion.description, images: [seoOrganizacion.ogImagen],
  },
}

export default async function Page() {
  const personas = await obtenerEquipoOrganizador()
  const texto = copy.organizacion
  const foto = organizacion.foto

  return (
    <main>
      <section className="relative isolate overflow-hidden border-b border-border pt-32 pb-12 md:pt-40 md:pb-16">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-brand-grid bg-brand-noise">
          <div className="glow-purple absolute -top-24 -right-40 size-[44rem] opacity-50" />
          <Chevron dir="left" className="absolute top-20 -left-16 h-96 w-auto text-brand-red/10" />
        </div>
        <div className="enter mx-auto grid max-w-6xl items-center gap-10 px-5 md:grid-cols-2 md:px-6">
          <div>
            <p className="mb-5 font-subtitle text-xs font-semibold tracking-[0.16em] text-brand-green uppercase">{texto.eyebrow}</p>
            <h1 className="font-poster text-[clamp(2rem,4.4vw,3.7rem)] leading-[1.14] font-black tracking-tight text-balance uppercase">{texto.titulo}</h1>
            <p className="mt-6 max-w-lg leading-relaxed text-muted-foreground">{texto.intro}</p>
          </div>
          <figure>
            <Image src={assetPublico(foto.src)} alt={foto.alt} width={foto.width} height={foto.height}
              priority sizes="(min-width: 1152px) 532px, (min-width: 768px) 45vw, 100vw"
              className="w-full rounded-2xl" />
            <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">{texto.fotoPie}</figcaption>
          </figure>
        </div>
      </section>
      {personas.length > 0 ? <Equipo personas={personas} /> : (
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-6 md:py-24">
          <p className="max-w-xl leading-relaxed text-muted-foreground">{texto.vacio}</p>
          <a href={links.whatsapp} target="_blank" rel="noopener noreferrer"
            className="btn-sombra mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 font-subtitle font-semibold">
            <MessageCircle className="size-4" aria-hidden />{copy.cta.boton}
          </a>
        </div>
      )}
    </main>
  )
}
