import { Globe, Mail, MessageCircle } from 'lucide-react'
import Link from 'next/link'

import { Chevron } from '@/components/brand/icons'
import { GitHub, Instagram, LinkedIn, TikTok, YouTube } from '@/components/brand/redes'
import { contactoDsc, copy, links, navegacionPie, redesDsc, site } from '@/lib/site-config'

/**
 * La columna «Comunidad»: las tres formas de LLEGAR a alguien, en texto.
 *
 * Están separadas de la fila de iconos de abajo porque responden a preguntas distintas.
 * Esto es «quiero entrar o preguntar algo»; los iconos son «quiero seguirlos». Mezclarlo
 * todo en una lista de ocho enlaces convertía el pie en un directorio.
 *
 * Se filtran las que estén en `null`: mientras no exista una, no aparece su enlace.
 */
const comunidad = [
  { url: links.whatsapp, label: copy.hero.ctaPrimario, Icono: MessageCircle },
  { url: contactoDsc.web, label: copy.footer.web, Icono: Globe },
  { url: `mailto:${contactoDsc.correo}`, label: copy.footer.correo, Icono: Mail },
].filter((enlace): enlace is typeof enlace & { url: string } => Boolean(enlace.url))

/**
 * Las redes de DSC PUCP, como fila de iconos.
 *
 * El orden no es alfabético: va de más a menos activa, que es el orden en que le sirven a
 * quien busca a la agrupación. Si alguna cuenta cambia de ritmo, se reordena acá.
 */
const redes = [
  { url: redesDsc.instagram, label: 'Instagram', Icono: Instagram },
  { url: redesDsc.linkedin, label: 'LinkedIn', Icono: LinkedIn },
  { url: redesDsc.tiktok, label: 'TikTok', Icono: TikTok },
  { url: redesDsc.youtube, label: 'YouTube', Icono: YouTube },
  { url: redesDsc.github, label: 'GitHub', Icono: GitHub },
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

            {/*
              Las redes de DSC PUCP van acá, pegadas al bloque de identidad, y no en la
              columna «Comunidad». Dos motivos:

               · **Son de otra entidad.** El programa es Hack with DSC; las cuentas son de
                 la agrupación que lo organiza. Puestas entre los enlaces del sitio se
                 leerían como del programa. Por eso llevan su propio rótulo diciendo de
                 quién son, y no basta con los iconos.
               · **Equilibran la maqueta.** El pie es identidad a la izquierda y dos
                 columnas de enlaces a la derecha; la izquierda quedaba corta.

              Iconos sin texto porque cinco logotipos se reconocen antes de leerse, y en
              fila ocupan una línea en vez de cinco. El nombre no se pierde: cada botón
              lleva `aria-label` y `title`, así que un lector de pantalla dice «Instagram
              de DSC PUCP» y el ratón lo enseña al pasar por encima.
            */}
            {redes.length > 0 ? (
              <div className="mt-6">
                <p className={CLASE_TITULO}>{copy.footer.tituloRedesDsc}</p>

                <ul className="mt-3 flex flex-wrap gap-2">
                  {redes.map((red) => (
                    <li key={red.label}>
                      <a
                        href={red.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={copy.footer.redAria(red.label)}
                        title={copy.footer.redAria(red.label)}
                        className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand-purple/45 hover:bg-card hover:text-foreground"
                      >
                        <red.Icono className="size-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
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

            <nav aria-label="Comunidad y contacto" className="flex flex-col gap-3">
              <p className={CLASE_TITULO}>{copy.footer.tituloRedes}</p>
              {comunidad.map((enlace) => (
                <a
                  key={enlace.label}
                  href={enlace.url}
                  // `mailto:` no abre pestaña: abre el cliente de correo. Con `_blank`
                  // algunos navegadores dejan atrás una pestaña en blanco.
                  target={enlace.url.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noopener noreferrer"
                  className={CLASE_ENLACE}
                >
                  <enlace.Icono
                    className="size-4 text-brand-purple transition-transform duration-300 group-hover:scale-110"
                    aria-hidden
                  />
                  {enlace.label}
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
