import { assetPublico } from '@/lib/site-url'
import type { Evento, Persona, Rol } from '@/lib/eventos/types'
import { iniciales } from '@/lib/iniciales'

/**
 * Quién participa en un evento.
 *
 * ── El problema que resuelve ─────────────────────────────────────────────────────────
 * Los eventos de este programa no se parecen entre sí. Un taller tiene un ponente. Una
 * hackathon tiene un ponente, seis mentores y cuatro jurados: once personas repartidas en
 * tres papeles que no significan lo mismo. Tratarlos igual sale mal en las dos
 * direcciones — con la ficha completa de cada uno la hackathon entierra la agenda, y con
 * un contador («11 participantes») el taller pierde lo único que hace que alguien se
 * apunte, que es ver de quién va a aprender.
 *
 * ── La forma se decide POR ROL, no por el total ──────────────────────────────────────
 * Esto empezó decidiéndose con la suma de las tres columnas, y estaba mal: en esa misma
 * hackathon, el ponente —que es uno— se pintaba compacto por culpa de los mentores, y se
 * perdía su cargo. Cada rol se mira por separado:
 *
 *   1–3 personas  →  ficha: foto, nombre y cargo. Se lee cada una.
 *   4 o más       →  fichas breves en fila que envuelven: foto y nombre.
 *
 * En la hackathon de arriba eso da: el ponente con su cargo, y mentoría y jurado como dos
 * filas de nombres. Once personas en unas seis líneas, y ninguna anónima.
 *
 * ── Todo el mundo conserva su enlace ─────────────────────────────────────────────────
 * Antes el modo compacto eran caras superpuestas sin nombre y sin enlace: en una
 * hackathon, los jurados —que suelen ser el argumento para presentarse— quedaban como
 * fotos mudas. Ahora **cada persona es un enlace a su LinkedIn en las dos formas**, y en
 * la breve el objetivo pulsable es la ficha entera (foto + nombre), no solo la foto.
 *
 * ── Nada es obligatorio ──────────────────────────────────────────────────────────────
 * Un rol vacío no se menciona (no existe «0 mentores»); un evento sin nadie no pinta esta
 * zona; una persona sin foto sale con sus iniciales; una sin LinkedIn sale sin enlace,
 * pero sigue saliendo. Durante media planificación esto va a estar a medio llenar, y esa
 * es la situación normal, no el caso raro.
 */

/** Hasta acá, ficha con cargo. Desde acá, ficha breve. Se cuenta DENTRO de cada rol. */
const DETALLE_HASTA = 3

/**
 * Rótulos por rol, en formas que no marcan género.
 *
 * «Ponentes», «mentores» y «jurados» en masculino plural es lo que dice la hoja —son
 * nombres de columna, y ahí da igual—, pero en la web se lee a personas concretas. Los
 * sustantivos colectivos («Mentoría», «Jurado») dicen lo mismo sin obligar a elegir.
 */
const ROTULOS: Record<Rol, string> = {
  ponentes: 'A cargo de',
  mentores: 'Mentoría',
  jurados: 'Jurado',
}

export function Personas({ evento }: { evento: Evento }) {
  const grupos = (['ponentes', 'mentores', 'jurados'] as const)
    .map((rol) => ({ rol, personas: evento[rol] }))
    .filter((grupo) => grupo.personas.length > 0)

  if (grupos.length === 0) return null

  return (
    <div className="mt-5 space-y-4 border-t border-border/70 pt-4">
      {grupos.map(({ rol, personas }) => (
        <div key={rol}>
          <p className="font-subtitle text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {ROTULOS[rol]}
            {/*
              El conteo solo cuando hay bastantes. Con dos jurados, «Jurado · 2» es ruido
              —se ven los dos—; con nueve, saber cuántos son antes de contarlos ayuda.
            */}
            {personas.length > DETALLE_HASTA ? (
              <span className="font-medium"> · {personas.length}</span>
            ) : null}
          </p>

          {personas.length > DETALLE_HASTA ? (
            <FichasBreves personas={personas} />
          ) : (
            <FichasConCargo personas={personas} />
          )}
        </div>
      ))}
    </div>
  )
}

/**
 * Pocas personas en el rol: cada una con su cargo, que es lo que convence a quien duda.
 * Es la forma del ponente de un taller y la del jurado de tres de una hackathon chica.
 */
