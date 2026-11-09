import { ArrowDown, ArrowUpRight } from 'lucide-react'

import { Chevron } from '@/components/brand/icons'
import { Medio } from '@/components/dsc-hack/medio'
import { copy, recapDscHack } from '@/lib/site-config'

export function HeroDscHack() {
  return (
    <section id="top" className="relative isolate overflow-hidden pt-28 pb-8 md:pt-32 lg:pt-36">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-brand-grid absolute inset-0 opacity-60" />
        <div className="glow-purple absolute top-[-20rem] left-[-20rem] size-[60rem]" />
        <Chevron
          dir="right"
          className="absolute top-16 -right-14 h-[32rem] w-auto text-brand-purple/10"
        />
        <div className="bg-brand-noise absolute inset-0" />
      </div>

      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="grid items-center gap-9 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12">
          <div className="enter">
            <p className="font-subtitle text-xs font-semibold tracking-[0.16em] text-brand-green uppercase">
              {copy.dscHack.eyebrow}
            </p>
            <h1 className="mt-5 font-poster text-[clamp(2.5rem,6vw,4.1rem)] leading-[1.05] font-extrabold tracking-[-0.065em] uppercase">
              {copy.dscHack.titulo}
              <span className="mt-2 block text-brand-purple">{copy.dscHack.edicion}</span>
            </h1>
            <p className="mt-6 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              {copy.dscHack.lema}
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {copy.dscHack.intro}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-5">
              <a
                href="#proyectos"
                className="btn-brand inline-flex items-center gap-2 rounded-full px-5 py-3 font-subtitle text-sm font-semibold"
              >
                {copy.dscHack.ctaProyectos}
                <ArrowDown className="size-4" aria-hidden />
              </a>
              <a
                href="#fotos"
                className="inline-flex min-h-11 items-center gap-2 font-subtitle text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {copy.dscHack.ctaFotos}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </div>
          </div>

          <div
            className="enter relative pb-3"
            style={{ '--enter-delay': '100ms' } as React.CSSProperties}
          >
            <Medio
              medio={recapDscHack.fotoPortada}
              priority
              className="aspect-[4/3]"
              sizes="(min-width: 1024px) 600px, 100vw"
            />
            <p className="mt-4 font-subtitle text-xs leading-relaxed text-muted-foreground">
              {copy.dscHack.fotoPie}
            </p>
            <p className="etiqueta-sticker sticker-verde absolute -top-3 right-4 px-3 py-1.5 font-subtitle text-xs font-bold uppercase sm:right-7">
              {copy.dscHack.fecha}
            </p>
          </div>
        </div>

        <div className="mt-10 border-y border-border py-6 sm:mt-12">
          <dl aria-label={copy.dscHack.cifrasAria} className="grid grid-cols-3 gap-4 sm:gap-8">
            {recapDscHack.cifras.map((cifra) => (
              <div key={cifra.etiqueta} className="flex flex-col border-r border-border last:border-r-0">
                <dt className="order-2 mt-2 max-w-48 font-subtitle text-xs leading-snug text-muted-foreground sm:text-sm">
                  {cifra.etiqueta}
                </dt>
                <dd className="order-1 font-display text-4xl leading-none font-extrabold tracking-tight sm:text-5xl">
                  {cifra.valor}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-[0.65rem] leading-relaxed text-muted-foreground sm:text-xs">
            {copy.dscHack.cifrasNota}
          </p>
        </div>
      </div>
    </section>
  )
}
