import { MessageCircle } from 'lucide-react'
import Image from 'next/image'

import { copy, links } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'

/**
 * El cierre de la portada: el bloque morado a sangre con la frase final y el botón al
 * grupo de WhatsApp. Es el único `bloque-morado` de la página, y va al final porque es
 * a donde tiene que llegar todo lo de arriba.
 *
 * Bugle está a la DERECHA del texto y señala hacia la izquierda, o sea hacia la frase y
 * el botón. Una sola imagen colocada distinto según el ancho:
 *   - en escritorio se para sobre el borde de abajo del bloque y se sale por arriba;
 *   - en móvil se pone junto al título de la llamada, que deja sitio a su derecha.
 * Lo hace cambiando de contenedor de referencia: el envoltorio del título es `relative`
 * en móvil y `static` desde `lg`, así que desde ahí Bugle se coloca contra el bloque.
 */
export function Llamado() {
  return (
    <div className="bloque-morado mt-36 md:mt-48">
      <div className="relative mx-auto max-w-6xl px-5 pt-16 pb-16 md:px-6 md:pt-24 md:pb-24 lg:pb-28">
        <p
          data-reveal
          className="font-poster text-[1.55rem] leading-[1.25] font-extrabold uppercase min-[400px]:text-[1.7rem] sm:text-4xl lg:text-[2.9rem]"
        >
          <span className="block">{copy.queEs.cierre.antes}</span>{' '}
          {/*
            Sticker verde y no rotulador: el `marcador` es translúcido y sobre el morado
            se ensucia a un verde oliva. El sticker es opaco y salta igual que en las
            piezas, donde "Muchos eventos" es justo la frase en verde.
          */}
          <span className="block py-1.5">
            <span
              style={{ '--sticker-giro': '-2deg' } as React.CSSProperties}
              className="etiqueta-sticker sticker-verde rounded-md px-3 py-1 md:px-4"
            >
              {copy.queEs.cierre.destacado}
            </span>
          </span>{' '}
          <span className="block">{copy.queEs.cierre.despues}</span>
        </p>

        <div className="relative mt-16 max-w-xl md:mt-14 lg:static">
          <div
            data-reveal
            style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          >
            <h3 className="pr-36 font-display text-2xl leading-tight font-extrabold tracking-tight text-balance sm:pr-48 sm:text-3xl lg:pr-0">
              {copy.cta.titulo}
            </h3>
            <p className="mt-4 leading-relaxed text-pretty lg:text-lg">{copy.cta.descripcion}</p>
          </div>

          <div
            data-reveal
            style={{ '--reveal-delay': '200ms' } as React.CSSProperties}
            className="mt-8"
          >
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tinta inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-4 font-subtitle text-base font-semibold sm:w-auto"
            >
              <MessageCircle className="size-5" aria-hidden />
              {copy.cta.boton}
            </a>
            <p className="mt-4 font-subtitle text-sm">{copy.cta.nota}</p>
          </div>

          <div className="pointer-events-none absolute -top-16 -right-3 w-36 sm:-top-14 sm:w-44 lg:top-auto lg:right-4 lg:bottom-0 lg:w-[26rem] xl:right-0 xl:w-[28rem]">
            <div data-reveal style={{ '--reveal-delay': '160ms' } as React.CSSProperties}>
              <Image
                src={assetPublico('/brand/bugle-senalando.webp')}
                alt={copy.queEs.bugleSenalandoAlt}
                width={1100}
                height={1282}
                sizes="(min-width: 1280px) 28rem, (min-width: 1024px) 26rem, 11rem"
                className="h-auto w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
