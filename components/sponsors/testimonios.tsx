import { ArrowUpRight } from 'lucide-react'

import { EncabezadoSeccion, Seccion } from '@/components/sponsors/piezas'
import { iniciales } from '@/lib/iniciales'
import { copy } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'
import { texto } from '@/lib/sponsors/textos'
import type { Testimonio, Textos } from '@/lib/sponsors/types'

/**
 * Lo que dicen los participantes. Son publicaciones reales de LinkedIn, y ahí está la
 * gracia: el enlace a la publicación original es lo que le da credibilidad a la cita.
 *
 * A partir de este largo se recorta el texto con `<details>`. Es una cifra y no una
 * medida en píxeles porque la decisión se toma en el servidor, donde no se sabe cuántas
 * líneas va a ocupar. Por debajo de esto, un "ver más" sería ruido.
 */
const LARGO_QUE_MERECE_RECORTE = 320

export function Testimonios({
  testimonios,
  textos,
}: {
  testimonios: Testimonio[]
  textos: Textos
}) {
  if (testimonios.length === 0) return null

  return (
    <Seccion id="testimonios">
      <EncabezadoSeccion titulo={texto(textos, 'testimonios.titulo')} acento="red" />

      <ul className="mt-10 grid items-start gap-5 md:grid-cols-2">
        {testimonios.map((testimonio, indice) => (
          <li
            key={`${testimonio.autor}-${indice}`}
            data-reveal
            style={{ '--reveal-delay': `${(indice % 2) * 110}ms` } as React.CSSProperties}
          >
            <figure className="brand-card h-full border border-border p-7">
              <figcaption className="flex items-center gap-4">
                <Retrato testimonio={testimonio} />
                <div className="min-w-0">
                  <p className="font-display font-bold tracking-tight">{testimonio.autor}</p>
                  {testimonio.rol ? (
                    <p className="text-sm text-muted-foreground">{testimonio.rol}</p>
                  ) : null}
                </div>
              </figcaption>

              <Cita texto={testimonio.texto} />

              {testimonio.url ? (
                <a
                  href={testimonio.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-1.5 font-subtitle text-sm font-semibold text-brand-blue transition-colors hover:text-brand-purple"
                >
                  {copy.sponsors.verPublicacion}
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              ) : null}
            </figure>
          </li>
        ))}
      </ul>
    </Seccion>
  )
}

/**
 * El texto de la cita. Si es largo, se recorta dentro de un `<details>` nativo.
 *
 * El `<span>` de dentro del `<summary>` no es un `<p>` a propósito: el modelo de
 * contenido de `<summary>` solo admite contenido de frase, y un párrafo ahí es HTML
 * inválido aunque los navegadores lo perdonen.
 */
function Cita({ texto }: { texto: string }) {
  if (texto.length <= LARGO_QUE_MERECE_RECORTE) {
    return <blockquote className="mt-5 leading-relaxed text-muted-foreground">{texto}</blockquote>
  }

  return (
    <details className="mt-5">
      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="texto-recortado leading-relaxed text-muted-foreground">{texto}</span>
        <span className="mt-3 block font-subtitle text-sm font-semibold text-brand-purple">
          <span className="solo-cerrado">{copy.sponsors.verMas}</span>
          <span className="solo-abierto">{copy.sponsors.verMenos}</span>
        </span>
      </summary>
    </details>
  )
}

/**
 * Foto del autor, o sus iniciales si no hay foto.
 *
 * La foto lleva el nombre como texto alternativo: si el archivo no carga, el navegador
 * escribe el nombre en vez de dejar un cuadro roto.
 */
function Retrato({ testimonio }: { testimonio: Testimonio }) {
  if (testimonio.foto) {
    return (
      <img
        src={assetPublico(testimonio.foto)}
        alt={testimonio.autor}
        loading="lazy"
        decoding="async"
        // Obligatorio: las fotos de Google Drive se sirven con 429 si el navegador manda
        // `Referer` desde localhost. Ver lib/sheets/imagenes.ts.
        referrerPolicy="no-referrer"
        className="size-12 shrink-0 rounded-full border border-border object-cover"
      />
    )
  }

  return (
    <span
      aria-hidden
      className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-purple/15 font-display font-bold text-brand-purple"
    >
      {iniciales(testimonio.autor)}
    </span>
  )
}