function FichasConCargo({ personas }: { personas: Persona[] }) {
  return (
    <ul className="mt-2 space-y-2">
      {personas.map((persona) => (
        <li key={persona.id}>
          <Enlazada persona={persona} className="group/p flex items-center gap-3">
            <Cara persona={persona} />

            <span className="min-w-0">
              <span className="block truncate font-subtitle text-sm font-semibold transition-colors group-hover/p:text-brand-blue">
                {persona.nombre}
              </span>
              {persona.cargo ? (
                <span className="block truncate text-xs text-muted-foreground">
                  {persona.cargo}
                </span>
              ) : null}
            </span>
          </Enlazada>
        </li>
      ))}
    </ul>
  )
}

/**
 * Muchas personas en el rol: foto y nombre en fichas que envuelven.
 *
 * Sustituye a la pila de caras superpuestas que había antes. La pila ocupaba menos, pero
 * escondía los nombres y no se podía pulsar cada cara sin apuntar a la mitad tapada por
 * la siguiente. Once personas en fichas son unas seis líneas: cuesta cuatro líneas más y
 * a cambio se lee quién es cada quién y se llega a su perfil.
 *
 * El cargo no cabe en la ficha breve, así que va en el `title`: no se pierde, se pospone.
 */
function FichasBreves({ personas }: { personas: Persona[] }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-2">
      {personas.map((persona) => (
        <li key={persona.id}>
          <Enlazada
            persona={persona}
            titulo={persona.cargo ?? undefined}
            className="flex items-center gap-2 rounded-full border border-border/70 bg-card/40 py-1 pr-3.5 pl-1 transition-colors hover:border-brand-blue/45 hover:bg-card"
          >
            <Cara persona={persona} pequena />
            <span className="font-subtitle text-xs font-medium">{persona.nombre}</span>
          </Enlazada>
        </li>
      ))}
    </ul>
  )
}

/**
 * Envuelve a una persona en su enlace a LinkedIn, o en un `<span>` si no tiene.
 *
 * Existe para que las dos formas de ficha compartan exactamente la misma regla y no haya
 * una donde el enlace se olvide. Lo que NO hace es pintar un enlace muerto: sin LinkedIn
 * no hay `<a>`, así que no recibe foco del teclado ni se anuncia como pulsable.
 *
 * El objetivo pulsable es la ficha entera —foto y nombre—, no solo la foto: una foto de
 * 36 px es un blanco incómodo en un teléfono, y el nombre es lo que la gente intenta
 * tocar de todas formas.
 */
function Enlazada({
  persona,
  titulo,
  className,
  children,
}: {
  persona: Persona
  titulo?: string
  className?: string
  children: React.ReactNode
}) {
  if (!persona.linkedin) {
    return (
      <span className={className} title={titulo}>
        {children}
      </span>
    )
  }

  return (
    <a
      href={persona.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      // Sin esto, quien navegue saltando de enlace en enlace oye once veces el nombre a
      // secas y no sabe a dónde va ninguno.
      aria-label={`${persona.nombre} en LinkedIn`}
      title={titulo}
      className={className}
    >
      {children}
    </a>
  )
}

/**
 * La foto, o las iniciales si no hay.
 *
 * `referrerPolicy="no-referrer"` es obligatorio: las fotos vienen de Google Drive, y ese
 * servidor responde 429 cuando el navegador manda `Referer` desde localhost. Ver
 * lib/sheets/imagenes.ts.
 *
 * `aria-hidden` en las iniciales, y el `alt` de la foto vacío: el nombre ya está escrito
 * al lado en las dos formas de ficha, y sin esto un lector de pantalla lo diría dos veces
 * seguidas.
 */
function Cara({ persona, pequena = false }: { persona: Persona; pequena?: boolean }) {
  const tamano = pequena ? 'size-7' : 'size-9'

  if (persona.foto) {
    return (
      <img
        src={assetPublico(persona.foto)}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={`${tamano} shrink-0 rounded-full border border-border object-cover`}
      />
    )
  }

  return (
    <span
      aria-hidden
      className={`${tamano} flex shrink-0 items-center justify-center rounded-full bg-brand-purple/15 font-display text-xs font-bold text-brand-purple`}
    >
      {iniciales(persona.nombre)}
    </span>
  )
}
