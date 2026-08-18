import { ArrowUpRight, ChevronDown } from 'lucide-react'

import { Personas } from '@/components/eventos/personas'
import { fechaCompacta, formatearCuando, grupoDeMes, notaDeFecha } from '@/lib/eventos/fechas'
import type { Evento, TipoEvento } from '@/lib/eventos/types'
import { copy } from '@/lib/site-config'

/**
 * La agenda, como lista agrupada por mes.
 *
 * ── La decisión que ordena todo este archivo ─────────────────────────────────────────
 * **Un evento se despliega en móvil y no se despliega en escritorio.** No es un capricho
 * responsive: es que el desplegable resuelve un problema que solo existe en un teléfono.
 *
 * En móvil, una ficha completa mide ~420 px. Con doce eventos son cinco mil píxeles de
 * scroll y no entra ni uno entero por pantalla, así que hay que esconder cosas y la fila
 * cerrada mide ~88 px. En escritorio hay mil píxeles de ancho y ese problema no existe:
 * ahí esconder la descripción detrás de un clic es esconder por esconder.
 *
 * De la versión anterior —que intentaba las dos cosas con el mismo desplegable— salieron
 * dos defectos que conviene no repetir:
 *
 *  · **la descripción salía dos veces**, recortada en la fila y completa en el panel;
 *  · **el chevron quedaba en medio**, entre el texto y una columna de caras y botón
 *    colgada por fuera, partiendo en dos algo que se lee de corrido.
 *
 * Los dos venían de lo mismo: mantener el desplegable donde no hacía falta. Ahora son dos
 * envoltorios distintos (`<details>` en móvil, un bloque normal en escritorio) sobre las
 * MISMAS piezas de contenido, que están definidas una sola vez más abajo. Cambiar cómo se
 * ve un evento se hace en `Encabezado`, `Detalle` o `BloqueDeFecha`, y vale para los dos.
 *
 * ── Por qué `<details>` y no un acordeón de React ────────────────────────────────────
 * Porque abrir y cerrar ya lo sabe hacer el navegador. Mismo patrón que los testimonios
 * de `/sponsors`: cero JavaScript, cero componentes de cliente, funciona sin hidratar, y
 * el teclado y los lectores de pantalla lo entienden solos.
 *
 * Y de ahí sale la regla que hay que respetar al tocar esto: **dentro de un `<details>`,
 * todo lo que va después del `<summary>` se esconde al cerrar.** Por eso el botón de
 * inscripción —que se ve siempre, también con la fila cerrada— es hermano del `<details>`
 * y no hijo. De regalo evita meter un `<a>` dentro de un `<summary>`, que es HTML
 * inválido y un control que a veces navega y a veces despliega.
 */

/** Los dos estados de una fila. `pasado` cambia el tono y el peso del enlace. */
type Variante = 'proximo' | 'pasado'

