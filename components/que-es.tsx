import { MessageCircle } from 'lucide-react'

import { BrandIcon, Chevron, type BrandIconName } from '@/components/brand/icons'
import { copy, formatos, links, pilares, type BrandColor } from '@/lib/site-config'

/**
 * Mapa de color de marca → clases de Tailwind.
 *
 * Existe porque Tailwind analiza el código en busca de nombres de clase completos: si
 * se armara la clase con plantillas (`text-brand-${color}`), Tailwind no la vería y no
 * generaría el CSS. Cada color de `formatos` en lib/site-config.ts necesita su entrada
 * acá.
 */
const clasesPorColor = {
  blue: {
    icono: 'text-brand-blue',
    halo: 'bg-brand-blue/12',
    borde: 'group-hover:border-brand-blue/45',
  },
  purple: {
    icono: 'text-brand-purple',
    halo: 'bg-brand-purple/12',
    borde: 'group-hover:border-brand-purple/45',
  },
  red: {
    icono: 'text-brand-red',
    halo: 'bg-brand-red/12',
    borde: 'group-hover:border-brand-red/45',
  },
} satisfies Record<BrandColor, { icono: string; halo: string; borde: string }>

export function QueEs() {
  return (
    <section id="que-es" className="relative isolate scroll-mt-24 overflow-hidden">
      {/* Un halo tenue detrás de la sección, para que no sea un rectángulo plano. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="glow-purple absolute top-[-10%] left-1/2 size-[46rem] max-w-[140vw] -translate-x-1/2 opacity-40" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-24 md:px-6 md:py-32">
        {/* ── Encabezado ────────────────────────────────────────────────────── */}
        <div className="max-w-3xl">
          <p
            data-reveal
            className="flex items-center gap-2.5 font-subtitle text-xs font-semibold tracking-[0.2em] text-brand-green uppercase"
          >
            <Chevron dir="right" className="h-3 w-auto" />
            {copy.queEs.eyebrow}
          </p>

          <h2
            data-reveal
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
            className="mt-5 font-display text-3xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl"
          >
            {copy.queEs.titulo}
          </h2>

          <p
            data-reveal
            style={{ '--reveal-delay': '160ms' } as React.CSSProperties}
            className="mt-6 text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
          >
            {copy.queEs.intro}
          </p>
        </div>

        {/* ── La cita que resume el propósito ───────────────────────────────── */}
        <figure
          data-reveal
          style={{ '--reveal-delay': '220ms' } as React.CSSProperties}
          className="relative mt-12 max-w-3xl border-l-2 border-brand-purple pl-6 md:pl-8"
        >
          <blockquote className="font-display text-xl leading-snug font-bold text-balance sm:text-2xl">
            <span className="text-brand-gradient">“</span>
            {copy.queEs.cita}
            <span className="text-brand-gradient">”</span>
          </blockquote>
        </figure>

        {/* ── Los tres formatos ─────────────────────────────────────────────── */}
        <h3
          data-reveal
          className="mt-20 font-display text-2xl font-extrabold tracking-tight sm:text-3xl"
        >
          {copy.queEs.formatosTitulo}
        </h3>

        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {formatos.map((formato, indice) => {
            const clases = clasesPorColor[formato.color]

            return (
              <li
                key={formato.id}
                data-reveal
                style={{ '--reveal-delay': `${indice * 110}ms` } as React.CSSProperties}
                className="group"
              >
                <div
                  className={`brand-card h-full border border-border p-7 transition-all duration-300 group-hover:-translate-y-1.5 ${clases.borde}`}
                >
                  <span
                    className={`inline-flex size-12 items-center justify-center rounded-xl ${clases.halo}`}
                  >
                    <BrandIcon
                      name={formato.icon satisfies BrandIconName}
                      className={`h-5 w-auto ${clases.icono}`}
                    />
                  </span>

                  <h4 className="mt-5 font-display text-xl font-bold tracking-tight">
                    {formato.titulo}
                  </h4>
                  <p className="mt-2.5 leading-relaxed text-muted-foreground">
                    {formato.descripcion}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>

        {/* ── Los cuatro pilares ────────────────────────────────────────────── */}
        <div className="mt-24">
          <p
            data-reveal
            className="flex items-center gap-2.5 font-subtitle text-xs font-semibold tracking-[0.2em] text-brand-blue uppercase"
          >
            <Chevron dir="right" className="h-3 w-auto" />
            {copy.queEs.pilaresEyebrow}
          </p>

          <h3
            data-reveal
            style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
            className="mt-5 max-w-2xl font-display text-2xl font-extrabold tracking-tight text-balance sm:text-3xl"
          >
            {copy.queEs.pilaresTitulo}
          </h3>

          <ol className="mt-10 grid gap-x-10 gap-y-9 sm:grid-cols-2">
            {pilares.map((pilar, indice) => (
              <li
                key={pilar.titulo}
                data-reveal
                style={{ '--reveal-delay': `${indice * 90}ms` } as React.CSSProperties}
                className="flex gap-5 border-t border-border pt-6"
              >
                <span
                  aria-hidden
                  className="font-display text-2xl font-extrabold tabular-nums text-brand-purple/50"
                >
                  {String(indice + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-display text-lg font-bold tracking-tight">
                    {pilar.titulo}
                  </h4>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {pilar.descripcion}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* ── Cierre ────────────────────────────────────────────────────────── */}
        <p
          data-reveal
          className="mt-24 max-w-3xl font-display text-2xl leading-tight font-extrabold text-balance sm:text-4xl"
        >
          {copy.queEs.cierre.antes}{' '}
          <span className="text-brand-green">{copy.queEs.cierre.destacado}</span>{' '}
          {copy.queEs.cierre.despues}
        </p>

        {/* ── Llamada a la acción ───────────────────────────────────────────── */}
        <div
          data-reveal
          className="brand-card mt-12 flex flex-col gap-7 border border-border p-8 md:flex-row md:items-center md:justify-between md:p-10"
        >
          <div className="max-w-xl">
            <h3 className="font-display text-xl font-extrabold tracking-tight sm:text-2xl">
              {copy.cta.titulo}
            </h3>
            <p className="mt-3 leading-relaxed text-muted-foreground">
              {copy.cta.descripcion}
            </p>
          </div>

          <div className="shrink-0">
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand inline-flex w-full items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-subtitle text-base font-semibold md:w-auto"
            >
              <MessageCircle className="size-5" aria-hidden />
              {copy.cta.boton}
            </a>
            <p className="mt-3 text-center font-subtitle text-xs text-muted-foreground md:text-right">
              {copy.cta.nota}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
