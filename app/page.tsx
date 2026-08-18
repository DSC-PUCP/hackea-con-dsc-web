import { Hero } from '@/components/hero'
import { QueEs } from '@/components/que-es'

/**
 * Portada del sitio, en `/`.
 *
 * A propósito solo hay DOS secciones: la portada y "Qué es Hack with DSC". La agenda
 * vivió acá un rato y se movió a su propia página (`/agenda`), por la misma razón que
 * `/sponsors` es una página y no una sección: es contenido que crece —doce eventos y
 * subiendo, más los que ya pasaron— y que se comparte por su cuenta. Enterrado al final
 * de la portada obligaba a recorrer el hero entero para ver una fecha, y no se podía
 * mandar por WhatsApp sin mandar todo lo demás.
 *
 * Lo que queda acá es lo estable: qué es esto y por qué te importa. La agenda se alcanza
 * desde el menú y desde el pie.
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
