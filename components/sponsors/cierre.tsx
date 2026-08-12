import { ArrowUpRight } from 'lucide-react'

import { HaloDeFondo, Parrafos, Seccion } from '@/components/sponsors/piezas'
import { copy } from '@/lib/site-config'
import { destinoDelCta, texto } from '@/lib/sponsors/textos'
import type { Textos } from '@/lib/sponsors/types'

/**
 * Llamada a la acción del final. Es el segundo CTA de la página: el primero está en la
 * portada, porque mucha gente lee esto reenviado y decide en los primeros diez segundos.
 *
 * El botón apunta al formulario de Google (`cta.url`) y, si no hay, al correo de
 * contacto. Si no hay ninguno de los dos no se pinta el botón: mejor sin botón que con
 * uno que no lleva a ningún lado.
 */
export function LlamadoFinal({ textos }: { textos: Textos }) {
  const titulo = texto(textos, 'cta.titulo')
  const cuerpo = texto(textos, 'cta.cuerpo')
  const etiqueta = texto(textos, 'cta.label')
  const correo = texto(textos, 'contacto.email')
  const destino = destinoDelCta(textos)

  if (!titulo && !cuerpo && !destino) return null

  return (
    <Seccion id="contacto">
      <HaloDeFondo className="glow-blue top-[10%] left-1/2 size-[42rem] -translate-x-1/2 opacity-40" />

      <div
        data-reveal
        className="brand-card flex flex-col gap-7 border border-border p-8 md:flex-row md:items-center md:justify-between md:p-12"
      >
        <div className="max-w-xl">
          {titulo ? (
            <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              {titulo}
            </h2>
          ) : null}

          {cuerpo ? (
            <Parrafos
              texto={cuerpo}
              className="mt-4 leading-relaxed text-muted-foreground"
              revelar={false}
            />
          ) : null}
        </div>

        <div className="shrink-0">
          {destino && etiqueta ? (
            <a
              href={destino}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-subtitle text-base font-semibold md:w-auto"
            >
              {etiqueta}
              <ArrowUpRight className="size-5" aria-hidden />
            </a>
          ) : null}

          {correo ? (
            <p className="mt-3 text-center font-subtitle text-sm text-muted-foreground md:text-right">
              {copy.sponsors.escribenos}{' '}
              <a href={`mailto:${correo}`} className="text-foreground underline underline-offset-4">
                {correo}
              </a>
            </p>
          ) : null}
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
