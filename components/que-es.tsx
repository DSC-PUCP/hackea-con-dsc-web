import { Chevron } from '@/components/brand/icons'
import { Formatos } from '@/components/portada/formatos'
import { Llamado } from '@/components/portada/llamado'
import { Pilares } from '@/components/portada/pilares'
import { copy } from '@/lib/site-config'

/**
 * "Qué es Hack with DSC": todo lo que va después del hero en la portada.
 *
 * Se lee como un póster de arriba abajo, en cinco golpes:
 *   1. el titular (`titulo`), que abre sin rótulo encima — es la frase la que presenta
 *   2. el lema enmarcado entre dos chevrons gigantes
 *   3. los tres formatos, como las barras de la pieza 2, con Bugle asomándose
 *   4. los pilares, como stickers pegados con desorden a propósito
 *   5. el cierre y el botón, en el bloque morado a sangre que desemboca en el pie
 *
 * Sin halos de fondo a propósito: la niebla queda para el hero. Acá el color fuerte
 * llega por bloques sólidos (barras, stickers, el bloque morado), que es lo que hace que
 * se lea como póster y no como una plantilla oscura más.
 *
 * `overflow-x-clip` y no `overflow-hidden`: los chevrons y las barras se cortan contra
 * los costados de la pantalla, pero Bugle tiene que poder salirse del bloque morado
 * hacia ARRIBA. `clip` recorta solo en horizontal y, a diferencia de `hidden`, no
 * convierte la sección en un contenedor con scroll propio.
 */
export function QueEs() {
  return (
    <section id="que-es" aria-label={copy.queEs.aria} className="scroll-mt-24 overflow-x-clip">
      {/* ── 1. Apertura ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-5 pt-24 md:px-6 md:pt-36">
        <h2
          data-reveal
          className="font-poster text-[2.05rem] leading-[1.08] font-extrabold tracking-tight uppercase sm:text-5xl lg:text-[4.25rem]"
        >
          {/*
            Cada frase en su línea, como en un póster. La primera va apagada: es lo que
            NO somos, y la segunda es la que se tiene que quedar en la cabeza.
          */}
          {frases(copy.queEs.titulo).map((frase, indice) => (
            <span
              key={frase}
              className={`block ${indice === 0 ? 'text-brand-light/45' : 'text-brand-light'}`}
            >
              {frase}{' '}
            </span>
          ))}
        </h2>

        <p
          data-reveal
          style={{ '--reveal-delay': '120ms' } as React.CSSProperties}
          className="mt-8 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground md:mt-10 lg:text-lg"
        >
          {copy.queEs.intro}
        </p>
      </div>

      {/* ── 2. El marco: ❰ lema ❱ ───────────────────────────────────────────── */}
      {/*
        Los chevrons van a tamaño mural y a color pleno: en el hero son una textura casi
        invisible; acá son el recurso que firma la sección. Los márgenes negativos los
        empujan fuera de la pantalla en móvil, donde se recortan contra el canto.
      */}
      <div
        data-reveal
        className="my-24 flex items-center justify-center gap-3 md:my-36 md:gap-8 lg:gap-12"
      >
        <Chevron
          dir="left"
          className="-ml-12 h-44 w-auto shrink-0 text-brand-red sm:-ml-8 sm:h-60 lg:-ml-14 lg:h-[24rem]"
        />
        <p className="min-w-0 text-center font-poster text-[1.85rem] leading-[1.05] font-extrabold uppercase text-balance sm:text-4xl md:text-5xl lg:text-[4.5rem]">
          {copy.queEs.marco}
        </p>
        <Chevron
          dir="right"
          className="-mr-12 h-44 w-auto shrink-0 text-brand-purple sm:-mr-8 sm:h-60 lg:-mr-14 lg:h-[24rem]"
        />
      </div>

      {/* ── 3. Formatos ─────────────────────────────────────────────────────── */}
      <Formatos />

      {/* ── 4. Pilares ──────────────────────────────────────────────────────── */}
      <Pilares />

      {/* ── 5. Cierre + llamada a la acción ─────────────────────────────────── */}
      <Llamado />
    </section>
  )
}

/** Parte un texto en frases, cortando después de cada punto. */
function frases(texto: string) {
  return texto.split(/(?<=\.)\s+/)
}
