import Image from 'next/image'

import { copy } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'

/**
 * La escena del código Konami: Bugle cruzando la pantalla y un mensaje.
 *
 * Es de servidor y está siempre en el HTML, pero no se ve ni ocupa sitio hasta que
 * components/konami.tsx pone `data-konami` en `<html>`. Quién se mueve, cuándo y cómo lo
 * decide globals.css (bloque «pie-y-extras»): el mismo reparto que `data-reveal`.
 *
 * Accesibilidad, en dos piezas separadas a propósito:
 *  · Bugle es pura decoración: `aria-hidden` y `alt` vacío, siempre.
 *  · El mensaje vive dentro de una región `role="status"` que existe desde el principio.
 *    Mientras está oculto con `display: none` no está en el árbol de accesibilidad; al
 *    aparecer, el lector de pantalla lo anuncia sin interrumpir lo que estaba leyendo.
 */
export function KonamiEscena() {
  return (
    <div className="konami-escena">
      <div aria-hidden className="konami-bugle">
        <div className="konami-trote">
          <Image
            src={assetPublico('/brand/bugle-cyberpunk.webp')}
            alt=""
            width={967}
            height={696}
            sizes="(min-width: 800px) 24rem, 40vw"
            className="bugle-shadow w-full"
          />
        </div>
      </div>

      <p role="status" className="konami-zona">
        <span
          style={{ '--sticker-giro': '-3deg' } as React.CSSProperties}
          className="konami-mensaje sticker sticker-verde px-5 py-3 font-display text-lg leading-snug font-bold md:text-xl"
        >
          {copy.konami.mensaje}
        </span>
      </p>
    </div>
  )
}
