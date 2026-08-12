import { ArrowDown, ArrowUpRight } from 'lucide-react'

import { Chevron } from '@/components/brand/icons'
import { copy } from '@/lib/site-config'
import { destinoDelCta, enlaceDelCanva, texto } from '@/lib/sponsors/textos'
import type { Textos } from '@/lib/sponsors/types'

/**
 * Portada de `/sponsors`.
 *
 * Usa la utilidad `enter` y NO `data-reveal`, porque es lo primero que se ve: el
 * contenido de arriba del pliegue nunca puede depender de que un IntersectionObserver se
 * dispare a tiempo. El razonamiento largo está en globals.css, sección "Entrada al
 * cargar".
 *
 * Las capas de fondo llevan `parallax-*`, y el contenido `enter`. Están en ramas
 * distintas del árbol a propósito: las dos utilidades animan `translate`, y `enter`
 * termina con relleno `both`, así que en un mismo elemento congelaría el parallax.
 */
export function HeroSponsors({
  textos,
  hayNiveles,
  hayActivos,
}: {
  textos: Textos
  hayNiveles: boolean
  hayActivos: boolean
}) {
  const eyebrow = texto(textos, 'hero.eyebrow')
  const titulo = texto(textos, 'hero.titulo')
  const subtitulo = texto(textos, 'hero.subtitulo')
  const etiquetaCta = texto(textos, 'hero.cta_label')
  const destino = destinoDelCta(textos)

  /*
   * A dónde lleva el botón secundario, en orden de preferencia.
   *
   * No puede estar fijo en `#niveles`: mientras esa pestaña de la hoja siga en
   * `mostrable = NO`, la sección no se dibuja y el enlace no llevaría a ninguna parte —
   * un botón muerto en la primera pantalla de la página que se le manda a una empresa.
   * Si no hay nada de lo tres, no se pinta el botón.
   *
   * El Canva va primero porque es donde vive ahora el detalle de niveles y beneficios:
   * lleva a la versión completa de lo que las anclas enseñan resumido. Las dos anclas se
   * quedan como respaldo para el día que esas secciones vuelvan a la web.
   */
  const canva = enlaceDelCanva(textos)

  const secundario = canva
    ? { destino: canva, etiqueta: copy.sponsors.verPropuesta, externo: true }
    : hayNiveles
      ? { destino: '#niveles', etiqueta: copy.sponsors.verNiveles, externo: false }
      : hayActivos
        ? { destino: '#que-ofrecemos', etiqueta: copy.sponsors.verOferta, externo: false }
        : null

  return (
    <section id="top" className="relative isolate overflow-hidden pt-32 pb-8 md:pt-40 md:pb-14">
      {/* ── Fondo ───────────────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-brand-grid parallax-back absolute inset-[-2rem]" />

        <div className="glow-purple animate-breathe parallax-mid absolute top-[-30%] right-[-10%] size-[40rem] max-w-[130vw]" />
        <div className="glow-blue animate-breathe parallax-back absolute top-[-18%] left-[-16%] size-[34rem] max-w-[130vw] [animation-delay:-4s]" />

        <Chevron
          dir="right"
          className="parallax-front absolute right-[-3rem] bottom-[-2rem] h-[14rem] w-auto text-brand-purple/[0.035] lg:h-[20rem]"
        />

        <div className="bg-brand-noise absolute inset-0" />
      </div>

      {/* ── Contenido ───────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p className="enter inline-flex items-center gap-2.5 rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3.5 py-1.5 font-subtitle text-[0.7rem] font-semibold tracking-[0.22em] text-brand-purple uppercase">
              <Chevron dir="right" className="h-2.5 w-auto" />
              {eyebrow}
            </p>
          ) : null}

          <h1
            style={{ '--enter-delay': '90ms' } as React.CSSProperties}
            className="enter mt-7 font-display text-3xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {titulo}
          </h1>

          {subtitulo ? (
            <p
              style={{ '--enter-delay': '180ms' } as React.CSSProperties}
              className="enter mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
            >
              {subtitulo}
            </p>
          ) : null}

          <div
            style={{ '--enter-delay': '260ms' } as React.CSSProperties}
            className="enter mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            {destino && etiquetaCta ? (
              <a
                href={destino}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-subtitle text-base font-semibold"
              >
                {etiquetaCta}
                <ArrowUpRight className="size-5" aria-hidden />
              </a>
            ) : null}

            {secundario ? (
              <a
                href={secundario.destino}
                // Un ancla se queda en el documento; el Canva se abre aparte para no
                // sacar a la empresa de la página desde la primera pantalla.
                target={secundario.externo ? '_blank' : undefined}
                rel={secundario.externo ? 'noopener noreferrer' : undefined}
                className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-input bg-card/50 px-7 py-3.5 font-subtitle text-base font-semibold backdrop-blur-sm transition-colors hover:border-brand-purple/50 hover:bg-card"
              >
                {secundario.etiqueta}
                {/* La flecha dice a dónde va: abajo si baja, afuera si sale del sitio. */}
                {secundario.externo ? (
                  <ArrowUpRight
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                ) : (
                  <ArrowDown
                    className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    aria-hidden
                  />
                )}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  )
}
