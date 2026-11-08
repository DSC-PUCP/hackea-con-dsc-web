import { ArrowUpRight } from 'lucide-react'

import { Medio } from '@/components/dsc-hack/medio'
import { copy, links, recapDscHack } from '@/lib/site-config'

export function GaleriaDscHack() {
  if (!recapDscHack.fotos.length) return null

  return (
    <section id="fotos" aria-labelledby="fotos-titulo" className="border-t border-border py-14 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <h2
              id="fotos-titulo"
              className="font-poster text-3xl leading-tight font-extrabold tracking-tight uppercase sm:text-4xl"
            >
              {copy.dscHack.galeriaTitulo}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {copy.dscHack.galeriaIntro}
            </p>
          </div>
          <a
            href={links.albumDscHack}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 border-b border-brand-purple font-subtitle text-sm font-semibold hover:text-brand-green"
          >
            {copy.dscHack.album}
            <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
        <ul aria-label={copy.dscHack.galeriaAria} className="recap-mosaico">
          {recapDscHack.fotos.map((foto) => (
            <li key={foto.src} className="min-h-0 min-w-0">
              <Medio
                medio={foto}
                className="h-full"
                sizes="(min-width: 1024px) 550px, (min-width: 640px) 50vw, 100vw"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
