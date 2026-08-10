import { ExternalLink, MessageCircle } from 'lucide-react'

import { Chevron } from '@/components/brand/icons'
import { copy, links, site } from '@/lib/site-config'

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

          <nav aria-label="Redes y comunidad" className="flex flex-col gap-3">
            {redes.map((red) => (
              <a
                key={red.label}
                href={red.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 font-subtitle text-sm text-muted-foreground transition-colors hover:text-foreground"
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
