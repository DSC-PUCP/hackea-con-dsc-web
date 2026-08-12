import { Check } from 'lucide-react'

import { EncabezadoSeccion, HaloDeFondo, Seccion } from '@/components/sponsors/piezas'
import { copy } from '@/lib/site-config'
import { texto } from '@/lib/sponsors/textos'
import type { Nivel, Textos } from '@/lib/sponsors/types'

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
 */
export function Niveles({ niveles, textos }: { niveles: Nivel[]; textos: Textos }) {
  if (niveles.length === 0) return null

  const notaAporte = texto(textos, 'niveles.nota_aporte')

  return (
    <Seccion id="niveles">
      <HaloDeFondo className="glow-purple top-[-6%] right-[-12%] size-[40rem] opacity-40" />

      <EncabezadoSeccion
        titulo={texto(textos, 'niveles.titulo')}
        intro={texto(textos, 'niveles.intro')}
      />

      <ul className="mt-12 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
        {niveles.map((nivel, indice) => (
          <li
            key={nivel.id}
            data-reveal
            style={{ '--reveal-delay': `${indice * 110}ms` } as React.CSSProperties}
          >
            <div
              className={`brand-card h-full border p-7 ${
                nivel.destacado ? 'card-destacada' : 'border-border'
              }`}
            >
              {nivel.destacado ? (
                <p className="mb-4 inline-flex rounded-full border border-brand-purple/40 bg-brand-purple/12 px-3 py-1 font-subtitle text-[0.65rem] font-semibold tracking-[0.18em] text-brand-purple uppercase">
                  {copy.sponsors.nivelDestacado}
                </p>
              ) : null}

              <h3 className="font-display text-2xl font-extrabold tracking-tight">
                {nivel.nombre}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{nivel.resumen}</p>

              {nivel.aporteTexto ? (
                <p className="mt-4 font-subtitle text-sm font-semibold text-brand-green">
                  {nivel.aporteTexto}
                </p>
              ) : null}

              {nivel.beneficios.length > 0 ? (
                <ul className="mt-6 space-y-3 border-t border-border pt-6">
                  {nivel.beneficios.map((beneficio, posicion) => (
                    <li key={`${nivel.id}-${posicion}`} className="flex gap-3">
                      <Check className="mt-1 size-4 shrink-0 text-brand-green" aria-hidden />
                      <span className="min-w-0">
                        <span className="block text-sm leading-relaxed">
                          {beneficio.beneficio}
                        </span>
                        {beneficio.detalle ? (
                          <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
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
        ))}
      </ul>

      {notaAporte ? (
        <p
          data-reveal
          className="mt-8 max-w-3xl text-sm leading-relaxed text-muted-foreground"
        >
          {notaAporte}
        </p>
      ) : null}
    </Seccion>
  )
}
