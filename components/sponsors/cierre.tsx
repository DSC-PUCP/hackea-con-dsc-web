import { ArrowUpRight } from 'lucide-react'
import Image from 'next/image'

import { Parrafos, Seccion } from '@/components/sponsors/piezas'
import { copy } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'
import { destinoDelCta, enlaceDelCanva, texto } from '@/lib/sponsors/textos'
import type { Textos } from '@/lib/sponsors/types'

/**
 * Llamada a la acción del final. Es el segundo CTA de la página: el primero está en la
 * portada, porque mucha gente lee esto reenviado y decide en los primeros diez segundos.
 *
 * El botón apunta al formulario de Google (`cta.url`) y, si no hay, al correo de
 * contacto. Si no hay ninguno de los dos no se pinta el botón: mejor sin botón que con
 * uno que no lleva a ningún lado.
 *
 * ── Por qué es igual al cierre de la portada ─────────────────────────────────────────
 * Bloque morado plano, botón tinta y Bugle señalando el botón: es el mismo cierre que
 * la portada, a propósito. Quien llega acá desde el inicio reconoce el gesto y sabe que
 * sigue en el mismo sitio; quien llega directo por un enlace reenviado ve, una sola vez,
 * a la mascota que va a acompañar a su marca en las piezas. Es la única aparición de
 * Bugle en /sponsors: más sería restarle seriedad a una página que lee marketing.
 *
 * Bugle se apoya en el borde de abajo del bloque (por eso la sección no tiene relleno
 * inferior en su columna) y señala hacia la izquierda, que es donde están los botones.
 */
export function LlamadoFinal({ textos }: { textos: Textos }) {
  const titulo = texto(textos, 'cta.titulo')
  const cuerpo = texto(textos, 'cta.cuerpo')
  const etiqueta = texto(textos, 'cta.label')
  const correo = texto(textos, 'contacto.email')
  const destino = destinoDelCta(textos)
  const canva = enlaceDelCanva(textos)

  if (!titulo && !cuerpo && !destino) return null

  return (
    <Seccion id="contacto" className="bloque-morado mt-6 pt-14 pb-0 md:mt-10 md:pt-20 md:pb-0">
      <div className="grid items-end gap-x-10 md:grid-cols-[minmax(0,1fr)_auto]">
        <div data-reveal className="max-w-xl pb-6 md:pb-20">
          {titulo ? (
            <h2 className="font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {titulo}
            </h2>
          ) : null}

          {cuerpo ? (
            <Parrafos
              texto={cuerpo}
              className="mt-5 text-base leading-relaxed text-pretty text-brand-light/90 lg:text-lg"
              revelar={false}
            />
          ) : null}

          {/*
            Los dos botones: escribir (el que cierra el trato) y ver la propuesta
            completa (el que resuelve las dudas antes de escribir). En una fila desde
            640 px; apilados en móvil, porque juntos no caben.
          */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            {destino && etiqueta ? (
              <a
                href={destino}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tinta inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-subtitle text-base font-semibold"
              >
                {etiqueta}
                <ArrowUpRight className="size-5" aria-hidden />
              </a>
            ) : null}

            {canva ? (
              <a
                href={canva}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border-2 border-brand-light/60 px-7 py-3 font-subtitle text-base font-semibold transition-colors hover:border-brand-light hover:bg-brand-light/10"
              >
                {copy.sponsors.verPropuesta}
                <ArrowUpRight
                  className="size-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </a>
            ) : null}
          </div>

          {correo ? (
            <p className="mt-5 font-subtitle text-sm text-brand-light/85">
              {copy.sponsors.escribenos}{' '}
              <a
                href={`mailto:${correo}`}
                className="font-semibold text-brand-light underline underline-offset-4"
              >
                {correo}
              </a>
            </p>
          ) : null}
        </div>

        {/*
          En móvil va debajo del texto, y sin más ese sitio lo dejaba señalando un hueco
          morado vacío. El `-mt-16` lo sube hasta la línea del correo, que es corta y deja
          libre la derecha: así la mano cae a la altura de la dirección y la señala. Desde
          `md` vuelve a su columna y señala los botones.
        */}
        <div
          data-reveal
          style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
          className="pointer-events-none -mt-16 justify-self-end md:mt-0"
        >
          <Image
            src={assetPublico('/brand/bugle-senalando.webp')}
            alt={copy.sponsors.bugleAlt}
            width={1100}
            height={1282}
            sizes="(min-width: 1024px) 20rem, (min-width: 768px) 14rem, 9rem"
            className="w-36 md:w-56 lg:w-80"
          />
        </div>
      </div>
    </Seccion>
  )
}

/**
 * Condiciones y aclaraciones. Es la sección que evita malentendidos caros: qué está por
 * confirmar, dónde sí hay stand y dónde no, y qué NO se entrega (datos de participantes).
 *
 * Va al final y en letra chica, pero se escribe entera: quien la lee es quien está a
 * punto de decir que sí.
 */
export function LetraChica({ textos }: { textos: Textos }) {
  const titulo = texto(textos, 'letrachica.titulo')
  const cuerpo = texto(textos, 'letrachica.cuerpo')

  if (!cuerpo) return null

  return (
    <Seccion className="py-12 md:py-16">
      <div className="max-w-3xl border-t border-border pt-8">
        {titulo ? (
          <h2
            data-reveal
            className="font-subtitle text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase"
          >
            {titulo}
          </h2>
        ) : null}

        <Parrafos
          texto={cuerpo}
          className="mt-4 text-sm leading-relaxed text-muted-foreground"
          retrasoInicial={60}
        />
      </div>
    </Seccion>
  )
}
