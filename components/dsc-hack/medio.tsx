import Image from 'next/image'

import { copy } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'
import type { MedioRecap } from '@/lib/dsc-hack/types'
import { cn } from '@/lib/utils'

/** La misma pieza admite fotos de evento, capturas de producto y futuros videos. */
export function Medio({
  medio,
  className,
  priority = false,
  sizes = '(min-width: 1024px) 50vw, 100vw',
}: {
  medio: MedioRecap
  className?: string
  priority?: boolean
  sizes?: string
}) {
  if (medio.tipo === 'video') {
    return (
      <figure className={className}>
        <video
          controls
          preload="none"
          playsInline
          poster={assetPublico(medio.portada.src)}
          aria-label={medio.descripcion}
          className="w-full rounded-xl"
        >
          <source src={assetPublico(medio.src)} />
          {medio.subtitulos ? (
            <track
              kind="captions"
              src={assetPublico(medio.subtitulos)}
              srcLang="es"
              label={copy.dscHack.subtitulos}
              default
            />
          ) : null}
          <a href={assetPublico(medio.src)}>{medio.descripcion}</a>
        </video>
        <figcaption className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {medio.descripcion}
        </figcaption>
      </figure>
    )
  }

  return (
    <figure className={cn('flex min-w-0 flex-col', className)}>
      <a
        href={assetPublico(medio.src)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${copy.dscHack.ampliarFoto}: ${medio.alt}`}
        className="recap-foto group block min-h-0 flex-1 overflow-hidden"
      >
        <Image
          src={assetPublico(medio.src)}
          alt={medio.alt}
          width={medio.width}
          height={medio.height}
          priority={priority}
          sizes={sizes}
          style={{ objectPosition: medio.encuadre }}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
      </a>
      {medio.pie ? (
        <figcaption className="mt-3 shrink-0 text-sm leading-relaxed text-muted-foreground">
          {medio.pie}
        </figcaption>
      ) : null}
    </figure>
  )
}
