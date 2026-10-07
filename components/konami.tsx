'use client'

import { useEffect } from 'react'

import { copy, links } from '@/lib/site-config'

/** ↑ ↑ ↓ ↓ ← → ← → B A, como lo devuelve `KeyboardEvent.key` (letras en minúscula). */
const CODIGO = [
  'arrowup',
  'arrowup',
  'arrowdown',
  'arrowdown',
  'arrowleft',
  'arrowright',
  'arrowleft',
  'arrowright',
  'b',
  'a',
]

/**
 * Cuánto dura el modo hacker. Tiene que coincidir con la animación `hwd-konami-mensaje`
 * de globals.css: el mensaje se desvanece justo antes de que se quite el atributo.
 */
const DURACION_MS = 5200

/**
 * El mensaje de consola se imprime UNA vez por carga. En desarrollo, el modo estricto de
 * React monta los efectos dos veces, y sin esta bandera el saludo salía duplicado.
 */
let saludoImpreso = false

/**
 * Dos huevos de pascua para la gente curiosa. No dibuja nada: es el mismo patrón que
 * `PointerParallax` y `ScrollReveal`.
 *
 *  · **El saludo de consola.** Quien abre las herramientas de desarrollo en una web de
 *    estudiantes es justo el público del programa, así que se le habla directo.
 *  · **El código Konami.** Al completarlo, pone `data-konami` en `<html>` unos segundos.
 *    Lo que pasa después (Bugle cruzando la pantalla, el mensaje) lo decide el CSS sobre
 *    la escena que monta app/layout.tsx. Este componente solo publica el estado.
 */
export function Konami() {
  useEffect(() => {
    if (!saludoImpreso) {
      saludoImpreso = true
      saludarEnConsola()
    }

    // Las últimas teclas pulsadas, tantas como tiene el código. Comparar la cola entera
    // (en vez de llevar un contador de aciertos) hace que un ↑ de más al principio, que
    // es el error más común, no obligue a empezar de nuevo.
    let ultimas: string[] = []
    let temporizador: number | undefined
    const raiz = document.documentElement

    const alPulsar = (evento: KeyboardEvent) => {
      // Escribir en un campo de texto no cuenta: «ba» puede ser parte de una palabra.
      const destino = evento.target as HTMLElement | null
      if (destino?.closest('input, textarea, select, [contenteditable="true"]')) return

      // `key` puede venir vacío: el autocompletado de Chrome dispara `keydown` sin tecla.
      ultimas = [...ultimas, (evento.key ?? '').toLowerCase()].slice(-CODIGO.length)
      if (ultimas.join(' ') !== CODIGO.join(' ')) return
      ultimas = []

      // Si ya estaba activo, se reinicia: quitar el atributo y forzar un recálculo de
      // estilos es lo que hace que las animaciones de CSS vuelvan a empezar de cero.
      raiz.removeAttribute('data-konami')
      void raiz.offsetWidth
      raiz.setAttribute('data-konami', '')

      window.clearTimeout(temporizador)
      temporizador = window.setTimeout(() => raiz.removeAttribute('data-konami'), DURACION_MS)
    }

    window.addEventListener('keydown', alPulsar)
    return () => {
      window.removeEventListener('keydown', alPulsar)
      window.clearTimeout(temporizador)
      raiz.removeAttribute('data-konami')
    }
  }, [])

  return null
}

/**
 * Imprime `copy.consola` (una línea por elemento, la primera con estilo de marca) y el
 * enlace al grupo.
 *
 * Los colores salen de las variables CSS de globals.css y no van escritos acá: es la
 * misma regla de una sola fuente de verdad, aplicada también a la consola.
 */
function saludarEnConsola() {
  const [titulo, ...lineas] = copy.consola
  const estilos = getComputedStyle(document.documentElement)
  const color = (token: string) => estilos.getPropertyValue(token).trim()

  const estiloTitulo = [
    `background: ${color('--brand-purple')}`,
    `color: ${color('--brand-light')}`,
    `border-left: 6px solid ${color('--brand-red')}`,
    'font-size: 18px',
    'font-weight: 800',
    'padding: 6px 14px',
  ].join(';')

  // El resto sin color: la consola puede estar en tema claro u oscuro, y el color por
  // defecto es el único que se lee bien en los dos.
  const estiloCuerpo = 'font-size: 13px; line-height: 1.7'

  console.log(
    `%c${titulo}%c\n${[...lineas, links.whatsapp].join('\n')}`,
    estiloTitulo,
    estiloCuerpo,
  )
}
