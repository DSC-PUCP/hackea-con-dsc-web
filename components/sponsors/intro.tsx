import { Seccion } from '@/components/sponsors/piezas'
import { parrafos, texto } from '@/lib/sponsors/textos'
import type { Textos } from '@/lib/sponsors/types'
import { cn } from '@/lib/utils'

/**
 * Qué es Hack with DSC, contado para una empresa.
 *
 * Va en dos columnas en escritorio —título a la izquierda, cuerpo a la derecha— porque
 * es el bloque de texto más largo de la página y una sola columna de ese ancho se lee
 * mal. En móvil se apila solo.
 *
 * El primer párrafo va más grande y en blanco, como la entradilla de un artículo: quien
 * lee en diagonal se queda con esa frase, y el resto es para quien quiere el detalle. Es
 * lo que reemplaza al chevron decorativo y al halo que tenía antes: jerarquía en vez de
 * adorno.
 *
 * El título se queda fijo mientras se lee el cuerpo (`sticky`), solo en escritorio, que
 * es donde el cuerpo es más alto que el título.
 */
export function Intro({ textos }: { textos: Textos }) {
  const titulo = texto(textos, 'intro.titulo')
  const cuerpo = texto(textos, 'intro.cuerpo')

  if (!titulo && !cuerpo) return null

  return (
    <Seccion id="el-programa">
      <div className="grid gap-8 border-t border-border pt-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-14 lg:pt-14">
        <div>
          {titulo ? (
            <h2
              data-reveal
              className="font-display text-3xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-4xl lg:sticky lg:top-28 lg:text-[2.75rem]"
            >
              {titulo}
            </h2>
          ) : null}
        </div>

        {cuerpo ? (
          <div>
            {parrafos(cuerpo).map((parrafo, indice) => (
              <p
                key={indice}
                data-reveal
                style={{ '--reveal-delay': `${indice * 70}ms` } as React.CSSProperties}
                className={cn(
                  'leading-relaxed text-pretty',
                  indice === 0
                    ? 'text-lg text-foreground lg:text-xl'
                    : 'mt-5 text-base text-muted-foreground lg:text-lg',
                )}
              >
                {parrafo}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </Seccion>
  )
}
