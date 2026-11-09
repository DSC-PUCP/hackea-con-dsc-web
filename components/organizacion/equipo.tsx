import Image from 'next/image'

import type { Persona } from '@/lib/eventos/types'
import { iniciales } from '@/lib/iniciales'
import { aportesOrganizacion, copy } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'

export function Equipo({ personas }: { personas: Persona[] }) {
  const destacados = personas.filter((persona) => aportesOrganizacion[persona.id]?.reconocimiento)
  const equipo = personas.filter((persona) => !aportesOrganizacion[persona.id]?.reconocimiento)
  const texto = copy.organizacion

  return (
    <div className="mx-auto max-w-6xl space-y-20 px-5 py-16 md:space-y-24 md:px-6 md:py-24">
      {destacados.length > 0 ? (
        <section aria-labelledby="menciones-titulo">
          <div className="mb-8 max-w-2xl" data-reveal>
            <h2 id="menciones-titulo" className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
              {texto.destacadosTitulo}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{texto.destacadosIntro}</p>
          </div>
          <ul className="grid gap-4 md:grid-cols-2">
            {destacados.map((persona) => <Ficha key={persona.id} persona={persona} destacada />)}
          </ul>
        </section>
      ) : null}
      {equipo.length > 0 ? (
        <section aria-labelledby="equipo-titulo">
          <div className="mb-8 max-w-2xl" data-reveal>
            <h2 id="equipo-titulo" className="font-display text-3xl font-extrabold tracking-tight md:text-4xl">
              {texto.equipoTitulo}
            </h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{texto.equipoIntro}</p>
          </div>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {equipo.map((persona) => <Ficha key={persona.id} persona={persona} />)}
          </ul>
        </section>
      ) : null}
    </div>
  )
}

function Ficha({ persona, destacada = false }: { persona: Persona; destacada?: boolean }) {
  const aporte = aportesOrganizacion[persona.id]
  const texto = copy.organizacion
  const perfiles = [
    { nombre: texto.linkedin, url: persona.linkedin },
    { nombre: texto.github, url: persona.github },
  ].filter((perfil): perfil is typeof perfil & { url: string } => Boolean(perfil.url))

  return (
    <li data-reveal className={destacada
      ? 'rounded-2xl border border-brand-purple/35 bg-card p-5 md:p-6'
      : 'border-t border-border py-6'}>
      <div className="flex items-start gap-4">
        <div className="relative grid size-16 shrink-0 place-items-center overflow-hidden rounded-full border border-brand-purple/30 bg-brand-purple/10 font-subtitle text-xl font-bold text-brand-light">
          {/* Las iniciales quedan detrás: también se leen si un proveedor de fotos falla. */}
          <span aria-hidden>{iniciales(persona.nombre)}</span>
          {persona.foto ? (
            <Image src={assetPublico(persona.foto)} alt="" width={64} height={64}
              sizes="64px" className="absolute inset-0 size-full object-cover" />
          ) : null}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-snug font-bold text-pretty">{persona.nombre}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            {aporte?.aporte ?? texto.aporteGeneral}
          </p>
          {perfiles.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {perfiles.map((perfil) => (
                <li key={perfil.nombre}>
                  <a href={perfil.url} target="_blank" rel="noopener noreferrer"
                    aria-label={texto.perfilAria(perfil.nombre, persona.nombre)}
                    className="font-subtitle text-sm underline decoration-brand-purple underline-offset-4 transition-colors hover:text-brand-light">
                    {perfil.nombre}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      {destacada && aporte?.reconocimiento ? (
        <p className="mt-5 border-t border-brand-purple/20 pt-4 text-sm leading-relaxed text-brand-light/90">
          {aporte.reconocimiento}
        </p>
      ) : null}
    </li>
  )
}
