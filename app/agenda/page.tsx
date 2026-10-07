import { MessageCircle } from 'lucide-react'
import type { Metadata } from 'next'
import Image from 'next/image'

import { Chevron } from '@/components/brand/icons'
import { SeccionDeEventos } from '@/components/eventos/agenda'
import { obtenerAgenda } from '@/lib/eventos/contenido'
import { copy, links, seoAgenda, site } from '@/lib/site-config'
import { assetPublico, urlDelSitio } from '@/lib/site-url'

/**
 * Metadatos ESTÁTICOS, no `generateMetadata` leyendo la hoja.
 *
 * WhatsApp y LinkedIn cachean la vista previa de un enlace de forma agresiva y por mucho
 * tiempo. Si el título o la descripción cambiaran con la agenda, quedarían circulando
 * previsualizaciones que anuncian un taller que ya pasó — y no hay forma de arreglarlas
 * salvo renombrando la imagen. Ver el mismo razonamiento en `app/sponsors/page.tsx`.
 *
 * La imagen de Open Graph es la del sitio (`/og.jpg`) y no una propia: una imagen de
 * agenda tendría que llevar fechas para significar algo, y una imagen con fechas caduca.
 */
export const metadata: Metadata = {
  title: seoAgenda.title,
  description: seoAgenda.description,
  alternates: {
    canonical: `${urlDelSitio}/agenda`,
  },
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: `${urlDelSitio}/agenda`,
    siteName: site.name,
    title: seoAgenda.title,
    description: seoAgenda.description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: seoAgenda.ogAlt }],
  },
  twitter: {
    card: 'summary_large_image',
    title: seoAgenda.title,
    description: seoAgenda.description,
    images: ['/og.jpg'],
  },
}

/**
 * Página de agenda, en `/agenda`.
 *
 * Es solo su `<main>`: el header, el pie, el parallax y la aparición al hacer scroll
 * viven en `app/layout.tsx` y se heredan.
 *
 * ── Lo que cambia respecto a cuando esto era una sección de la portada ───────────────
 * Una sección puede devolver `null` y desaparecer. **Una ruta no.** Si la hoja no se
 * puede leer, o no hay ni un evento publicado, `/agenda` sigue existiendo, sigue estando
 * en el menú y alguien va a llegar. Por eso acá sí hay estado vacío, y por eso ofrece una
 * salida —el grupo de WhatsApp— en vez de dejar a la persona en una página muerta.
 *
 * Se lee la agenda UNA vez y se reparte entre las dos secciones. Con dos componentes
 * `async` llamando cada uno a `obtenerAgenda()` funcionaría igual (la caché deduplica),
 * pero entonces el corte entre pasado y futuro se calcularía dos veces con dos relojes
 * distintos, y un evento que empiece justo en la frontera podría salir en las dos listas.
 */
