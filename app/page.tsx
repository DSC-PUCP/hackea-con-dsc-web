import { Hero } from '@/components/hero'
import { PointerParallax } from '@/components/pointer-parallax'
import { QueEs } from '@/components/que-es'
import { ScrollReveal } from '@/components/scroll-reveal'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'

/**
 * Única página del sitio.
 *
 * A propósito solo hay DOS secciones: la portada y "Qué es Hack with DSC". No se
 * muestra nada de eventos (agenda, fechas, ponentes, lugares) hasta que la lectura
 * desde Google Sheets con caché esté implementada — ver docs/arquitectura.md.
 *
 * `PointerParallax` y `ScrollReveal` no dibujan nada: son los dos únicos componentes
 * de cliente que dan el movimiento, y se montan una sola vez acá para que todas las
 * secciones puedan seguir siendo componentes de servidor.
 */
export default function Page() {
  return (
    <>
      <PointerParallax />
      <ScrollReveal />

      <SiteHeader />
      <main>
        <Hero />
        <QueEs />
      </main>
      <SiteFooter />
    </>
  )
}
