'use client'

import { MessageCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Chevron } from '@/components/brand/icons'
import { copy, links, navegacion, site } from '@/lib/site-config'

/**
 * Barra superior.
 *
 * Arranca transparente sobre la portada (para no cortar el efecto de pantalla
 * completa) y al hacer scroll se vuelve opaca con desenfoque. Ese cambio es el único
 * motivo por el que este componente es de cliente.
 */
export function SiteHeader() {
  const [conScroll, setConScroll] = useState(false)

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
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-6">
        <a
          href="#top"
          aria-label={`${site.name} — ir al inicio`}
          className="group flex shrink-0 items-center gap-2"
        >
          <Chevron
            dir="left"
            className="h-4 w-auto text-brand-red transition-transform duration-300 group-hover:-translate-x-0.5"
          />
          <span className="font-display text-base font-extrabold tracking-tight whitespace-nowrap sm:text-lg">
            {site.name}
          </span>
          <Chevron
            dir="right"
            className="h-4 w-auto text-brand-purple transition-transform duration-300 group-hover:translate-x-0.5"
          />
        </a>

        <div className="flex items-center gap-1 sm:gap-5">
          <nav className="hidden items-center gap-5 sm:flex">
            {navegacion.map((enlace) => (
              <a
                key={enlace.href}
                href={enlace.href}
                className="font-subtitle text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {enlace.label}
              </a>
            ))}
          </nav>

          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-brand inline-flex items-center gap-2 rounded-full px-4 py-2 font-subtitle text-sm font-semibold"
          >
            <MessageCircle className="size-4" aria-hidden />
            {/* En pantallas chicas el texto largo no cabe junto al logotipo. */}
            <span className="sm:hidden">Comunidad</span>
            <span className="hidden sm:inline">{copy.hero.ctaPrimario}</span>
          </a>
        </div>
      </div>
    </header>
  )
}