export default async function Page() {
  const { proximos, pasados } = await obtenerAgenda()
  const hayAlgo = proximos.length > 0 || pasados.length > 0

  return (
    <main>
      <section id="top" className="relative isolate overflow-hidden border-b border-border/70">
        {/*
          ── Fondo ──────────────────────────────────────────────────────────────────────
          Las mismas capas que el hero de la portada y el de `/sponsors` —rejilla, glow que
          respira, chevron mural y grano—, que es lo que hace que las tres páginas se lean
          como el mismo sitio. Pero más ligeras: acá el protagonista visual es Bugle y el
          título de póster, y con dos halos detrás la cabecera se volvía niebla. Queda uno
          solo, el azul, que es el color con el que se rotula la agenda.

          El reparto de `parallax-*` entre capas es el que da la profundidad; van en ramas
          distintas del árbol que el contenido porque `enter` y `parallax` animan las dos
          `translate`, y en un mismo elemento se pisan.
        */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-brand-grid parallax-back absolute inset-[-2rem]" />

          <div className="glow-blue animate-breathe parallax-mid absolute top-[-30%] left-[-14%] size-[40rem] max-w-[130vw]" />

          <Chevron
            dir="left"
            className="parallax-front absolute top-[18%] left-[-3.5rem] h-[14rem] w-auto text-brand-red/[0.05] lg:h-[20rem]"
          />

          <div className="bg-brand-noise absolute inset-0" />
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 px-5 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8 md:px-6">
          <div className={`pt-32 md:pt-40 md:pb-16 ${hayAlgo ? 'pb-12' : 'pb-4'}`}>
            {/*
              El único momento de la página en letra de póster. Sin rótulo «Agenda» encima:
              el menú ya marca dónde estás, y el rótulo era la mitad del molde genérico
              (rótulo + título + párrafo gris) que se repetía en todas las páginas.
            */}
            <h1 className="enter font-poster text-[1.7rem] leading-[1.08] font-extrabold tracking-tight text-balance uppercase sm:text-4xl lg:text-[2.85rem]">
              {copy.agenda.titulo}
            </h1>

            <p
              className="enter mt-6 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
              style={{ '--enter-delay': '100ms' } as React.CSSProperties}
            >
              {hayAlgo ? copy.agenda.intro : copy.agenda.vacio.descripcion}
            </p>

            {hayAlgo ? null : (
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand enter mt-8 inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-subtitle text-base font-semibold"
                style={{ '--enter-delay': '200ms' } as React.CSSProperties}
              >
                <MessageCircle className="size-5" aria-hidden />
                {copy.cta.boton}
              </a>
            )}
          </div>

          <BugleRevisando vacio={!hayAlgo} />
        </div>
      </section>

      {/*
        Fondo tinta limpio, sin halo. Hubo uno tenue detrás de la lista para que no se
        leyera como un vacío plano, pero sumado a los de la cabecera era niebla: el color
        de la lista ahora lo ponen los stickers de tipo y los botones, no el fondo.

        El `pt` no es decorativo: sin él, el primer rótulo de lista quedaba pegado al borde
        de la cabecera, como si fuera parte de ella.
      */}
      {hayAlgo ? (
        <>
          <div className="mx-auto max-w-5xl px-5 pt-12 md:px-6 md:pt-16">
            <SeccionDeEventos id="proximos" titulo={copy.agenda.tituloProximos} eventos={proximos} />
          </div>

          <AvisoDelGrupo />

          <div className="mx-auto max-w-5xl px-5 pb-24 md:px-6 md:pb-32">
            <SeccionDeEventos
              id="pasados"
              titulo={copy.agenda.tituloPasados}
              intro={copy.agenda.introPasados}
              eventos={pasados}
              variante="pasado"
            />
          </div>
        </>
      ) : null}
    </main>
  )
}

/**
 * La salida al grupo, ENTRE las dos listas: justo donde se acaban las fechas que todavía
 * sirven y empieza el archivo. Es el momento exacto en que alguien piensa «¿y después
 * qué?», y la respuesta es que las fechas nuevas se anuncian primero en el grupo.
 *
 * Al final de la página no servía: ahí ya solo se llega recorriendo eventos pasados.
 *
 * Es una barra de póster (la de la pieza 2) y no un bloque morado: la agenda es una página
 * de consulta, y un bloque a sangre de lado a lado le partía la lista en dos. La barra
 * sangra solo hacia la derecha y por la izquierda arranca en la misma vertical que la
 * lista, con la misma cuenta que los formatos de la portada: `--borde` es donde empieza el
 * contenido del `max-w-5xl` centrado (32rem de medio ancho menos 1.5rem de relleno).
 */
function AvisoDelGrupo() {
  return (
    <div
      style={{ '--borde': 'max(1.25rem, calc(50% - 30.5rem))' } as React.CSSProperties}
      className="my-20 md:my-24"
    >
      <div
        data-reveal
        className="barra-poster ml-[var(--borde)] flex flex-col gap-6 rounded-r-none! py-8 pr-[var(--borde)] pl-6 md:flex-row md:items-center md:justify-between md:gap-10 md:py-10 md:pl-10"
      >
        <div className="max-w-xl">
          <h2 className="font-display text-2xl leading-tight font-extrabold tracking-tight text-balance md:text-3xl">
            {copy.cta.titulo}
          </h2>
          <p className="mt-3 leading-relaxed text-pretty text-brand-light/90">
            {copy.cta.descripcion}
          </p>
        </div>

        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-tinta inline-flex shrink-0 items-center justify-center gap-2.5 rounded-full px-7 py-4 font-subtitle text-base font-semibold"
        >
          <MessageCircle className="size-5" aria-hidden />
          {copy.cta.boton}
        </a>
      </div>
    </div>
  )
}

/**
 * Bugle de espaldas, mirando su pantalla holográfica: «revisando el calendario».
 *
 * Va ESPEJADO (`-scale-x-100`). El arte original mira a la derecha, y en la columna de la
 * derecha eso lo dejaba de espaldas a la página, mirando fuera del cuadro. Espejado mira
 * hacia el título y la lista, que es la regla de siempre en un póster: el personaje mira
 * hacia dentro. El código de su pantalla queda al revés, pero a este tamaño no se lee.
 *
 * Se corta en recto por el borde inferior de la cabecera (el `mb` negativo lo saca de la
 * sección y el `overflow-hidden` lo recorta), como Bugle en la pieza 2 de `referencias/`:
 * no flota en el aire, está parado detrás del borde.
 *
 * En móvil, con eventos, NO sale: el teléfono ya llega a la lista con media pantalla de
 * título, y un Bugle encima la empujaría fuera del primer pantallazo, que es donde tiene
 * que estar la próxima fecha. En el estado vacío sí sale, y abajo del texto: ahí no hay
 * lista que empujar y la página necesita algo más que un párrafo.
 *
 * Mismo anidado que en `components/hero.tsx`: `enter` y `parallax-*` mueven los dos
 * `translate` y en un solo elemento se pisarían.
 */
function BugleRevisando({ vacio }: { vacio: boolean }) {
  return (
    <div
      className={`pointer-events-none self-end ${vacio ? 'mx-auto -mb-16 w-[min(70vw,15rem)] md:mx-0' : 'hidden md:block md:-mb-14'} md:w-[14rem] lg:-mb-16 lg:w-[17rem]`}
    >
      <div className="enter" style={{ '--enter-delay': '160ms' } as React.CSSProperties}>
        <div className="parallax-mid relative">
          {/*
            En el estado vacío, el título que explica por qué no hay nada va pegado como
            sticker sobre Bugle: es lo que él está mirando en su pantalla.
          */}
          {vacio ? (
            <p
              className="sticker sticker-verde absolute top-[22%] -left-6 z-10 max-w-[11rem] px-3 py-2 font-subtitle text-sm leading-tight font-bold md:-left-16"
              style={{ '--sticker-giro': '-6deg' } as React.CSSProperties}
            >
              {copy.agenda.vacio.titulo}
            </p>
          ) : null}

          <Image
            src={assetPublico('/brand/bugle-hacker.webp')}
            alt={copy.agenda.bugleAlt}
            width={684}
            height={879}
            priority
            sizes="(min-width: 1024px) 17rem, (min-width: 768px) 14rem, 70vw"
            className="bugle-shadow w-full -scale-x-100"
          />
        </div>
      </div>
    </div>
  )
}
