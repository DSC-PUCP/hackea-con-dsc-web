'use client'

import { MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Chevron } from '@/components/brand/icons'
import { copy, links, navegacion, site } from '@/lib/site-config'

/**
 * Clase compartida por los enlaces del menú. Está fuera del componente porque la usan
 * las dos ramas del render (ancla y ruta) y tienen que verse idénticas.
 */
const CLASE_ENLACE =
  'font-subtitle text-sm text-muted-foreground transition-colors hover:text-foreground'

/**
 * Barra superior. La comparten todas las páginas (se monta en app/layout.tsx).
 *
 * Arranca transparente sobre la portada (para no cortar el efecto de pantalla completa) y
 * al hacer scroll se vuelve opaca con desenfoque.
 */
export function SiteHeader() {
  const [conScroll, setConScroll] = useState(false)
  const ruta = usePathname()

  const enLaPortada = ruta === '/'

  /**
   * Resuelve un destino del menú según dónde estemos.
   *
   * Las anclas (`#que-es`) apuntan a secciones de la portada, y un ancla suelta solo
   * funciona si YA estás en la portada: desde otra ruta no lleva a ninguna parte, porque
   * esa sección no existe en ese documento. Así que fuera de la portada se les pone `/`
   * delante — primero navega, después salta. Estando en la portada se dejan como anclas
   * puras, para que el salto sea scroll suave en el mismo documento y no una recarga.
   *
   * Las rutas de verdad (`/sponsors`) se devuelven tal cual: `navegacion` puede mezclar
   * ambos tipos de destino.
   */
  const resolverDestino = (destino: string) =>
    destino.startsWith('#') && !enLaPortada ? `/${destino}` : destino

  useEffect(() => {
    // 24px: apenas se empieza a hacer scroll, no hay que bajar media pantalla.
    const alScrollear = () => setConScroll(window.scrollY > 24)
    alScrollear() // por si la página carga ya scrolleada (al recargar en un ancla)
    window.addEventListener('scroll', alScrollear, { passive: true })
    return () => window.removeEventListener('scroll', alScrollear)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        conScroll
          ? 'border-b border-border bg-background/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3.5 sm:gap-4 md:px-6">
        <LogoEnlace destino={enLaPortada ? '#top' : '/'} />

        <div className="flex shrink-0 items-center gap-2.5 sm:gap-5">
          {/*
            Visible SIEMPRE, también en móvil. Antes era `hidden sm:flex` y por debajo de
            640 px el menú entero desaparecía: `/sponsors` no tenía ni un solo camino
            desde un teléfono. Cabe porque el menú son solo rutas — ver `navegacion` en
            lib/site-config.ts.

            Los espacios se aprietan en móvil (`gap-3.5` en vez de `gap-5`) desde que el
            menú tiene DOS entradas. A 390 px la barra va justa: logotipo + Agenda +
            Patrocinio + el botón de WhatsApp en modo icono. Si hiciera falta una tercera
            entrada, ya no cabe y toca desplegable — no se resuelve apretando más.
          */}
          <nav aria-label="Páginas del sitio" className="flex items-center gap-3.5 sm:gap-5">
            {navegacion.map((enlace) => {
              const destino = resolverDestino(enlace.href)

              /*
               * Las anclas puras se dejan como `<a>`, para que el salto sea scroll suave
               * en el mismo documento. Lo que navega pasa por `next/link`, que además es
               * quien aplica el `basePath` cuando el sitio vive en un subdirectorio: un
               * `<a href="/sponsors">` a pelo apuntaría a la raíz del dominio compartido
               * y daría 404. Ver `assetPublico()` en lib/site-url.ts, mismo problema.
               */
              return destino.startsWith('#') ? (
                <a key={enlace.href} href={destino} className={CLASE_ENLACE}>
                  {enlace.label}
                </a>
              ) : (
                <Link
                  key={enlace.href}
                  href={destino}
                  // Marca en qué página estás. Con dos entradas importa más que con una:
                  // «Agenda» y «Patrocinio» juntas sin ninguna señal de cuál está activa
                  // dejan al lector sin saber dónde aterrizó.
                  aria-current={ruta === destino ? 'page' : undefined}
                  className={CLASE_ENLACE}
                >
                  {enlace.label}
                </Link>
              )
            })}
          </nav>

          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={copy.header.comunidadAria}
            title={copy.header.comunidadAria}
            className="btn-brand inline-flex items-center gap-2 rounded-full px-2.5 py-2 font-subtitle text-sm font-semibold sm:px-4"
          >
            <MessageCircle className="size-4" aria-hidden />
            {/*
              El texto solo desde 640 px. En móvil el botón se queda con el icono: no es
              una pérdida real, porque el hero trae el mismo destino en un botón grande a
              media pantalla de distancia, y es lo que libera el sitio que necesita el
              menú. La etiqueta accesible la pone el `aria-label` de arriba.
            */}
            <span className="hidden sm:inline">{copy.hero.ctaPrimario}</span>
          </a>
        </div>
      </div>
    </header>
  )
}

/**
 * El logotipo de la barra, que además es el enlace al inicio.
 *
 * Existe como pieza aparte por una sola razón: el destino cambia de naturaleza según la
 * ruta —`#top` en la portada, `/` fuera de ella— y eso obliga a elegir entre `<a>` y
 * `next/link`. Ver el comentario del menú: el `<a href="/">` a pelo se rompe el día que
 * el sitio viva en un subdirectorio.
 *
 * Sobre el ancho: NO lleva `shrink-0`. Por debajo de unos 340 px el logotipo, el menú y
 * el botón dejan de caber, y con `shrink-0` la barra desbordaría y le metería scroll
 * horizontal a toda la página. Con `min-w-0` + `truncate`, en su lugar se recorta el
 * final del nombre. Recortar una letra es feo; una web que se mueve de lado lo es más.
 */
function LogoEnlace({ destino }: { destino: string }) {
  const contenido = (
    <>
      <Chevron
        dir="left"
        className="h-4 w-auto shrink-0 text-brand-red transition-transform duration-300 group-hover:-translate-x-0.5"
      />
      <span className="truncate font-display text-base font-extrabold tracking-tight sm:text-lg">
        {site.name}
      </span>
      <Chevron
        dir="right"
        className="h-4 w-auto shrink-0 text-brand-purple transition-transform duration-300 group-hover:translate-x-0.5"
      />
    </>
  )

  const clase = 'group flex min-w-0 items-center gap-2'
  const etiqueta = `${site.name} — ir al inicio`

  return destino.startsWith('#') ? (
    <a href={destino} aria-label={etiqueta} className={clase}>
      {contenido}
    </a>
  ) : (
    <Link href={destino} aria-label={etiqueta} className={clase}>
      {contenido}
    </Link>
  )
}
