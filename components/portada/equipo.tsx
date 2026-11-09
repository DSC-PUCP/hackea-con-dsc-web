import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { copy, organizacion } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'

export function AccesoOrganizacion() {
  const texto = copy.organizacion.portada
  const foto = organizacion.foto

  return (
    <section aria-labelledby="portada-equipo" className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-20 md:grid-cols-2 md:gap-14 md:px-6 md:py-24">
      <div data-reveal>
        <p className="etiqueta-sticker sticker-claro mb-5 font-subtitle text-xs font-bold uppercase">{texto.etiqueta}</p>
        <h2 id="portada-equipo" className="font-display text-4xl leading-tight font-extrabold tracking-tight text-balance md:text-5xl">{texto.titulo}</h2>
        <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">{texto.descripcion}</p>
        <Link href={organizacion.ruta} className="btn-sombra mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-subtitle font-semibold">
          {texto.boton}<ArrowUpRight className="size-4" aria-hidden />
        </Link>
      </div>
      <figure data-reveal>
        <Image src={assetPublico(foto.src)} alt={foto.alt} width={foto.width} height={foto.height}
          sizes="(min-width: 1152px) 520px, (min-width: 768px) 45vw, 100vw"
          className="w-full rounded-2xl" />
        <figcaption className="mt-3 text-xs leading-relaxed text-muted-foreground">{copy.organizacion.fotoPie}</figcaption>
      </figure>
    </section>
  )
}
