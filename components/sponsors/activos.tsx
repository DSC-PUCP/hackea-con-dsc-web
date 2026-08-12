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

export function Activos({ activos, textos }: { activos: Activo[]; textos: Textos }) {
  if (activos.length === 0) return null

  const titulo = texto(textos, 'activos.titulo')
  const intro = texto(textos, 'activos.intro')

  return (
    <Seccion id="que-ofrecemos">
      <EncabezadoSeccion titulo={titulo} intro={intro} acento="green" />

      <ul className="mt-12 grid gap-5 md:grid-cols-3">
        {activos.map((activo, indice) => {
          const Icono = activo.icono ? iconosPorClave[activo.icono] : null

          return (
            <li
              key={activo.id}
              data-reveal
              style={{ '--reveal-delay': `${indice * 110}ms` } as React.CSSProperties}
              className="group"
            >
              <div className="brand-card h-full border border-border p-7 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-brand-purple/45">
                {Icono ? (
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-purple/12">
                    <Icono className="size-5 text-brand-purple" />
                  </span>
                ) : null}

                <h3 className="mt-5 font-display text-xl font-bold tracking-tight">
                  {activo.titulo}
                </h3>
                <p className="mt-2.5 leading-relaxed text-muted-foreground">
                  {activo.descripcion}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </Seccion>
  )
}
