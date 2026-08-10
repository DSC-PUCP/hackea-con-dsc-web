/**
 * Iconos de marca, dibujados a mano en SVG.
 *
 * No se usa lucide para estos tres porque en la pieza gráfica oficial son formas
 * macizas (rellenas), y las de lucide son de trazo. Heredan el color con
 * `currentColor`, así que se pintan con cualquier clase de texto.
 */

type IconProps = {
  className?: string
}

/**
 * El chevron del logotipo. Es el elemento gráfico que más identifica a la marca:
 * el ❰ rojo y el ❱ morado que abrazan el wordmark.
 */
export function Chevron({ dir = 'right', className }: IconProps & { dir?: 'left' | 'right' }) {
  return (
    <svg
      viewBox="0 0 14 24"
      fill="currentColor"
      aria-hidden
      className={className}
      style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M1 0h6.4L13.6 12 7.4 24H1l6.2-12z" />
    </svg>
  )
}

/** Par de chevrons `❮ ❯`: el icono de Talleres en la pieza gráfica. */
function Chevrons({ className }: IconProps) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12.4 0H6.2L0 12l6.2 12h6.2L6.2 12z" />
      <path d="M19.6 0h6.2L32 12l-6.2 12h-6.2L25.8 12z" />
    </svg>
  )
}

/** Estrella maciza: el icono de Ponencias. */
function Star({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 1.6l3.1 6.9 7.5.7-5.6 5 1.6 7.4L12 17.7 5.4 21.6 7 14.2l-5.6-5 7.5-.7z" />
    </svg>
  )
}

/** Rayo macizo: el icono de Hackathones. */
function Bolt({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M14.4 1L3.6 14.2h6.2L8.4 23l12-13.6h-6.6z" />
    </svg>
  )
}

const iconos = { chevrons: Chevrons, star: Star, bolt: Bolt }

/** Nombres válidos para el campo `icon` de `formatos` en lib/site-config.ts. */
export type BrandIconName = keyof typeof iconos

export function BrandIcon({ name, className }: IconProps & { name: BrandIconName }) {
  const Icono = iconos[name]
  return <Icono className={className} />
}
