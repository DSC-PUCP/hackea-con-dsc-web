'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Hace aparecer los elementos cuando entran en pantalla.
 *
 * Se monta UNA sola vez en la página. Busca todo lo que tenga `data-reveal`, lo
 * observa, y al entrar en pantalla le pone `data-visible="true"`. La animación en sí
 * la define el CSS (globals.css, bloque "Aparición al hacer scroll").
 *
 * Ventaja de hacerlo así: las secciones no necesitan ser componentes de cliente.
 * Cualquier componente de servidor solo agrega el atributo `data-reveal` y ya.
 *
 * Para escalonar la entrada de varios elementos, se usa la variable CSS
 * `--reveal-delay`:
 *
 *   <div data-reveal style={{ '--reveal-delay': '120ms' }} />
 */
export function ScrollReveal() {
  const ruta = usePathname()

  useEffect(() => {
    const elementos = document.querySelectorAll<HTMLElement>('[data-reveal]')

    const mostrarTodo = () => {
      elementos.forEach((elemento) => elemento.setAttribute('data-visible', 'true'))
    }

    // Navegador viejo, o el sistema pide menos movimiento: se muestra todo de una.
    if (
      typeof IntersectionObserver === 'undefined' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      mostrarTodo()
      return
    }

    // Si algo falla al construir u observar, se muestra todo. Un texto sin animación es
    // un detalle; un texto invisible es la página rota.
    let observador: IntersectionObserver
    try {
      observador = new IntersectionObserver(
        (entradas) => {
          for (const entrada of entradas) {
            if (!entrada.isIntersecting) continue
            entrada.target.setAttribute('data-visible', 'true')
            // Una sola vez: al hacer scroll hacia arriba no vuelve a desaparecer.
            observador.unobserve(entrada.target)
          }
        },
        // -10% abajo: dispara cuando el elemento ya entró de verdad, no al asomar 1px.
        { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
      )

      elementos.forEach((elemento) => observador.observe(elemento))
    } catch {
      mostrarTodo()
      return
    }

    return () => observador.disconnect()
    // Se vuelve a buscar y observar en cada cambio de ruta.
    //
    // Este componente se monta una sola vez, en el layout, y captura los `data-reveal`
    // que existan en ese momento. Con enlaces `<a>` normales eso basta, porque cada
    // navegación recarga la página entera. Pero en cuanto alguien use `next/link` la
    // navegación pasa a ser del lado del cliente, el componente NO se vuelve a montar, y
    // el contenido de la página nueva se quedaría en `opacity: 0` para siempre — visible
    // sin JavaScript y en blanco con él, que es el fallo más difícil de detectar.
  }, [ruta])

  return null
}
