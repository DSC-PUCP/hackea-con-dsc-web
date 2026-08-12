import { Chevron } from '@/components/brand/icons'
import { parrafos } from '@/lib/sponsors/textos'
import { cn } from '@/lib/utils'

/**
 * Piezas que se repiten en varias secciones de `/sponsors`.
 *
 * Están juntas y no en un archivo por pieza porque ninguna tiene sentido fuera de esta
 * página: son el vocabulario visual de la subpágina, no componentes de uso general.
 */

/**
 * Mapa color de marca → clases de Tailwind.
 *
 * Igual que `clasesPorColor` en components/que-es.tsx, y por el mismo motivo: Tailwind
 * busca nombres de clase COMPLETOS en el código. `text-brand-${color}` no genera nada.
 */
const clasesDeAcento = {
  purple: 'text-brand-purple',
  blue: 'text-brand-blue',
  green: 'text-brand-green',
  red: 'text-brand-red',
} as const

export type Acento = keyof typeof clasesDeAcento

/**
 * Contenedor de sección, con el mismo ancho y respiración que la portada.
 *
 * `scroll-mt-24` compensa el header fijo cuando se llega por un ancla.
 *
 * `overflow-hidden` no es decorativo: los halos de fondo se salen de la sección a
 * propósito, y sin recortarlos ensanchan el documento. Medido: 156 px de scroll
 * horizontal en 1440. Es el mismo recurso que usan `Hero` y `QueEs` en la portada.
 *
 * El espaciado vertical se puede cambiar desde fuera (`className="py-10"`) porque pasa
 * por `cn()`: sin tailwind-merge, `py-20` y `py-10` son la misma utilidad y ganaría la
 * que estuviera más abajo en la hoja generada, no la que se escribió después.
 */
export function Seccion({
  id,
  aria,
  className,
  children,
}: {
  id?: string
  aria?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <section
      id={id}
      aria-label={aria}
      className={cn('relative isolate scroll-mt-24 overflow-hidden py-20 md:py-28', className)}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-6">{children}</div>
    </section>
  )
}

/**
 * Encabezado de sección: el rótulo con chevron, el título y un texto de entrada.
 *
 * Cada pieza se omite si viene vacía, así que una sección puede tener título sin
 * entradilla —o al revés— sin dejar huecos.
 */
export function EncabezadoSeccion({
  eyebrow,
  titulo,
  intro,
  acento = 'purple',
}: {
  eyebrow?: string
  titulo: string
  intro?: string
  acento?: Acento
}) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p
          data-reveal
          className={`flex items-center gap-2.5 font-subtitle text-xs font-semibold tracking-[0.2em] uppercase ${clasesDeAcento[acento]}`}
        >
          <Chevron dir="right" className="h-3 w-auto" />
          {eyebrow}
        </p>
      ) : null}

      {titulo ? (
        <h2
          data-reveal
          style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          className="mt-5 font-display text-3xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-4xl"
        >
          {titulo}
        </h2>
      ) : null}

      {intro ? (
        <Parrafos
          texto={intro}
          className="mt-6 text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
          retrasoInicial={160}
        />
      ) : null}
    </div>
  )
}

/**
 * Pinta un texto de la hoja como uno o varios párrafos.
 *
 * El texto se interpola como texto de React, así que se escapa solo: una celda con
 * `<script>` sale impresa, no ejecutada.
 */
export function Parrafos({
  texto,
  className = '',
  retrasoInicial = 0,
  revelar = true,
}: {
  texto: string
  className?: string
  /** Milisegundos de retraso del primer párrafo. Los siguientes se escalonan solos. */
  retrasoInicial?: number
  /** `false` para lo que está sobre el pliegue, donde manda la utilidad `enter`. */
  revelar?: boolean
}) {
  return (
    <>
      {parrafos(texto).map((parrafo, indice) => (
        <p
          key={indice}
          data-reveal={revelar ? '' : undefined}
          style={
            revelar
              ? ({ '--reveal-delay': `${retrasoInicial + indice * 70}ms` } as React.CSSProperties)
              : undefined
          }
          // `cn` y no interpolación: el que llama suele traer su propio margen superior
          // para el primer párrafo (`mt-6`), y sin tailwind-merge chocaría con el `mt-4`
          // de los siguientes — ganaría el que cayera más abajo en la hoja generada.
          className={cn(className, indice > 0 && 'mt-4')}
        >
          {parrafo}
        </p>
      ))}
    </>
  )
}

/**
 * Halo tenue de fondo, para que una sección no sea un rectángulo plano.
 *
 * Va en su propio componente porque se repite en media página y siempre igual:
 * absoluto, detrás de todo y fuera del árbol de accesibilidad.
 */
export function HaloDeFondo({
  className = 'glow-purple top-[-8%] left-1/2 size-[46rem] -translate-x-1/2 opacity-40',
}: {
  className?: string
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className={`absolute max-w-[140vw] ${className}`} />
    </div>
  )
}
