import { Chevron } from '@/components/brand/icons'
import { HaloDeFondo, Parrafos, Seccion } from '@/components/sponsors/piezas'
import { texto } from '@/lib/sponsors/textos'
import type { Textos } from '@/lib/sponsors/types'

/**
 * Qué es Hack with DSC, contado para una empresa.
 *
 * Va en dos columnas en escritorio —título a la izquierda, cuerpo a la derecha— porque
 * es el bloque de texto más largo de la página y una sola columna de ese ancho se lee
 * mal. En móvil se apila solo.
 */
export function Intro({ textos }: { textos: Textos }) {
  const titulo = texto(textos, 'intro.titulo')
  const cuerpo = texto(textos, 'intro.cuerpo')

  if (!titulo && !cuerpo) return null

  return (
    <Seccion id="el-programa">
      <HaloDeFondo className="glow-blue top-[-6%] left-[-10%] size-[38rem] opacity-35" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-14">
        <div>
          {titulo ? (
            <h2
              data-reveal
              className="font-display text-3xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-4xl"
            >
              {titulo}
            </h2>
          ) : null}

          {/* Decoración pura, y sin `data-reveal` a propósito: en móvil está en
              `display: none`, así que el IntersectionObserver no se dispararía nunca y
              quedaría contado para siempre como "pendiente de aparecer". */}
          <span aria-hidden className="mt-6 hidden lg:block">
            <Chevron dir="right" className="h-8 w-auto text-brand-purple/40" />
          </span>
        </div>

        {cuerpo ? (
          <div>
            <Parrafos
              texto={cuerpo}
              className="text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
            />
          </div>
        ) : null}
      </div>
    </Seccion>
  )
}
