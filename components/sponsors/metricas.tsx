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
 */
export function Metricas({ metricas }: { metricas: Metrica[] }) {
  if (metricas.length === 0) return null

  return (
    <Seccion aria={copy.sponsors.metricasAria} className="py-6 md:py-10">
      <ul className="flex flex-wrap gap-4">
        {metricas.map((metrica, indice) => (
          <li
            key={`${metrica.etiqueta}-${indice}`}
            data-reveal
            style={{ '--reveal-delay': `${indice * 90}ms` } as React.CSSProperties}
            // basis fija + grow: con 2, 3 o 5 métricas la fila se reparte sola y nunca
            // queda una tarjeta huérfana ocupando el ancho completo.
            className="brand-card min-w-0 flex-1 basis-[13rem] border border-border p-6"
          >
            <p className="font-display text-3xl font-extrabold tracking-tight text-brand-gradient sm:text-4xl">
              {metrica.valor}
            </p>
            <p className="mt-2 font-subtitle text-sm font-semibold">{metrica.etiqueta}</p>
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
