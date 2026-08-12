import { EncabezadoSeccion, Seccion } from '@/components/sponsors/piezas'
import { assetPublico } from '@/lib/site-url'
import { texto } from '@/lib/sponsors/textos'
import type { Aliado, Textos } from '@/lib/sponsors/types'

/**
 * Muro de logos de las empresas que ya acompañaron alguna edición.
 *
 * Tres detalles que parecen menores y no lo son:
 *
 *  · **Los logos van sobre un fondo claro** (`caja-logo`). Muchos logos corporativos son
 *    PNG con fondo blanco: sobre el fondo tinta del sitio se ven como recortes rotos.
 *  · **El texto alternativo es el nombre de la empresa.** Si la imagen no carga, el
 *    navegador pinta ese texto solo: nunca queda un cuadro roto, y no hace falta ni una
 *    línea de JavaScript para conseguirlo.
 *  · Se usa `<img>` y no `next/image` porque los logos pueden venir como URL absoluta
 *    desde la hoja, con dimensiones desconocidas. Con `images.unoptimized: true` —que es
 *    deliberado, ver next.config.mjs— `next/image` generaría exactamente el mismo HTML.
 */
export function Aliados({ aliados, textos }: { aliados: Aliado[]; textos: Textos }) {
  if (aliados.length === 0) return null

  return (
    <Seccion id="aliados">
      <EncabezadoSeccion titulo={texto(textos, 'aliados.titulo')} acento="blue" />

      <div className="mt-10 space-y-10">
        {agruparPorEdicion(aliados).map((grupo) => (
          <div key={grupo.edicion || 'sin-edicion'}>
            {grupo.edicion ? (
              <p
                data-reveal
                className="font-subtitle text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase"
              >
                {grupo.edicion}
              </p>
            ) : null}

            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {grupo.aliados.map((aliado, indice) => (
                <li
                  key={`${aliado.nombre}-${indice}`}
                  data-reveal
                  style={{ '--reveal-delay': `${indice * 60}ms` } as React.CSSProperties}
                >
                  <Marco url={aliado.url}>
                    {aliado.logo ? (
                      <img
                        src={assetPublico(aliado.logo)}
                        alt={aliado.nombre}
                        loading="lazy"
                        decoding="async"
                        // `text-brand-ink` es para cuando la imagen NO carga: el
                        // navegador dibuja el texto alternativo con el color heredado, y
                        // el del sitio es claro — quedaba casi invisible sobre la caja
                        // clara del logo. Comprobado con un archivo inexistente.
                        className="max-h-12 max-w-full object-contain text-center font-subtitle text-sm font-semibold text-brand-ink"
                      />
                    ) : (
                      <span className="text-center font-subtitle text-sm font-semibold text-brand-ink">
                        {aliado.nombre}
                      </span>
                    )}
                  </Marco>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Seccion>
  )
}

/** La caja clara del logo. Es un enlace solo si la hoja trae `url`. */
function Marco({ url, children }: { url: string | null; children: React.ReactNode }) {
  const clases =
    'caja-logo flex h-24 items-center justify-center rounded-2xl p-5 transition-transform duration-300'

  if (!url) return <div className={clases}>{children}</div>

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`${clases} hover:-translate-y-1`}
    >
      {children}
    </a>
  )
}

/**
 * Agrupa por `edicion` conservando el orden en que vienen los aliados (que ya es el de
 * la columna `orden`). Los que no traen edición quedan en un grupo sin rótulo, y una
 * hoja donde nadie llenó esa columna se pinta como un muro liso, que es lo correcto.
 */
function agruparPorEdicion(aliados: Aliado[]) {
  const grupos: { edicion: string; aliados: Aliado[] }[] = []

  for (const aliado of aliados) {
    const edicion = aliado.edicion ?? ''
    const existente = grupos.find((grupo) => grupo.edicion === edicion)
    if (existente) existente.aliados.push(aliado)
    else grupos.push({ edicion, aliados: [aliado] })
  }

  return grupos
}
