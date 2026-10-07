import { BookOpen, Eye, MapPin, Trophy, Users } from 'lucide-react'

import { EncabezadoSeccion, Seccion } from '@/components/sponsors/piezas'
import { texto } from '@/lib/sponsors/textos'
import type { Activo, IconoActivo, Textos } from '@/lib/sponsors/types'

/**
 * Mapa clave de la hoja → icono.
 *
 * Las claves son las que la columna `icono` de la pestaña `Activos` puede traer. Si la
 * hoja escribe cualquier otra cosa, el validador deja el icono en `null` y la tarjeta se
 * pinta sin él: una clave mal escrita no puede costar una fila entera de contenido.
 *
 * Son iconos de lucide y no de `components/brand/icons.tsx` porque estos tres conceptos
 * no existen en la lámina de identidad visual: los de marca son las formas macizas de
 * los tres formatos del programa, y estirarlos a otros significados los desgasta.
 */
const iconosPorClave = {
  visibilidad: Eye,
  comunidad: Users,
  premio: Trophy,
  campus: MapPin,
  contenido: BookOpen,
} satisfies Record<IconoActivo, React.ComponentType<{ className?: string }>>

/**
 * Qué ofrecemos: las piezas con las que se arma una alianza.
 *
 * Antes eran tres tarjetas con borde degradado e icono en un cuadradito tintado, el molde
 * de cualquier landing. Ahora cada pieza es una columna abierta con la barra de póster
 * de la pieza 2 reducida a filete: el mismo degradado azul → morado → magenta y la misma
 * sombra maciza, a la escala de una regla. Es el eco más chico posible del recurso
 * firma, y por eso cabe en una página de traje.
 */
export function Activos({ activos, textos }: { activos: Activo[]; textos: Textos }) {
  if (activos.length === 0) return null

  const titulo = texto(textos, 'activos.titulo')
  const intro = texto(textos, 'activos.intro')

  return (
    <Seccion id="que-ofrecemos">
      <EncabezadoSeccion titulo={titulo} intro={intro} />

      <ul className="mt-12 grid gap-x-10 gap-y-12 md:grid-cols-3 lg:mt-14">
        {activos.map((activo, indice) => {
          const Icono = activo.icono ? iconosPorClave[activo.icono] : null

          return (
            <li
              key={activo.id}
              data-reveal
              style={{ '--reveal-delay': `${indice * 110}ms` } as React.CSSProperties}
            >
              {/*
                La sombra se reescribe con `!` porque la de `barra-poster` (0.6rem) está
                pensada para una barra de 4rem de alto: bajo un filete de 8px se leería
                como una segunda barra. Es la misma sombra maciza, a escala.
              */}
              <span
                aria-hidden
                className="barra-poster block h-2 rounded-full shadow-[0_0.3rem_0_0_var(--barra-sombra)]!"
              />

              <h3 className="mt-7 flex items-center gap-3 font-display text-xl font-bold tracking-tight">
                {Icono ? <Icono className="size-5 shrink-0 text-brand-green" /> : null}
                {activo.titulo}
              </h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{activo.descripcion}</p>
            </li>
          )
        })}
      </ul>
    </Seccion>
  )
}
