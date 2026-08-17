import { Hero } from '@/components/hero'
import { QueEs } from '@/components/que-es'
import { obtenerEventos } from '@/lib/eventos/sheets'


/**
 * Portada del sitio, en `/`.
 *
 * A propósito solo hay DOS secciones: la portada y "Qué es Hack with DSC". No se muestra
 * nada de eventos (agenda, fechas, ponentes, lugares) hasta que la lectura desde Google
 * Sheets con caché esté implementada — ver docs/arquitectura.md §3.
 *
 * El header, el pie y los dos componentes que dan el movimiento están en
 * `app/layout.tsx`, porque los comparten todas las páginas. Acá solo va el contenido.
 */
export default async function Page() {
  const { eventos } = await obtenerEventos()
  return (
    <main>
      <Hero />
      <QueEs />
      <section
        id="eventos"
        className="mx-auto w-full max-w-7xl px-6 py-20"
      >
        <div className="mb-10">
          <p className="text-sm font-medium uppercase tracking-widest opacity-60">
            Hack with DSC
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            Próximos eventos
          </h2>

          <p className="mt-3 max-w-2xl opacity-70">
            Encuentra talleres, hackathons, networking y
            otras actividades organizadas por Hack with DSC.
          </p>
        </div>

        {eventos.length === 0 ? (
          <p className="opacity-60">
            No hay eventos disponibles por el momento.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {eventos.map((evento) => (
              <article
                key={evento.id}
                className="rounded-2xl border p-6"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="rounded-full border px-3 py-1 text-xs">
                    {evento.tipo}
                  </span>

                  {evento.permiteExternos && (
                    <span className="text-xs opacity-60">
                      Abierto a externos
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold">
                  {evento.titulo}
                </h3>

                {evento.infoWeb && (
                  <p className="mt-3 text-sm opacity-70">
                    {evento.infoWeb}
                  </p>
                )}

                <div className="mt-6 space-y-2 text-sm">
                  {evento.fecha && (
                    <p>
                      📅 {evento.fecha}
                    </p>
                  )}

                  {evento.hora && (
                    <p>
                      🕐 {evento.hora}
                    </p>
                  )}

                  {evento.lugar && (
                    <p>
                      📍 {evento.lugar}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  {evento.inscripcion ? (
                    <a
                      href={evento.inscripcion}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex rounded-lg border px-4 py-2 text-sm font-medium transition-opacity hover:opacity-70"
                    >
                      Inscribirme
                    </a>
                  ) : (
                    <span className="text-sm opacity-60">
                      Inscripciones próximamente
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
