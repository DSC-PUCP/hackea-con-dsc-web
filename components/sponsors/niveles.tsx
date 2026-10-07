import { Check } from 'lucide-react'

import { EncabezadoSeccion, Seccion } from '@/components/sponsors/piezas'
import { copy } from '@/lib/site-config'
import { texto } from '@/lib/sponsors/textos'
import type { Nivel, Textos } from '@/lib/sponsors/types'
import { cn } from '@/lib/utils'

/**
 * Niveles de alianza.
 *
 * Dos cosas que el diseño tiene que respetar sí o sí:
 *
 *  · **Un nivel sin beneficios se muestra igual**, con su resumen. No es un error: es el
 *    estado normal mientras el equipo termina de definir la oferta.
 *  · **`aporteTexto` es texto libre.** No se parsea, no se ordena y no se compara. Puede
 *    decir "a convenir" o no decir nada.
 *
 * En la página no aparecen montos. Si algún día se publican, se escriben en la hoja.
 *
 * ── El nivel destacado ───────────────────────────────────────────────────────────────
 * Es el único sitio del cuerpo de /sponsors donde entra la barra de póster entera: el
 * degradado y la sombra maciza de la pieza 2. Los demás niveles son cajas sobrias, así
 * que el destacado se distingue sin necesidad de agrandarlo ni de un halo. Lleva además
 * la única etiqueta-sticker de la página; más de una, en contenido comercial, ya sería
 * ruido.
 *
 * Sobre el degradado, todo el texto es claro (el gris de cuerpo y el verde de los checks
 * no llegan a contraste suficiente sobre morado), y la jerarquía la marca la opacidad.
 */
export function Niveles({ niveles, textos }: { niveles: Nivel[]; textos: Textos }) {
  if (niveles.length === 0) return null

  const notaAporte = texto(textos, 'niveles.nota_aporte')

  return (
    <Seccion id="niveles">
      <EncabezadoSeccion
        titulo={texto(textos, 'niveles.titulo')}
        intro={texto(textos, 'niveles.intro')}
        disposicion="dividido"
      />

      <ul className="mt-12 grid items-start gap-6 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
        {niveles.map((nivel, indice) => {
          const destacado = nivel.destacado

          return (
            <li
              key={nivel.id}
              data-reveal
              style={{ '--reveal-delay': `${indice * 110}ms` } as React.CSSProperties}
              // El margen de abajo deja sitio a la sombra maciza: sin él, en la
              // rejilla apilada de móvil la sombra se pega a la tarjeta siguiente.
              className={cn(destacado && 'mb-2.5')}
            >
              <div
                className={cn(
                  'relative h-full p-7',
                  destacado ? 'barra-poster' : 'rounded-2xl border border-border bg-card',
                )}
              >
                {destacado ? (
                  <p
                    style={{ '--sticker-giro': '3deg' } as React.CSSProperties}
                    className="etiqueta-sticker sticker-verde absolute -top-3.5 right-6 px-2.5 py-1 font-subtitle text-[0.7rem] font-bold tracking-[0.14em] uppercase"
                  >
                    {copy.sponsors.nivelDestacado}
                  </p>
                ) : null}

                <h3 className="font-display text-2xl font-extrabold tracking-tight">
                  {nivel.nombre}
                </h3>
                <p
                  className={cn(
                    'mt-3 leading-relaxed',
                    destacado ? 'text-brand-light/85' : 'text-muted-foreground',
                  )}
                >
                  {nivel.resumen}
                </p>

                {nivel.aporteTexto ? (
                  <p
                    className={cn(
                      'mt-4 font-subtitle text-sm font-semibold',
                      destacado ? 'text-brand-light' : 'text-brand-green',
                    )}
                  >
                    {nivel.aporteTexto}
                  </p>
                ) : null}

                {nivel.beneficios.length > 0 ? (
                  <ul
                    className={cn(
                      'mt-6 space-y-3 border-t pt-6',
                      destacado ? 'border-brand-light/25' : 'border-border',
                    )}
                  >
                    {nivel.beneficios.map((beneficio, posicion) => (
                      <li key={`${nivel.id}-${posicion}`} className="flex gap-3">
                        <Check
                          className={cn(
                            'mt-1 size-4 shrink-0',
                            destacado ? 'text-brand-light' : 'text-brand-green',
                          )}
                          aria-hidden
                        />
                        <span className="min-w-0">
                          <span className="block text-sm leading-relaxed font-medium">
                            {beneficio.beneficio}
                          </span>
                          {beneficio.detalle ? (
                            <span
                              className={cn(
                                'mt-1 block text-sm leading-relaxed',
                                destacado ? 'text-brand-light/75' : 'text-muted-foreground',
                              )}
                            >
                              {beneficio.detalle}
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          )
        })}
      </ul>

      {notaAporte ? (
        <p
          data-reveal
          className="mt-10 max-w-3xl text-sm leading-relaxed text-muted-foreground"
        >
          {notaAporte}
        </p>
      ) : null}
    </Seccion>
  )
}