export function SeccionDeEventos({
  id,
  titulo,
  intro,
  eventos,
  variante = 'proximo',
}: {
  id?: string
  titulo: string
  intro?: string
  eventos: Evento[]
  variante?: Variante
}) {
  if (eventos.length === 0) return null

  return (
    <section id={id} className="scroll-mt-24">
      {/*
        Un escalón por debajo del `<h1>` de la página (que es `text-4xl sm:text-5xl`), y
        a propósito. Estos rótulos no son títulos que compitan: solo dicen qué subconjunto
        viene debajo —«Próximos eventos», «Ya pasaron»— y con el tamaño anterior se leían
        como un segundo encabezado de página a dos dedos del primero.
      */}
      <h2
        data-reveal
        className="font-display text-xl leading-tight font-extrabold tracking-tight sm:text-2xl"
      >
        {titulo}
      </h2>

      {intro ? (
        <p
          data-reveal
          style={{ '--reveal-delay': '80ms' } as React.CSSProperties}
          className="mt-3 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground"
        >
          {intro}
        </p>
      ) : null}

      <div className={`mt-8 ${variante === 'pasado' ? 'opacity-70' : ''}`}>
        {agruparPorMes(eventos).map((grupo) => (
          <div key={grupo.clave} className="mb-10 last:mb-0">
            {/*
              `sticky` para que, mientras se recorre agosto, el rótulo «Agosto 2026» siga
              a la vista. En una lista de doce eventos de tres meses es lo que evita
              perder el hilo. `top-16` lo deja justo debajo del header fijo.
            */}
            <h3 className="sticky top-16 z-10 -mx-1 bg-background/85 px-1 py-2 font-subtitle text-xs font-semibold tracking-[0.2em] text-brand-blue uppercase backdrop-blur-sm">
              {grupo.rotulo}
            </h3>

            <ul className="mt-2">
              {grupo.eventos.map((evento) => (
                <li key={evento.id} className="border-b border-border/70 last:border-b-0">
                  <FilaDeEvento evento={evento} variante={variante} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

/**
 * Agrupa conservando el orden en que vienen los eventos, que ya es el correcto: por fecha
 * en los próximos, y del más reciente al más antiguo en los pasados. Agrupar no reordena.
 */
function agruparPorMes(eventos: Evento[]) {
  const grupos: { clave: string; rotulo: string; eventos: Evento[] }[] = []

  for (const evento of eventos) {
    const { clave, rotulo } = grupoDeMes(evento.cuando, copy.agenda.sinFechaGrupo)
    const existente = grupos.find((grupo) => grupo.clave === clave)

    if (existente) existente.eventos.push(evento)
    else grupos.push({ clave, rotulo, eventos: [evento] })
  }

  return grupos
}

// ═════════════════════════════════════════════════════════════════════════════════════
// La fila: dos envoltorios, las mismas piezas
// ═════════════════════════════════════════════════════════════════════════════════════

function FilaDeEvento({ evento, variante }: { evento: Evento; variante: Variante }) {
  /*
   * Un evento del que solo se sabe el nombre y la fecha no tiene nada que desplegar, y
   * entonces en móvil NO se pinta como desplegable: sería un chevron que promete algo y
   * abre un hueco vacío. Durante media planificación la hoja está justo así.
   */
  const hayDetalle = Boolean(evento.descripcion || tieneGente(evento))

  return (
    <>
      {/* ── Móvil: fila compacta que se despliega ─────────────────────────────────── */}
      <div className="md:hidden">
        {hayDetalle ? (
          <details className="group">
            <summary className="flex cursor-pointer list-none items-start gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <BloqueDeFecha evento={evento} />
              <Encabezado evento={evento} />
              <ChevronDown
                aria-hidden
                className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              />
            </summary>

            {/* `pl-16` alinea el detalle con el título, no con el bloque de fecha: así la
                columna de números se sigue leyendo de arriba abajo con filas abiertas. */}
            <div className="pl-16">
              <Detalle evento={evento} />
            </div>
          </details>
        ) : (
          <div className="flex items-start gap-4 py-4">
            <BloqueDeFecha evento={evento} />
            <Encabezado evento={evento} />
          </div>
        )}

        {/* Fuera del `<details>` a propósito: se ve con la fila cerrada. */}
        <div className="pt-1 pb-4 pl-16">
          <Inscripcion evento={evento} variante={variante} />
        </div>
      </div>

      {/* ── Escritorio: todo a la vista, sin desplegable y sin chevron ────────────── */}
      <div className="hidden gap-6 py-6 md:flex">
        <BloqueDeFecha evento={evento} />

        <div className="min-w-0 flex-1">
          <Encabezado evento={evento} />
          <Detalle evento={evento} />

          <div className="mt-5">
            <Inscripcion evento={evento} variante={variante} />
          </div>
        </div>
      </div>
    </>
  )
}

function tieneGente(evento: Evento): boolean {
  return evento.ponentes.length + evento.mentores.length + evento.jurados.length > 0
}

/**
 * Color de marca por tipo de evento.
 *
 * Los nombres de clase van COMPLETOS, igual que en `clasesPorColor` de
 * components/que-es.tsx y por el mismo motivo: Tailwind busca clases literales en el
 * código, y `text-brand-${color}` no genera ningún CSS.
 *
 * `otro` existe porque la celda `Tipo` es texto libre y siempre aparece un formato nuevo
 * a mitad del programa. Sin esta entrada, un «Mesa redonda» dejaría la fila sin color.
 */
const COLOR_POR_TIPO: Record<TipoEvento, string> = {
  taller: 'text-brand-blue',
  ponencia: 'text-brand-purple',
  hackathon: 'text-brand-red',
  networking: 'text-brand-green',
  otro: 'text-muted-foreground',
}

/**
 * Tipo, quién puede entrar, nombre y —solo si el bloque de fecha se queda corto— una nota
 * sobre cuándo termina.
 *
 * Va TODO en `<span>` y un `<h3>` porque en móvil esto vive dentro de un `<summary>`,
 * cuyo modelo de contenido admite contenido de frase y encabezados, pero **no** `<p>` ni
 * `<div>`. Los navegadores lo perdonan; el HTML sigue siendo inválido. Mismo cuidado que
 * en components/sponsors/testimonios.tsx. Si esta pieza deja de servir para el móvil, esa
 * restricción desaparece — pero mientras se comparta, manda.
 */
function Encabezado({ evento }: { evento: Evento }) {
  const nota = notaDeFecha(evento.cuando, copy.agenda.sinFecha)

  return (
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-baseline gap-x-2 font-subtitle text-xs font-semibold tracking-[0.14em] uppercase">
        {evento.tipoEtiqueta ? (
          <span className={COLOR_POR_TIPO[evento.tipo]}>{evento.tipoEtiqueta}</span>
        ) : null}

        {/*
          En `null` —la hoja dice algo que no es ni sí ni no, como «Maso»— no se muestra
          nada. Mejor callar que arriesgarse a decirle a alguien de fuera que no puede venir.
        */}
        {evento.permiteExternos !== null ? (
          <span className="font-medium tracking-normal text-muted-foreground normal-case">
            {evento.permiteExternos ? copy.agenda.abiertoExternos : copy.agenda.soloPucp}
          </span>
        ) : null}
      </span>

      {/*
        `h4` y no `h3`: el evento cuelga del mes, y el mes es el `h3` de la lista. Con los
        dos en `h3` quedaban como hermanos, y quien navega por encabezados leía el título
        del evento como si no estuviera dentro de ningún mes. La jerarquía completa es
        h1 página → h2 lista → h3 mes → h4 evento. El aspecto no cambia: manda la clase.
      */}
      <h4 className="mt-1 font-display text-base leading-snug font-bold text-pretty sm:text-lg">
        {evento.nombre}
      </h4>

      {nota ? (
        <span className="mt-1 block font-subtitle text-xs text-muted-foreground">{nota}</span>
      ) : null}
    </span>
  )
}

/**
 * Descripción y personas. **Existe una sola vez por fila**: en móvil dentro del panel
 * desplegado, en escritorio siempre visible. Nunca las dos a la vez, que era el defecto
 * de la versión anterior.
 *
 * La descripción va entera y sin recortar. Puede ocupar dos párrafos —en la hoja los
 * hay—, y eso está bien: en móvil solo se ve si la persona decidió abrir la fila, y en
 * escritorio el texto se reparte en un ancho grande, así que dos párrafos son cinco o
 * seis líneas. Recortarla obligaría a un «ver más» dentro de algo que ya se desplegó.
 *
 * `whitespace-pre-line` conserva los saltos de línea de la celda. Es lo que separa los
 * párrafos sin tener que partir el texto ni interpretar nada: la hoja no escribe HTML, y
 * lo que se interpola como texto de React se escapa solo.
 */
function Detalle({ evento }: { evento: Evento }) {
  if (!evento.descripcion && !tieneGente(evento)) return null

  return (
    <div className="mt-3">
      {evento.descripcion ? (
        <p className="text-sm leading-relaxed whitespace-pre-line text-pretty text-muted-foreground">
          {evento.descripcion}
        </p>
      ) : null}

      <Personas evento={evento} />
    </div>
  )
}

/**
 * El bloque de día. Ancho FIJO (`w-14`), y eso es lo que hace legible la lista: la
 * columna de números queda alineada y el ojo la recorre sin leer nada más. Si el ancho
 * dependiera del contenido, un «set» y un «3» descuadrarían la columna entera.
 *
 * Lleva la hora dentro para no gastar una línea aparte en el dato más repetido de la
 * agenda. La fecha completa va en `title`, para quien dude de qué día de la semana es
 * el 20 sin que la fila tenga que decirlo dos veces.
 */
function BloqueDeFecha({ evento }: { evento: Evento }) {
  const { principal, secundario, hora } = fechaCompacta(evento.cuando)

  return (
    <span
      className="w-14 shrink-0 text-center"
      title={formatearCuando(evento.cuando, copy.agenda.sinFecha)}
    >
      <span className="block font-display text-2xl leading-none font-extrabold">{principal}</span>

      {secundario ? (
        <span className="mt-1 block font-subtitle text-xs text-muted-foreground uppercase">
          {secundario}
        </span>
      ) : null}

      {hora ? (
        <span className="mt-1.5 block font-subtitle text-xs font-semibold text-muted-foreground">
          {hora}
        </span>
      ) : null}
    </span>
  )
}

/**
 * El enlace a Luma.
 *
 * En los próximos es un botón: es la acción de la página. En los pasados es un enlace de
 * texto discreto — el evento ya ocurrió, así que invitar a «Inscribirme» sería mentir,
 * pero su página de Luma sigue teniendo la descripción, las fotos y quién fue.
 *
 * Sin enlace se pinta un `<span>` y NO un `<a>` ni un `<button>` desactivado: lo que no
 * lleva a ningún sitio no debe recibir el foco del teclado ni anunciarse como pulsable.
 */
function Inscripcion({ evento, variante }: { evento: Evento; variante: Variante }) {
  if (!evento.inscripcion) {
    if (variante === 'pasado') return null

    return (
      <span className="font-subtitle text-sm font-semibold text-muted-foreground">
        {copy.agenda.proximamente}
      </span>
    )
  }

  // El nombre va en la etiqueta accesible: sin esto, quien navegue saltando de enlace en
  // enlace oye «Inscribirme» ocho veces seguidas sin saber a qué evento pertenece cada una.
  const etiqueta = <span className="sr-only">: {evento.nombre}</span>

  if (variante === 'pasado') {
    return (
      <a
        href={evento.inscripcion}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 font-subtitle text-sm font-semibold text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
      >
        {copy.agenda.verEnLuma}
        {etiqueta}
        <ArrowUpRight aria-hidden className="size-4" />
      </a>
    )
  }

  return (
    <a
      href={evento.inscripcion}
      target="_blank"
      rel="noopener noreferrer"
      className="group/cta inline-flex items-center justify-center gap-2 rounded-full border border-input bg-card/50 px-5 py-2.5 font-subtitle text-sm font-semibold transition-colors hover:border-brand-blue/50 hover:bg-card"
    >
      {copy.agenda.inscribirme}
      {etiqueta}
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform group-hover/cta:-translate-y-0.5 group-hover/cta:translate-x-0.5"
      />
    </a>
  )
}
