import { Seccion } from '@/components/sponsors/piezas'
import { copy } from '@/lib/site-config'
import type { Metrica } from '@/lib/sponsors/types'

/**
 * Los números duros del programa, justo debajo de la portada: prueba antes que oferta.
 *
 * La sección entera desaparece si la hoja no trae métricas, y ese es el estado normal
 * al principio. Es a propósito: una cifra inventada en una página que se reenvía por
 * WhatsApp es una mentira que ya no se puede recoger.
 *
 * `valor` se pinta tal cual viene ("+30", "10 equipos", "4.2k"). No se formatea ni se
 * hacen cuentas con él.
 *
 * ── Por qué filetes y no tarjetas ────────────────────────────────────────────────────
 * Seis tarjetas con borde degradado y el número en degradado era el molde de cualquier
 * landing de SaaS. Acá se pinta como el cuadro de cifras de un informe: número grande en
 * blanco, un filete encima y nada más. El color lo pone el filete corto de marca, que
 * alterna para que la fila no sea monótona sin convertir cada cifra en un adorno.
 *
 * La rejilla no deja huérfanos feos aunque el total no sea múltiplo de tres: como las
 * celdas no son cajas, un hueco al final de la última fila se lee como aire.
 */
const filetes = ['bg-brand-red', 'bg-brand-purple', 'bg-brand-blue', 'bg-brand-green'] as const

export function Metricas({ metricas }: { metricas: Metrica[] }) {
  if (metricas.length === 0) return null

  return (
    <Seccion aria={copy.sponsors.metricasAria} className="py-10 md:py-14">
      <ul className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-12 lg:gap-y-12">
        {metricas.map((metrica, indice) => (
          <li
            key={`${metrica.etiqueta}-${indice}`}
            data-reveal
            style={{ '--reveal-delay': `${(indice % 3) * 90}ms` } as React.CSSProperties}
            className="relative min-w-0 border-t border-border pt-5"
          >
            <span
              aria-hidden
              className={`absolute -top-px left-0 h-0.5 w-10 ${filetes[indice % filetes.length]}`}
            />
            <p className="font-display text-[2rem] leading-none font-extrabold tracking-tight sm:text-5xl">
              {metrica.valor}
            </p>
            <p className="mt-3 font-subtitle text-sm font-semibold">{metrica.etiqueta}</p>
            {metrica.nota ? (
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {metrica.nota}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </Seccion>
  )
}
