import { ArrowUpRight, ChevronDown, Share2 } from 'lucide-react'

import { Chevron } from '@/components/brand/icons'
import { Personas } from '@/components/eventos/personas'
import { enlaceWhatsAppDeEvento } from '@/lib/eventos/compartir'
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
 * ── Cuánta personalidad lleva una fila ───────────────────────────────────────────────
 * Poca, y en sitios fijos: el tipo es un sticker de color, el día va en letra de póster
 * dentro de un talón de ticket, y el botón tiene sombra dura. Nada más. La lista se
 * recorre buscando una fecha; si cada fila fuera un póster entero, el ojo no encontraría
 * la columna de días.
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
        Varios escalones por debajo del `<h1>` de la página (el título de póster), y a
        propósito. Estos rótulos no son títulos que compitan: solo dicen qué subconjunto
        viene debajo —«Próximos eventos», «Ya fueron»— y más grandes se leían como un
        segundo encabezado de página a dos dedos del primero.
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

      <div className="mt-8">
        {agruparPorMes(eventos).map((grupo) => (
          <div key={grupo.clave} className="mb-10 last:mb-0">
            {/*
              `sticky` para que, mientras se recorre agosto, el rótulo «Agosto 2026» siga
              a la vista. En una lista de doce eventos de tres meses es lo que evita
              perder el hilo. `top-16` lo deja justo debajo del header fijo.

              Los chevrons de marca lo enmarcan (rojo abre, morado cierra) y el filete
              que sigue hasta el borde dice «todo lo de abajo es de este mes». Ojo al
              tocarlo: su alto —32 px, del `py-2` y el `text-xs`— entra en la cuenta del
              `scroll-mt` de cada fila. Los chevrons son de `h-3` y no lo cambian.

              En los pasados el rótulo se apaga con el color del texto y no con `opacity`
              en un contenedor: con opacidad, el fondo del rótulo `sticky` también se
              volvía transparente y las filas se veían a través al hacer scroll.
            */}
            <h3
              className={`sticky top-16 z-10 -mx-1 flex items-center gap-2.5 bg-background/85 px-1 py-2 font-subtitle text-xs font-semibold tracking-[0.2em] uppercase backdrop-blur-sm ${variante === 'pasado' ? 'text-muted-foreground' : ''}`}
            >
              <Chevron dir="left" className="h-3 w-auto text-brand-red" />
              {grupo.rotulo}
              <Chevron dir="right" className="h-3 w-auto text-brand-purple" />
              <span aria-hidden className="ml-1.5 h-px flex-1 bg-border" />
            </h3>

            <ul className="mt-2">
              {grupo.eventos.map((evento, indice) => (
                <li
                  key={evento.id}
                  id={`evento-${evento.id}`}
                  // El salto de fragmento (enlace de "Compartir") tiene que librar el
                  // header fijo Y el rótulo de mes `sticky` de arriba. El primero ya lo
                  // cubre `scroll-padding-top: 5.5rem` en globals.css, pero los dos se
                  // SUMAN (no se toma el máximo) — medido con DevTools: `scroll-mt-36`
                  // (144px) sobre los 88px de `scroll-padding-top` dejaba la fila a 232px
                  // del borde, un hueco enorme. El rótulo de mes mide 32px de alto y
                  // empieza a 64px (`top-16`), así que su borde inferior está a 96px: con
                  // esto sobran ~40px sobre esos 96px, que es lo que hace falta.
                  className="relative scroll-mt-10 border-b border-border/70 last:border-b-0"
                >
                  <FilaDeEvento
                    evento={evento}
                    variante={variante}
                    giro={GIROS[indice % GIROS.length]}
                  />

                  {variante === 'pasado' ? (
                    <Sello giro={GIROS_SELLO[indice % GIROS_SELLO.length]} />
                  ) : null}
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
 * Giros de los stickers de tipo, por posición dentro del mes. Leves y alternando de lado,
 * para que dos filas seguidas nunca queden torcidas igual: un sticker pegado a mano no
 * sale dos veces con el mismo ángulo. Por posición y no por tipo, porque con tres
 * talleres seguidos el giro por tipo los dejaba en fila india, idénticos.
 */
const GIROS = ['-2deg', '1.5deg', '-1deg', '2.5deg']

/** El sello va más torcido que las etiquetas: un sello de goma se pone a la rápida. */
const GIROS_SELLO = ['-8deg', '6deg', '-5deg', '9deg']

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

function FilaDeEvento({
  evento,
  variante,
  giro,
}: {
  evento: Evento
  variante: Variante
  giro: string
}) {
  /*
   * Un evento del que solo se sabe el nombre y la fecha no tiene nada que desplegar, y
   * entonces en móvil NO se pinta como desplegable: sería un chevron que promete algo y
   * abre un hueco vacío. Durante media planificación la hoja está justo así.
   */
  const hayDetalle = Boolean(evento.descripcion || tieneGente(evento))

  /*
   * Los pasados se apagan acá, en el contenido de la fila, y no en la `<li>`: el sello
   * «Ya fue» es hermano de esto y tiene que verse a todo color encima de la fila apagada.
   * `saturate` además de `opacity` porque los stickers de tipo, a puro color, seguían
   * gritando a través del 60 %.
   */
  const apagada = variante === 'pasado' ? 'opacity-60 saturate-[.55]' : ''

  return (
    <div className={apagada}>
      {/* ── Móvil: fila compacta que se despliega ─────────────────────────────────── */}
      <div className="md:hidden">
        {hayDetalle ? (
          <details className="group">
            <summary className="flex cursor-pointer list-none items-start gap-4 py-4 [&::-webkit-details-marker]:hidden">
              <BloqueDeFecha evento={evento} />
              <Encabezado evento={evento} giro={giro} />
              <ChevronDown
                aria-hidden
                className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
              />
            </summary>

            {/*
              `pl-18` alinea el detalle con el título, no con el bloque de fecha: así la
              columna de números se sigue leyendo de arriba abajo con filas abiertas. Es
              el ancho del bloque (`w-14`) más el `gap-4` de la fila: 56 + 16 = 72 px. Si
              cambia uno de los dos, cambia esto (y el `pl-18` del botón, más abajo).

              El `pb-4` es lo que separa el detalle del botón de abajo, y va ACÁ y no en el
              botón por una razón concreta: este panel **solo existe cuando la fila está
              abierta**. Puesto en el botón habría que elegir un único hueco para los dos
              estados, y no hay ninguno que sirva — cerrada, el botón va pegado a su fila
              porque es parte de ella; abierta, sin este aire quedaba tocando la última
              cara del bloque de personas, como si fuera una fila más de la lista.
            */}
            <div className="pb-4 pl-18">
              <Detalle evento={evento} />
            </div>
          </details>
        ) : (
          <div className="flex items-start gap-4 py-4">
            <BloqueDeFecha evento={evento} />
            <Encabezado evento={evento} giro={giro} />
          </div>
        )}

        {/* Fuera del `<details>` a propósito: se ve con la fila cerrada. */}
        <div className="flex items-center gap-3 pt-1 pb-5 pl-18">
          <Inscripcion evento={evento} variante={variante} />
          <Compartir evento={evento} />
        </div>
      </div>

      {/* ── Escritorio: todo a la vista, sin desplegable y sin chevron ────────────── */}
      <div className="hidden gap-7 py-7 md:flex">
        <BloqueDeFecha evento={evento} />

        <div className="min-w-0 flex-1">
          <Encabezado evento={evento} giro={giro} />
          <Detalle evento={evento} />

          <div className="mt-6 flex items-center gap-3">
            <Inscripcion evento={evento} variante={variante} />
            <Compartir evento={evento} />
          </div>
        </div>
      </div>
    </div>
  )
}

function tieneGente(evento: Evento): boolean {
  return evento.ponentes.length + evento.mentores.length + evento.jurados.length > 0
}

/**
 * Sticker de color por tipo de evento. Los mismos colores que los formatos de la portada
 * (taller azul, ponencia morado, hackathon rojo), para que el color diga el tipo antes de
 * leerlo.
 *
 * Los nombres de clase van COMPLETOS, igual que en `clasesPorColor` de
 * components/portada/pilares.tsx y por el mismo motivo: Tailwind busca clases literales en el
 * código, y `sticker-${color}` no genera ningún CSS.
 *
 * `otro` existe porque la celda `Tipo` es texto libre y siempre aparece un formato nuevo
 * a mitad del programa. Sin esta entrada, un «Mesa redonda» dejaría la fila sin color; con
 * ella sale en el sticker claro, que no se confunde con ninguno de los tres formatos.
 */
const STICKER_POR_TIPO: Record<TipoEvento, string> = {
  taller: 'sticker-azul',
  ponencia: 'sticker-morado',
  hackathon: 'sticker-rojo',
  networking: 'sticker-verde',
  otro: 'sticker-claro',
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
function Encabezado({ evento, giro }: { evento: Evento; giro: string }) {
  const nota = notaDeFecha(evento.cuando, copy.agenda.sinFecha)

  return (
    <span className="min-w-0 flex-1">
      <span className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
        {evento.tipoEtiqueta ? (
          <span
            className={`etiqueta-sticker ${STICKER_POR_TIPO[evento.tipo]} px-1.5 py-px font-subtitle text-[0.68rem] font-bold tracking-[0.1em] uppercase`}
            style={{ '--sticker-giro': giro } as React.CSSProperties}
          >
            {evento.tipoEtiqueta}
          </span>
        ) : null}

        {/*
          En `null` —la hoja dice algo que no es ni sí ni no, como «Maso»— no se muestra
          nada. Mejor callar que arriesgarse a decirle a alguien de fuera que no puede venir.
        */}
        {evento.permiteExternos !== null ? (
          <span className="font-subtitle text-xs font-medium text-muted-foreground">
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
      <h4 className="mt-2 font-display text-base leading-snug font-bold text-pretty sm:text-lg md:text-xl">
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
 * El bloque de día, como el talón de un ticket. Ancho FIJO (`w-14`, `w-20` en escritorio),
 * y eso es lo que hace legible la lista: la columna de números queda alineada y el ojo la
 * recorre sin leer nada más. Si el ancho dependiera del contenido, un «set» y un «3»
 * descuadrarían la columna entera.
 *
 * El talón es solo la línea punteada de la derecha, que baja todo el alto de la fila
 * (`self-stretch`): es el troquel por donde se corta la entrada. Nada de muescas ni
 * cartón de fondo — con eso cada fila ya era una ilustración.
 *
 * El día va en letra de póster: es el dato que se busca al recorrer la lista, y la letra
 * ancha lo hace legible de reojo. Con `uppercase` porque a veces no es un número sino el
 * mes («oct», cuando la hoja solo sabe el mes) y `font-poster` se usa solo en mayúsculas.
 *
 * Lleva la hora dentro para no gastar una línea aparte en el dato más repetido de la
 * agenda. La fecha completa va en `title`, para quien dude de qué día de la semana es
 * el 20 sin que la fila tenga que decirlo dos veces.
 */
function BloqueDeFecha({ evento }: { evento: Evento }) {
  const { principal, secundario, hora } = fechaCompacta(evento.cuando)

  return (
    <span
      className="w-14 shrink-0 self-stretch border-r-2 border-dashed border-border pr-2 text-center md:w-20 md:pr-4"
      title={formatearCuando(evento.cuando, copy.agenda.sinFecha)}
    >
      <span className="block font-poster text-[1.35rem] leading-none font-bold uppercase md:text-[1.9rem]">
        {principal}
      </span>

      {secundario ? (
        <span className="mt-1.5 block font-subtitle text-xs font-medium tracking-[0.1em] text-muted-foreground uppercase">
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
      className="btn-sombra group/cta inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-subtitle text-sm font-bold"
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

/**
 * Compartir el evento por WhatsApp. Un solo `<a>` de servidor, sin JavaScript: el mensaje
 * ya viene armado en el `href` (ver `lib/eventos/compartir.ts`). Se ve siempre, pase lo que
 * pase con la inscripción — compartir un evento no depende de si todavía se puede uno
 * anotar.
 *
 * Icono solo, sin texto: es una acción secundaria al lado de "Inscribirme" y no debe
 * competirle el ancho. El nombre del evento va en el `aria-label`, mismo criterio que el
 * `sr-only` de `Inscripcion`.
 */
function Compartir({ evento }: { evento: Evento }) {
  return (
    <a
      href={enlaceWhatsAppDeEvento(evento, copy.agenda.sinFecha)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${copy.agenda.compartir}: ${evento.nombre}`}
      className="inline-flex shrink-0 items-center justify-center rounded-lg border border-input bg-card/50 p-2.5 text-muted-foreground transition-colors hover:border-brand-light/40 hover:bg-card hover:text-foreground"
    >
      <Share2 aria-hidden className="size-4" />
    </a>
  )
}

/**
 * El sello «Ya fue» sobre cada evento pasado, como un sello de goma estampado encima de
 * la fila. Va a todo color sobre la fila apagada: es lo primero que tiene que leerse.
 *
 * Es hermano del contenido de la fila (no hijo) por dos motivos: la fila se apaga con
 * `opacity` y el sello no debe apagarse con ella, y en móvil el contenido vive dentro de
 * un `<summary>`, donde un sello absoluto se movería al abrir la fila.
 *
 * Arriba a la derecha en escritorio, a la altura del título, que es donde cae la vista
 * al recorrer la lista. En móvil esa esquina es del chevron del desplegable, así que baja
 * a la línea del enlace de Luma, que siempre deja libre la derecha.
 *
 * `aria-hidden`: lo que dice ya lo dice el rótulo de la lista («Ya fueron»), y leído en
 * cada fila sería ruido.
 */
function Sello({ giro }: { giro: string }) {
  return (
    <span
      aria-hidden
      className="etiqueta-sticker sticker-claro pointer-events-none absolute right-1 bottom-5 px-2 py-0.5 font-poster text-[0.7rem] font-bold tracking-[0.06em] uppercase md:top-7 md:right-2 md:bottom-auto md:text-xs"
      style={{ '--sticker-giro': giro } as React.CSSProperties}
    >
      {copy.agenda.selloPasado}
    </span>
  )
}
