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
  'inline-flex min-h-10 items-center whitespace-nowrap font-subtitle text-sm text-muted-foreground transition-colors hover:text-foreground aria-[current=page]:text-brand-green'

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
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        conScroll
          ? 'border-border bg-background/95 backdrop-blur-xl'
          : 'border-border/50 bg-background/90 md:border-transparent md:bg-transparent'
      }`}
    >
      {/* Dos filas en móvil mantienen los tres destinos visibles sin desplegable ni JS. */}
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 px-5 pt-3 md:flex md:justify-between md:gap-7 md:px-6 md:py-3.5">
        <LogoEnlace destino={enLaPortada ? '#top' : '/'} />
        <a
          href={links.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={copy.header.comunidadAria}
          title={copy.header.comunidadAria}
          className="btn-brand col-start-2 row-start-1 inline-flex min-h-10 items-center gap-2 rounded-full px-3 py-2 font-subtitle text-xs font-semibold md:order-last md:px-4 md:text-sm"
        >
          <MessageCircle className="size-4" aria-hidden />
          <span>{copy.header.comunidadLabel}</span>
        </a>
        <nav aria-label={copy.header.navegacionAria} className="col-span-2 mt-2 flex min-w-0 items-center justify-between gap-3 border-t border-border py-2 md:mt-0 md:ml-auto md:justify-end md:gap-6 md:border-t-0 md:py-0">
          {navegacion.map((enlace) => {
            const destino = resolverDestino(enlace.href)
            return destino.startsWith('#') ? (
              <a key={enlace.href} href={destino} className={CLASE_ENLACE}>
                {enlace.label}
              </a>
            ) : (
              <Link
                key={enlace.href}
                href={destino}
                aria-current={ruta === destino ? 'page' : undefined}
                className={CLASE_ENLACE}
              >
                {enlace.label}
              </Link>
            )
          })}
        </nav>
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
  const etiqueta = `${site.name} — ${copy.header.inicioAria}`

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
