import { ExternalLink, MessageCircle } from 'lucide-react'
import Link from 'next/link'

import { Chevron } from '@/components/brand/icons'
import { copy, links, navegacionPie, site } from '@/lib/site-config'

/**
 * Las redes que se muestran en el pie.
 *
 * Se filtran las que están en `null` en lib/site-config.ts: mientras no exista la
 * cuenta, no aparece el enlace. Para publicar una, basta poner su URL allá.
 */
const redes = [
  { url: links.whatsapp, label: 'Comunidad en WhatsApp', Icono: MessageCircle },
  { url: links.instagram, label: 'Instagram', Icono: ExternalLink },
  { url: links.linkedin, label: 'LinkedIn', Icono: ExternalLink },
  { url: links.github, label: 'GitHub', Icono: ExternalLink },
].filter((red): red is typeof red & { url: string } => Boolean(red.url))

/** Rótulo de columna. Las dos listas de enlaces se leerían como una sola sin esto. */
const CLASE_TITULO =
  'font-subtitle text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase'

/** Enlace de columna. Compartida por las dos listas para que se vean idénticas. */
const CLASE_ENLACE =
  'group inline-flex items-center gap-2.5 font-subtitle text-sm text-muted-foreground transition-colors hover:text-foreground'

export function SiteFooter() {
  return (
    <footer className="relative">
      {/*
        Filete con el degradado del logotipo: rojo → morado → azul. Hace de separador,
        así que el pie NO lleva `border-t`: el borde gris se dibujaba encima y dejaba
        el degradado invisible.
      */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-brand-red via-brand-purple to-brand-blue"
      />

      <div className="mx-auto max-w-6xl px-5 py-12 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Chevron dir="left" className="h-4 w-auto text-brand-red" />
              <span className="font-display text-lg font-extrabold tracking-tight">
                {site.name}
              </span>
              <Chevron dir="right" className="h-4 w-auto text-brand-purple" />
            </div>
            <p className="mt-3 max-w-sm leading-relaxed text-muted-foreground">
              {copy.footer.tagline}
            </p>
          </div>

          <div className="flex flex-col gap-8 sm:flex-row sm:gap-16">
            {/*
              Los enlaces de sitio. Son la red de seguridad de la navegación: la barra de
              arriba tiene el espacio que tiene, y por debajo de 640 px llegó a esconder
              el menú entero. Acá caben siempre, y `/sponsors` es justo el enlace que una
              empresa busca en el pie por convención.

              Van con `next/link` y no con `<a>` porque es quien aplica el `basePath` si
              el sitio acaba viviendo en un subdirectorio. Ver components/site-header.tsx.
            */}
            <nav aria-label="Páginas del sitio" className="flex flex-col gap-3">
              <p className={CLASE_TITULO}>{copy.footer.tituloSitio}</p>
              {navegacionPie.map((enlace) => (
                <Link key={enlace.href} href={enlace.href} className={CLASE_ENLACE}>
                  <Chevron
                    dir="right"
                    className="h-3 w-auto text-brand-purple transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                  {enlace.label}
                </Link>
              ))}
            </nav>

            <nav aria-label="Redes y comunidad" className="flex flex-col gap-3">
              <p className={CLASE_TITULO}>{copy.footer.tituloRedes}</p>
              {redes.map((red) => (
                <a
                  key={red.label}
                  href={red.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CLASE_ENLACE}
                >
                  <red.Icono
                    className="size-4 text-brand-purple transition-transform duration-300 group-hover:scale-110"
                    aria-hidden
                  />
                  {red.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-1.5 border-t border-border pt-6 font-subtitle text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>
            {site.organizerFull} · {copy.footer.credito}
          </p>
          <p>© {new Date().getFullYear()} {site.name}</p>
        </div>
      </div>
    </footer>
  )
}
