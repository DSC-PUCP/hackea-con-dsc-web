import { ArrowUpRight, Award, Code2, ExternalLink, FileText, Play, Trophy } from 'lucide-react'

import { Medio } from '@/components/dsc-hack/medio'
import { copy, recapDscHack } from '@/lib/site-config'
import type { EnlaceProyecto, ProyectoRecap } from '@/lib/dsc-hack/types'
import { cn } from '@/lib/utils'

const iconosEnlace = { demo: ExternalLink, repositorio: Code2, presentacion: FileText, video: Play }
const clasesPremio = {
  primero: 'sticker-verde',
  segundo: 'sticker-azul',
  'chaotic-good': 'sticker-rojo',
}

export function Proyectos() {
  return (
    <section
      id="proyectos"
      aria-labelledby="proyectos-titulo"
      className="mx-auto max-w-6xl px-5 pt-9 pb-16 md:px-6 md:pt-12 md:pb-24"
    >
      <div className="mb-9 grid gap-4 md:grid-cols-[1fr_1fr] md:items-end md:gap-12">
        <div>
          <p className="font-subtitle text-xs font-semibold tracking-[0.16em] text-brand-green uppercase">
            {copy.dscHack.catalogoEtiqueta}
          </p>
          <h2
            id="proyectos-titulo"
            className="mt-3 font-display text-4xl leading-tight font-extrabold tracking-tight sm:text-5xl"
          >
            {copy.dscHack.proyectosTitulo}
          </h2>
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          {copy.dscHack.proyectosIntro}
        </p>
      </div>

      <ul className="grid gap-5 md:grid-cols-2 md:gap-6">
        {recapDscHack.proyectos.map((proyecto) => (
          <li
            key={proyecto.id}
            className={cn('min-w-0', proyecto.premio === 'primero' && 'md:col-span-2')}
          >
            <FichaProyecto proyecto={proyecto} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function FichaProyecto({ proyecto }: { proyecto: ProyectoRecap }) {
  const primero = proyecto.premio === 'primero'
  const premio = proyecto.premio ? copy.dscHack.premios[proyecto.premio] : null
  const IconoPremio = primero ? Trophy : Award

  return (
    <article
      id={proyecto.id}
      className={cn(
        'recap-proyecto flex h-full flex-col p-6 sm:p-8',
        primero && 'recap-proyecto-principal md:grid md:grid-cols-[1.15fr_1fr] md:gap-x-12 lg:p-10',
      )}
    >
      <div>
        {proyecto.premio && premio ? (
          <p
            className={cn(
              'etiqueta-sticker mb-6 inline-flex items-center gap-2 px-3 py-1.5 font-subtitle text-xs font-bold uppercase',
              clasesPremio[proyecto.premio],
            )}
          >
            <IconoPremio className="size-4" aria-hidden />
            {premio.etiqueta}
          </p>
        ) : null}
        <p className="font-subtitle text-xs font-medium tracking-wide text-muted-foreground">
          {copy.dscHack.equipo} {proyecto.equipo}
        </p>
        <h3 className={cn('mt-2 font-display text-3xl font-extrabold tracking-tight', primero && 'sm:text-5xl')}>
          {proyecto.nombre}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:leading-7">
          {proyecto.descripcion}
        </p>
        {primero && premio ? (
          <p className="mt-5 font-subtitle text-xs text-brand-green">{premio.detalle}</p>
        ) : null}
      </div>

      <div className={cn('mt-7 flex flex-1 flex-col', primero && 'md:mt-0 md:border-l md:border-border md:pl-10')}>
        <h4 className="font-subtitle text-xs font-semibold tracking-wide text-foreground">
          {copy.dscHack.integrantes}
        </h4>
        <ul className="mt-3 space-y-1.5">
          {proyecto.integrantes.map((persona) => (
            <li key={persona.nombre} className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {persona.linkedin ? (
                <a
                  href={persona.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${persona.nombre} ${copy.dscHack.linkedinAria}`}
                  className="inline-flex min-h-8 items-center gap-1.5 underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-brand-purple"
                >
                  {persona.nombre}
                  <ArrowUpRight className="size-3 shrink-0" aria-hidden />
                </a>
              ) : (
                <span className="inline-flex min-h-8 items-center">{persona.nombre}</span>
              )}
            </li>
          ))}
        </ul>
        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4">
          {proyecto.enlaces.map((enlace) => (
            <Recurso key={enlace.tipo} enlace={enlace} proyecto={proyecto} />
          ))}
        </ul>
      </div>

      {proyecto.medios?.length ? (
        <div className="mt-6 grid gap-4 md:col-span-2">
          {proyecto.medios.map((medio) => (
            <Medio
              key={medio.src}
              medio={medio}
              className={medio.tipo === 'foto' ? 'aspect-video' : undefined}
            />
          ))}
        </div>
      ) : null}
    </article>
  )
}

function Recurso({ enlace, proyecto }: { enlace: EnlaceProyecto; proyecto: ProyectoRecap }) {
  const Icono = iconosEnlace[enlace.tipo]
  const etiqueta = copy.dscHack.enlaces[enlace.tipo]

  return (
    <li>
      <a
        href={enlace.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={copy.dscHack.enlaceAria(etiqueta, proyecto.nombre, proyecto.equipo)}
        className="inline-flex min-h-10 items-center gap-2 font-subtitle text-xs font-semibold transition-colors hover:text-brand-green sm:text-sm"
      >
        <Icono className="size-4" aria-hidden />
        {etiqueta}
      </a>
    </li>
  )
}
