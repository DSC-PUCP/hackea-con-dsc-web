/**
 * Iniciales de un nombre, para el círculo que se pinta cuando no hay foto.
 *
 * Vive en su propio archivo porque lo usan dos sitios que no se conocen entre sí: los
 * testimonios de `/sponsors` y las personas de la agenda. Estaba duplicado, y una copia
 * es una copia que algún día va a divergir de la otra sin que nadie se entere.
 *
 * Dos palabras como máximo: con «María Fernanda Rojas Quispe» se quiere `MF`, no `MFRQ`.
 */
export function iniciales(nombre: string): string {
  return nombre
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra[0]?.toUpperCase() ?? '')
    .join('')
}
