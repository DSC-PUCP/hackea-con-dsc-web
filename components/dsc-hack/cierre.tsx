import { ArrowUpRight, MessageCircle } from 'lucide-react'
import Image from 'next/image'

import { copy, links } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'

export function AliadoDscHack() {
  return (
    <section aria-labelledby="aliado-titulo" className="mx-auto grid max-w-6xl items-center gap-8 border-t border-border px-5 py-14 md:grid-cols-[0.8fr_1.2fr] md:gap-16 md:px-6 md:py-20">
      <div>
        <p className="font-subtitle text-xs font-medium leading-relaxed text-muted-foreground">
          {copy.dscHack.aliadoEtiqueta}
        </p>
        <p className="mt-3 font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
          {copy.dscHack.aliadoNombre}
        </p>
      </div>
      <div>
        <h2 id="aliado-titulo" className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
          {copy.dscHack.aliadoTitulo}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {copy.dscHack.aliadoDescripcion}
        </p>
        <a
          href={links.anuncioNttData}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex min-h-11 items-center gap-2 font-subtitle text-sm font-semibold hover:text-brand-green"
        >
          {copy.dscHack.aliadoEnlace}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </section>
  )
}

export function CierreDscHack() {
  return (
    <section className="bloque-morado relative overflow-hidden">
      <div className="relative mx-auto grid max-w-6xl gap-8 px-5 pt-12 md:grid-cols-[1.4fr_0.6fr] md:items-end md:px-6 md:pt-16">
        <div className="pb-10 md:pb-16">
          <h2 className="max-w-2xl font-display text-3xl font-extrabold tracking-tight sm:text-5xl">
            {copy.dscHack.cierreTitulo}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-brand-light/85">
            {copy.dscHack.cierreIntro}
          </p>
          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-tinta mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3 font-subtitle text-sm font-semibold"
          >
            <MessageCircle className="size-4" aria-hidden />
            {copy.dscHack.cierreCta}
          </a>
        </div>
        <Image
          src={assetPublico('/brand/bugle-senalando.webp')}
          alt={copy.dscHack.bugleAlt}
          width={1100}
          height={1282}
          sizes="(min-width: 768px) 300px, 200px"
          className="mx-auto -mt-12 -mb-5 w-44 md:mt-0 md:w-full"
        />
      </div>
    </section>
  )
}
