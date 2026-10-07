import { copy, pilares, type ColorDeSticker } from '@/lib/site-config'

/**
 * Mapa color de sticker → clase. Escrito entero porque Tailwind solo genera las clases
 * que encuentra COMPLETAS en el código: `sticker-${color}` no produciría nada. Cada
 * `color` de `pilares` en lib/site-config.ts necesita su entrada acá.
 */
const clasesPorColor = {
  claro: 'sticker-claro',
  verde: 'sticker-verde',
  morado: 'sticker-morado',
  azul: 'sticker-azul',
} satisfies Record<ColorDeSticker, string>

/*
 * La composición "desordenada con intención": cada sticker con su giro y su desfase.
 * En móvil van uno debajo de otro y solo conservan el giro; el desorden de verdad (la
 * segunda columna más abajo, los márgenes que no coinciden) aparece desde `md`, donde
 * hay sitio para que no se pisen.
 *
 * `top` y no `translate` para bajar la segunda columna: `translate` ya lo usan el hover
 * del sticker y la aparición con `data-reveal`, y se pisarían.
 */
const composicion = [
  { giro: '-3deg', clases: 'md:mr-6' },
  { giro: '2deg', clases: 'md:top-24 md:ml-4 md:mr-2' },
  { giro: '-1.5deg', clases: 'md:ml-14 md:-mr-2' },
  { giro: '3deg', clases: 'md:top-24 md:mr-12' },
]

/** Los cuatro pilares del programa, como stickers pegados en la tapa de una laptop. */
export function Pilares() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 md:px-6 md:pt-44">
      <div className="max-w-2xl">
        <h3
          data-reveal
          className="font-display text-3xl leading-[1.05] font-extrabold tracking-tight sm:text-4xl lg:text-5xl"
        >
          {copy.queEs.pilaresTitulo}
        </h3>
        <p
          data-reveal
          style={{ '--reveal-delay': '100ms' } as React.CSSProperties}
          className="mt-5 text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
        >
          {copy.queEs.pilaresIntro}
        </p>
      </div>

      <ul className="mt-12 grid gap-10 md:mt-16 md:grid-cols-2 md:gap-x-10 md:gap-y-14 md:pb-24">
        {pilares.map((pilar, indice) => {
          const { giro, clases } = composicion[indice % composicion.length]

          return (
            <li
              key={pilar.nombre}
              data-reveal
              style={{ '--reveal-delay': `${indice * 90}ms` } as React.CSSProperties}
            >
              <div
                style={{ '--sticker-giro': giro } as React.CSSProperties}
                className={`sticker ${clasesPorColor[pilar.color]} ${clases} p-7 md:p-8 lg:p-9`}
              >
                <p className="inline-block rounded-full border-2 border-current px-3 py-1 font-subtitle text-[0.68rem] leading-none font-bold tracking-[0.16em] uppercase">
                  {pilar.nombre}
                </p>
                <h4 className="mt-5 font-display text-2xl leading-[1.08] font-extrabold tracking-tight text-balance lg:text-[1.85rem]">
                  {pilar.titulo}
                </h4>
                <p className="mt-3 leading-relaxed font-medium text-pretty">{pilar.descripcion}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
