import { assetPublico } from '@/lib/site-url'
import type { Evento, Persona, Rol } from '@/lib/eventos/types'
import { iniciales } from '@/lib/iniciales'

/**
 * Quién participa en un evento, dentro de su tarjeta.
 *
 * ── El problema que resuelve ─────────────────────────────────────────────────────────
 * Los eventos de este programa no se parecen entre sí. Un taller tiene un ponente. Una
 * hackathon tiene tres ponentes, seis mentores y cuatro jurados: trece personas. Pintarlos
 * todos igual da uno de estos dos resultados malos, según cuál se elija:
 *
 *  · con la ficha completa de cada persona, la hackathon ocupa media pantalla de móvil y
 *    entierra al resto de la agenda;
 *  · con solo un contador («13 participantes»), el taller pierde lo único que hace que
 *    alguien se apunte, que es ver de quién va a aprender.
 *
 * Así que la tarjeta cambia de forma según cuánta gente haya:
 *
 *   1–3 personas  →  ficha por persona: foto, nombre y cargo. Se lee cada una.
 *   4 o más       →  una pila de fotos superpuestas por rol, con el conteo al lado.
 *
 * El umbral está en `DETALLE_HASTA`. La pila ocupa lo mismo con cuatro personas que con
 * veinte, así que ninguna hackathon puede romper la maqueta por muchos jurados que sume.
 *
 * ── Nada es obligatorio ──────────────────────────────────────────────────────────────
 * Un rol vacío no se menciona (no existe «0 mentores»); un evento sin nadie no pinta esta
 * zona; una persona sin foto sale con sus iniciales; una sin LinkedIn sale sin enlace.
 * Durante media planificación esto va a estar a medio llenar, y esa es la situación
 * normal, no el caso raro.
 */

/** Hasta acá se muestra la ficha de cada persona. Desde acá, la pila compacta. */
const DETALLE_HASTA = 3

/** Cuántas caras se ven en la pila antes del «+N». Cinco caben en 320 px de ancho. */
const CARAS_EN_LA_PILA = 5

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

/** Para el conteo de la pila: «6 en mentoría» se lee mal; «Mentoría · 6», bien. */
export function Personas({ evento }: { evento: Evento }) {
  const grupos = (['ponentes', 'mentores', 'jurados'] as const)
    .map((rol) => ({ rol, personas: evento[rol] }))
    .filter((grupo) => grupo.personas.length > 0)

  if (grupos.length === 0) return null

  const total = grupos.reduce((suma, grupo) => suma + grupo.personas.length, 0)
  const compacto = total > DETALLE_HASTA

  return (
    <div className="mt-5 space-y-3 border-t border-border/70 pt-4">
      {grupos.map(({ rol, personas }) =>
        compacto ? (
          <PilaDeCaras key={rol} rol={rol} personas={personas} />
        ) : (
          <FichasDePersonas key={rol} rol={rol} personas={personas} />
        ),
      )}
    </div>
  )
}

/** Pocas personas: cada una con su cargo, que es lo que convence a quien duda. */
function FichasDePersonas({ rol, personas }: { rol: Rol; personas: Persona[] }) {
  return (
    <div>
      <Rotulo>{ROTULOS[rol]}</Rotulo>

      <ul className="mt-2 space-y-2">
        {personas.map((persona) => (
          <li key={persona.id} className="flex items-center gap-3">
            <Cara persona={persona} />

            <div className="min-w-0">
              <p className="truncate font-subtitle text-sm font-semibold">
                <NombreConEnlace persona={persona} />
              </p>
              {persona.cargo ? (
                <p className="truncate text-xs text-muted-foreground">{persona.cargo}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Muchas personas: caras superpuestas y el número al lado.
 *
 * Los nombres no se pierden — cada cara lleva el nombre como texto alternativo y como
 * `title`, y las que no caben quedan en la etiqueta accesible de la lista. Un lector de
 * pantalla los enumera todos; la vista solo enseña cinco.
 */
function PilaDeCaras({ rol, personas }: { rol: Rol; personas: Persona[] }) {
  const visibles = personas.slice(0, CARAS_EN_LA_PILA)
  const restantes = personas.length - visibles.length

  return (
    <div className="flex items-center gap-3">
      {/*
        `-space-x-2` es lo que las superpone. `ring-card` recorta cada cara contra el fondo
        de la tarjeta: sin ese anillo, dos fotos oscuras contiguas se leen como una mancha.
      */}
      <ul
        className="flex -space-x-2"
        aria-label={`${ROTULOS[rol]}: ${personas.map((p) => p.nombre).join(', ')}`}
      >
        {visibles.map((persona) => (
          <li key={persona.id}>
            <Cara persona={persona} enPila />
          </li>
        ))}

        {restantes > 0 ? (
          <li aria-hidden>
            <span className="flex size-9 items-center justify-center rounded-full bg-muted font-subtitle text-xs font-semibold text-muted-foreground ring-2 ring-card">
              +{restantes}
            </span>
          </li>
        ) : null}
      </ul>

      <p className="font-subtitle text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
        {ROTULOS[rol]} · {personas.length}
      </p>
    </div>
  )
}

function Rotulo({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-subtitle text-xs font-semibold tracking-[0.14em] text-muted-foreground uppercase">
      {children}
    </p>
  )
}

/**
 * La foto, o las iniciales si no hay.
 *
 * `referrerPolicy="no-referrer"` es obligatorio: las fotos vienen de Google Drive, y ese
 * servidor responde 429 cuando el navegador manda `Referer` desde localhost. Ver
 * lib/sheets/imagenes.ts.
 */
function Cara({ persona, enPila = false }: { persona: Persona; enPila?: boolean }) {
  const base = `size-9 shrink-0 rounded-full object-cover ${enPila ? 'ring-2 ring-card' : 'border border-border'}`

  if (persona.foto) {
    return (
      <img
        src={assetPublico(persona.foto)}
        alt={persona.nombre}
        title={persona.nombre}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        className={base}
      />
    )
  }

  return (
    <span
      title={persona.nombre}
      className={`${base} flex items-center justify-center bg-brand-purple/15 font-display text-xs font-bold text-brand-purple`}
    >
      {iniciales(persona.nombre)}
    </span>
  )
}

/** Enlace a LinkedIn si lo hay; si no, el nombre en texto. Nunca un enlace muerto. */
function NombreConEnlace({ persona }: { persona: Persona }) {
  if (!persona.linkedin) return <>{persona.nombre}</>

  return (
    <a
      href={persona.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      className="transition-colors hover:text-brand-blue"
    >
      {persona.nombre}
    </a>
  )
}
