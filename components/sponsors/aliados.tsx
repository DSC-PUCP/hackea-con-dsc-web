import { Seccion } from '@/components/sponsors/piezas'
import { assetPublico } from '@/lib/site-url'
import { texto } from '@/lib/sponsors/textos'
import type { Aliado, Textos } from '@/lib/sponsors/types'

/**
 * Muro de logos de las empresas que ya acompañaron alguna edición.
 *
 * Tres detalles que parecen menores y no lo son:
 *
 *  · **Los logos van directos sobre el fondo del sitio**, sin recuadro claro detrás. Es
 *    una decisión de diseño, y tiene una consecuencia que hay que conocer: un logo que
 *    llegue en JPEG o en PNG **con fondo blanco sólido** se va a ver como un rectángulo
 *    blanco. La solución es el archivo —pedir el logo en PNG o SVG con transparencia—,
 *    no el CSS. Lo mismo con un logo oscuro: sobre fondo tinta no se lee, y hay que
 *    pedir la versión para fondos oscuros.
 *  · **El texto alternativo es el nombre de la empresa.** Si la imagen no carga, el
 *    navegador pinta ese texto solo: nunca queda un cuadro roto, y no hace falta ni una
 *    línea de JavaScript para conseguirlo.
 *  · Se usa `<img>` y no `next/image` porque los logos pueden venir como URL absoluta
 *    desde la hoja, con dimensiones desconocidas. Con `images.unoptimized: true` —que es
 *    deliberado, ver next.config.mjs— `next/image` generaría exactamente el mismo HTML.
 */
export function Aliados({ aliados, textos }: { aliados: Aliado[]; textos: Textos }) {
  if (aliados.length === 0) return null

  const titulo = texto(textos, 'aliados.titulo')

  /*
   * Maquetado como los créditos de un informe: el título en su columna, y a la derecha
   * una fila por edición con su rótulo y sus logos, separadas por filetes. Así el muro
   * se lee como historial —quién estuvo y en qué— y no como una nube de logos sueltos.
   * En móvil, el título arriba y las filas debajo.
   */
  return (
    <Seccion id="aliados">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:gap-14">
        {titulo ? (
          <h2
            data-reveal
            className="font-display text-3xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]"
          >
            {titulo}
          </h2>
        ) : null}

        <div className="border-b border-border">
          {agruparPorEdicion(aliados).map((grupo) => (
            <div key={grupo.edicion || 'sin-edicion'} className="border-t border-border py-6">
              {grupo.edicion ? (
                <p
                  data-reveal
                  className="font-subtitle text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase"
                >
                  {grupo.edicion}
                </p>
              ) : null}

              {/*
                Ancho fijo por logo y no una rejilla que reparta el espacio: con tres
                aliados, unas columnas elásticas dan huecos anchísimos y bajos, y el logo
                se pierde dentro. Con un ancho fijo los logos se alinean a la izquierda,
                se acomodan solos al ir sumando empresas, y el hueco no cambia de forma.
              */}
              <ul className="mt-2 flex flex-wrap gap-x-4">
                {grupo.aliados.map((aliado, indice) => (
                  <li
                    key={`${aliado.nombre}-${indice}`}
                    data-reveal
                    style={{ '--reveal-delay': `${indice * 60}ms` } as React.CSSProperties}
                    className="w-32"
                  >
                    <Marco url={aliado.url}>
                      {aliado.logo ? (
                        <img
                          src={assetPublico(aliado.logo)}
                          alt={aliado.nombre}
                          loading="lazy"
                          decoding="async"
                          // Obligatorio: los logos de Google Drive se sirven con 429 si el
                          // navegador manda `Referer` desde localhost. Ver lib/sheets/imagenes.ts.
                          referrerPolicy="no-referrer"
                          className="max-h-16 max-w-full object-contain font-subtitle text-sm font-semibold"
                        />
                      ) : (
                        <span className="font-subtitle text-sm font-semibold">
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
      </div>
    </Seccion>
  )
}

/**
 * El hueco donde vive cada logo. Es un enlace solo si la hoja trae `url`.
 *
 * La altura fija es lo que mantiene la fila alineada: los logos llegan con proporciones
 * distintas (cuadrados, apaisados, verticales) y sin una caja común cada uno se sentaría
 * a una altura distinta y el muro se vería descuadrado.
 *
 * El logo va pegado a la izquierda y no centrado en su hueco: así arranca en la misma
 * vertical que el rótulo de la edición, y la fila se lee como una línea de créditos.
 */
function Marco({ url, children }: { url: string | null; children: React.ReactNode }) {
  const clases = 'flex h-24 items-center py-3 pr-6 transition-transform duration-300'

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
