import Image from 'next/image'

import { BrandIcon } from '@/components/brand/icons'
import { copy, formatos } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'

/**
 * Los tres formatos, como las barras de la pieza 2 (referencias/public_1/2.png).
 *
 * Igual que en la pieza, las barras ALTERNAN hacia qué lado sangran: la 1ª y la 3ª
 * llegan hasta el borde derecho de la pantalla y la 2ª hasta el izquierdo. Ese zigzag es
 * lo que hace que se lean como póster y no como tres tarjetas en fila.
 *
 * ── Cómo sangran hasta el borde sin `100vw` ──────────────────────────────────────────
 * La lista ocupa todo el ancho de la sección y cada barra se separa del lado que NO
 * sangra con `--borde`, que es exactamente donde empieza el contenido del resto de la
 * página (el `max-w-6xl` centrado con su padding). Los porcentajes se resuelven contra
 * el ancho de la lista, así que no hace falta `100vw`, que en escritorio incluye la
 * barra de scroll y abre un scroll horizontal de 15 px.
 */
export function Formatos() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <h3
          data-reveal
          className="max-w-[11ch] font-display text-3xl leading-[1.05] font-extrabold tracking-tight sm:max-w-none sm:text-4xl lg:text-5xl"
        >
          {copy.queEs.formatosTitulo}
        </h3>
      </div>

      {/*
        Bugle se asoma desde el canto DERECHO de la pantalla (el arte está cortado en recto
        por ese lado para pegarse a un borde), mirando hacia las barras.

        En escritorio se mete ENTRE las barras: delante de la 1ª, que se le pierde por
        debajo como en la pieza, y detrás de la 3ª, que le tapa el corte de abajo del arte
        (es un busto, y flotando en el aire se ve recortado). En móvil no hay sitio para
        eso sin tapar texto, así que se achica y se esconde detrás de la 1ª barra, asomando
        solo la cabeza junto al título: el mismo chiste, en chico.

        Las capas salen de `z-*` en este envoltorio y en cada `<li>` (ver `posiciones`).
      */}
      <div className="pointer-events-none absolute -top-8 right-0 z-0 w-48 sm:-top-14 sm:w-56 md:top-24 md:z-20 md:w-[24rem] lg:top-16 lg:w-[34rem]">
        <div data-reveal style={{ '--reveal-delay': '200ms' } as React.CSSProperties}>
          <Image
            src={assetPublico('/brand/bugle-asomado.webp')}
            alt={copy.queEs.bugleAsomadoAlt}
            width={800}
            height={924}
            sizes="(min-width: 1024px) 34rem, (min-width: 768px) 24rem, 14rem"
            className="h-auto w-full"
          />
        </div>
      </div>

      <ul
        style={{ '--borde': 'max(1.25rem, calc(50% - 34.5rem))' } as React.CSSProperties}
        className="mt-10 space-y-9 md:mt-14 md:space-y-12"
      >
        {formatos.map((formato, indice) => {
          const sangraALaDerecha = indice % 2 === 0

          return (
            <li
              key={formato.id}
              data-reveal
              style={{ '--reveal-delay': `${indice * 110}ms` } as React.CSSProperties}
              className={`relative z-10 ${posiciones[indice % posiciones.length]}`}
            >
              <div
                className={`barra-poster flex items-start gap-5 px-6 py-6 sm:items-center md:gap-8 md:px-10 md:py-8 ${
                  sangraALaDerecha
                    ? 'rounded-r-none!'
                    : 'rounded-l-none! flex-row-reverse text-right'
                }`}
              >
                <BrandIcon
                  name={formato.icon}
                  className="mt-1 h-9 w-auto shrink-0 sm:mt-0 md:h-14 lg:h-16"
                />

                <div className="min-w-0 max-w-md">
                  <p className="font-subtitle text-xs font-semibold tracking-[0.18em] text-brand-light/80 uppercase md:text-sm">
                    {formato.lema}
                  </p>
                  <h4 className="mt-1.5 font-poster text-xl leading-tight font-bold tracking-wide uppercase md:text-[1.7rem]">
                    {formato.titulo}
                  </h4>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-pretty md:text-base">
                    {formato.descripcion}
                  </p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/*
 * Dónde empieza y dónde termina cada barra. Escritas completas, y no armadas con
 * plantillas, porque Tailwind solo genera las clases que encuentra enteras en el código.
 *
 * Las dos que sangran a la derecha arrancan a alturas distintas (la 1ª más adentro que la
 * 3ª), como en la pieza: si empezaran en la misma columna se leerían como una tabla. La
 * del medio sangra a la izquierda y en escritorio se corta antes de llegar a Bugle.
 *
 * La 3ª sube a `md:z-30` para quedar por DELANTE de Bugle (que está en `md:z-20`).
 */
const posiciones = [
  'ml-[calc(var(--borde)_+_1.5rem)] lg:ml-[calc(var(--borde)_+_5rem)]',
  'mr-[calc(var(--borde)_+_1.5rem)] lg:mr-[calc(50%_-_11rem)]',
  'ml-[var(--borde)] md:z-30 lg:ml-[calc(var(--borde)_+_1.5rem)]',
]
