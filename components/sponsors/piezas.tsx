import { parrafos } from '@/lib/sponsors/textos'
import { cn } from '@/lib/utils'

/**
 * Piezas que se repiten en varias secciones de `/sponsors`.
 *
 * Están juntas y no en un archivo por pieza porque ninguna tiene sentido fuera de esta
 * página: son el vocabulario visual de la subpágina, no componentes de uso general.
 *
 * ── El tono de esta página ───────────────────────────────────────────────────────────
 * `/sponsors` la lee alguien de marketing, muchas veces reenviada. Es el mismo personaje
 * que la portada, pero de traje: los recursos firma aparecen en dosis baja (una barra de
 * póster en el nivel destacado, chevrons como signos tipográficos, el bloque morado del
 * cierre) y el resto es fondo tinta limpio, filetes y buena tipografía. Si una sección
 * nueva pide más color, que lo pida a uno de esos recursos y no a un halo.
 */

/**
 * Contenedor de sección, con el mismo ancho y respiración que la portada.
 *
 * `scroll-mt-24` compensa el header fijo cuando se llega por un ancla.
 *
 * `overflow-hidden` se queda aunque el cuerpo de la página ya no lleve halos: es barato y
 * evita que cualquier decoración que se salga del contenedor ensanche el documento
 * (antes medía 156 px de scroll horizontal en 1440).
 *
 * El espaciado vertical se puede cambiar desde fuera (`className="py-10"`) porque pasa
 * por `cn()`, que resuelve el choque con tailwind-merge: gana la clase que se pasa.
 *
 * ── Por qué `py-16 md:py-20` y no más ────────────────────────────────────────────────
 * Era `py-20 md:py-28`, o sea 224 px de aire entre dos secciones en escritorio. Al sacar
 * niveles y beneficios al Canva esos huecos pasaron a leerse como que falta contenido, no
 * como respiración. Ahora son 160 px. Es UN número y está acá: si hay que cambiarlo, se
 * cambia acá y cambia en toda la página a la vez.
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
      className={cn('relative isolate scroll-mt-24 overflow-hidden py-16 md:py-20', className)}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-6">{children}</div>
    </section>
  )
}

/**
 * Encabezado de sección: título y, si la hoja lo trae, un texto de entrada.
 *
 * Ya no lleva rótulo con chevron encima. Ese molde —rótulo, título, párrafo gris— se
 * repetía igual en todas las secciones y hacía que la página pareciera una plantilla. El
 * título va solo y en blanco, y la entradilla en un tono más claro que el gris de cuerpo:
 * es la frase que explica la sección, no letra pequeña.
 *
 * Dos disposiciones, para que dos secciones seguidas no abran igual:
 *
 *  · `apilado`  — título y entradilla uno debajo del otro.
 *  · `dividido` — en escritorio, el título a la izquierda y la entradilla a la derecha,
 *    alineados por abajo, con un filete encima. Es el encabezado de una ficha técnica:
 *    sirve donde lo que sigue son datos para comparar (los niveles).
 *
 * Cada pieza se omite si viene vacía, así que una sección puede tener título sin
 * entradilla —o al revés— sin dejar huecos.
 */
export function EncabezadoSeccion({
  titulo,
  intro,
  disposicion = 'apilado',
}: {
  titulo: string
  intro?: string
  disposicion?: 'apilado' | 'dividido'
}) {
  const dividido = disposicion === 'dividido'

  return (
    <div
      className={cn(
        'max-w-3xl',
        dividido &&
          'max-w-none border-t border-border pt-8 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-14',
      )}
    >
      {titulo ? (
        <h2
          data-reveal
          className="font-display text-3xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]"
        >
          {titulo}
        </h2>
      ) : null}

      {intro ? (
        <div className={cn('mt-5', dividido && 'lg:mt-0')}>
          <Parrafos
            texto={intro}
            className="text-base leading-relaxed text-pretty text-foreground/80 lg:text-lg"
            retrasoInicial={100}
          />
        </div>
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
          // para el primer párrafo (`mt-6`), y tailwind-merge resuelve el choque con el
          // `mt-4` de los siguientes.
          className={cn(className, indice > 0 && 'mt-4')}
        >
          {parrafo}
        </p>
      ))}
    </>
  )
}
