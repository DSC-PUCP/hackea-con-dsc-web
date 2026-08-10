'use client'

import { useEffect } from 'react'

/**
 * Escribe la posición del cursor en dos variables CSS globales (`--hwd-mx`,
 * `--hwd-my`), normalizadas a [-1, 1]. Las utilidades `parallax-back|mid|front` de
 * globals.css las leen para desplazar las capas de la portada.
 *
 * No renderiza nada: solo publica el dato y deja que el CSS decida qué se mueve. Así
 * la portada entera sigue siendo un componente de servidor.
 *
 * Se apaga solo cuando:
 *  - el sistema pide menos movimiento (`prefers-reduced-motion`), o
 *  - no hay un puntero preciso (celular/tablet: no hay cursor que seguir).
 *
 * El movimiento se suaviza con una interpolación (lerp) hacia el objetivo en vez de
 * saltar al valor exacto, y el bucle se detiene cuando ya llegó: cero trabajo
 * mientras nadie mueve el mouse.
 */
export function PointerParallax() {
  useEffect(() => {
    const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)')
    const punteroPreciso = window.matchMedia('(pointer: fine)')
    if (sinMovimiento.matches || !punteroPreciso.matches) return

    const root = document.documentElement
    let objetivoX = 0
    let objetivoY = 0
    let actualX = 0
    let actualY = 0
    let frame = 0

    const animar = () => {
      // 0.08 = qué tan rápido persigue al cursor. Más alto, más brusco.
      actualX += (objetivoX - actualX) * 0.08
      actualY += (objetivoY - actualY) * 0.08
      root.style.setProperty('--hwd-mx', actualX.toFixed(4))
      root.style.setProperty('--hwd-my', actualY.toFixed(4))

      // Cuando la diferencia ya no se nota, se corta el bucle.
      if (Math.abs(objetivoX - actualX) > 0.001 || Math.abs(objetivoY - actualY) > 0.001) {
        frame = requestAnimationFrame(animar)
      } else {
        frame = 0
      }
    }

    const alMover = (evento: PointerEvent) => {
      objetivoX = (evento.clientX / window.innerWidth - 0.5) * 2
      objetivoY = (evento.clientY / window.innerHeight - 0.5) * 2
      if (!frame) frame = requestAnimationFrame(animar)
    }

    window.addEventListener('pointermove', alMover, { passive: true })

    return () => {
      window.removeEventListener('pointermove', alMover)
      if (frame) cancelAnimationFrame(frame)
      root.style.removeProperty('--hwd-mx')
      root.style.removeProperty('--hwd-my')
    }
  }, [])

  return null
}
