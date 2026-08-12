import Image from 'next/image'

import { Seccion } from '@/components/sponsors/piezas'
import { copy, galeriaSponsors } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'

/**
 * Fotos de ediciones anteriores.
 *
 * Es la única sección que NO viene de la hoja: las fotos son assets del repo
 * (`public/sponsors/`) y su lista, con los textos alternativos, está en
 * `lib/site-config.ts`.
 *
 * Sin fotos no se pinta nada. Mientras no haya material propio ese es el estado
 * correcto: unas imágenes de archivo en una página de patrocinio se notan, y restan
 * más de lo que suman.
 */
export function Galeria() {
  if (galeriaSponsors.length === 0) return null

  return (
    <Seccion aria={copy.sponsors.galeriaAria} className="py-6 md:py-10">
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        {galeriaSponsors.map((foto, indice) => (
          <li
            key={foto.src}
            data-reveal
            style={{ '--reveal-delay': `${indice * 70}ms` } as React.CSSProperties}
            className="overflow-hidden rounded-2xl border border-border"
          >
            <Image
              src={assetPublico(foto.src)}
              alt={foto.alt}
              width={foto.width}
              height={foto.height}
              sizes="(min-width: 768px) 33vw, 50vw"
              className="h-full w-full object-cover"
            />
          </li>
        ))}
      </ul>
    </Seccion>
  )
}
