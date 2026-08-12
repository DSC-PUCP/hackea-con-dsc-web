import { Hero } from '@/components/hero'
import { QueEs } from '@/components/que-es'

/**
 * Portada del sitio, en `/`.
 *
 * A propósito solo hay DOS secciones: la portada y "Qué es Hack with DSC". No se muestra
 * nada de eventos (agenda, fechas, ponentes, lugares) hasta que la lectura desde Google
 * Sheets con caché esté implementada — ver docs/arquitectura.md §3.
 *
 * El header, el pie y los dos componentes que dan el movimiento están en
 * `app/layout.tsx`, porque los comparten todas las páginas. Acá solo va el contenido.
 */
export default function Page() {
  return (
    <main>
      <Hero />
      <QueEs />
    </main>
  )
}
