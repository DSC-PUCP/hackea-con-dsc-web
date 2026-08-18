import type { Metadata } from 'next'

import { Chevron } from '@/components/brand/icons'
import { SeccionDeEventos } from '@/components/eventos/agenda'
import { obtenerAgenda } from '@/lib/eventos/contenido'
import { copy, links, seoAgenda, site } from '@/lib/site-config'
import { urlDelSitio } from '@/lib/site-url'

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
      <section id="top" className="relative isolate overflow-hidden">
        {/*
          ── Fondo ──────────────────────────────────────────────────────────────────────
          Las mismas cinco capas que el hero de la portada y el de `/sponsors`, y en el
          mismo orden: rejilla, glows que respiran, chevron mural y grano. No es adorno
          repetido por copiar — es lo que hace que las tres páginas se lean como el mismo
          sitio. La primera versión de esta página tenía un solo glow estático y se notaba
          de inmediato: parecía otra web.

          El reparto de `parallax-*` entre capas es el que da la profundidad; van en ramas
          distintas del árbol que el contenido porque `enter` y `parallax` animan las dos
          `translate`, y en un mismo elemento se pisan.

          Acá manda el azul —el color con el que se rotula la agenda— y el morado queda de
          apoyo, al revés que en `/sponsors`.
        */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-brand-grid parallax-back absolute inset-[-2rem]" />

          <div className="glow-blue animate-breathe parallax-mid absolute top-[-26%] left-[-12%] size-[40rem] max-w-[130vw]" />
          <div className="glow-purple animate-breathe parallax-back absolute top-[-16%] right-[-14%] size-[34rem] max-w-[130vw] [animation-delay:-4s]" />

          <Chevron
            dir="right"
            className="parallax-front absolute right-[-3rem] bottom-[-2rem] h-[14rem] w-auto text-brand-blue/[0.035] lg:h-[20rem]"
          />

          <div className="bg-brand-noise absolute inset-0" />
        </div>

        <div className="mx-auto max-w-5xl px-5 pt-32 pb-10 md:px-6 md:pt-40 md:pb-14">
          <p className="enter flex items-center gap-2.5 font-subtitle text-xs font-semibold tracking-[0.2em] text-brand-blue uppercase">
            <Chevron dir="right" className="h-3 w-auto" />
            {copy.agenda.eyebrow}
          </p>

          <h1
            className="enter mt-5 font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl"
            style={{ '--enter-delay': '80ms' } as React.CSSProperties}
          >
            {copy.agenda.titulo}
          </h1>

          <p
            className="enter mt-6 max-w-2xl text-base leading-relaxed text-pretty text-muted-foreground lg:text-lg"
            style={{ '--enter-delay': '160ms' } as React.CSSProperties}
          >
            {hayAlgo ? copy.agenda.intro : copy.agenda.vacio.descripcion}
          </p>

          {hayAlgo ? null : (
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand enter mt-8 inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-subtitle text-base font-semibold"
              style={{ '--enter-delay': '240ms' } as React.CSSProperties}
            >
              {copy.cta.boton}
            </a>
          )}
        </div>
      </section>

      {hayAlgo ? (
        <div className="relative isolate overflow-hidden">
          {/*
            Un halo tenue detrás de la lista. La lista es larga —doce eventos más los que
            ya pasaron— y sin nada detrás el fondo se lee como un vacío plano en cuanto
            dejas atrás el hero. Es el mismo recurso que usan las secciones de
            `/sponsors`; acá va bajo y a la derecha para no competir con los glows de
            arriba.
          */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
            <div className="glow-purple absolute top-[10%] right-[-20%] size-[38rem] max-w-[140vw] opacity-25" />
          </div>

          <div className="mx-auto max-w-5xl space-y-16 px-5 pb-24 md:px-6 md:pb-32">
            <SeccionDeEventos id="proximos" titulo={copy.agenda.tituloProximos} eventos={proximos} />

            <SeccionDeEventos
              id="pasados"
              titulo={copy.agenda.tituloPasados}
              intro={copy.agenda.introPasados}
              eventos={pasados}
              variante="pasado"
            />
          </div>
        </div>
      ) : null}
    </main>
  )
}
