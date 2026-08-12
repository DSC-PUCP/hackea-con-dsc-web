/**
 * De la matriz cruda que devuelve Google a filas con nombre. COMPARTIDO con la futura
 * Fase 2 de eventos: acá no hay nada de patrocinio.
 *
 * La regla que gobierna todo este archivo: **la hoja la editan personas**. Va a haber
 * celdas en blanco, mayúsculas inconsistentes, tildes puestas y quitadas, y espacios
 * invisibles al final de las cosas. Nada de eso puede tumbar la web, así que todo se
 * normaliza acá, una sola vez, en la frontera.
 */

/** Una fila de la hoja, con las cabeceras normalizadas como claves. */
export type Fila = Record<string, string>

/** El contenido útil de una pestaña, ya separado de sus notas y su cabecera. */
export type Pestana = {
  filas: Fila[]
  /**
   * En qué fila de la HOJA está la cabecera (contando desde 1, como las ve una persona).
   * Sirve para que un aviso pueda decir "revisa la fila 7" y que ese número sea el que
   * de verdad se lee en Google Sheets.
   */
  cabeceraEnFila: number
}

/**
 * Las marcas diacríticas que `normalize('NFD')` separa de su letra: la tilde de la `á`,
 * la virgulilla de la `ñ`, la diéresis de la `ü`.
 *
 * Se construye con `new RegExp` y no como literal para que el rango se lea como texto en
 * el código. Escrito como literal serían dos caracteres invisibles entre corchetes,
 * imposibles de revisar en un diff y muy fáciles de romper sin darse cuenta.
 */
const DIACRITICOS = new RegExp('[\\u0300-\\u036f]', 'g')

/** Minúsculas y sin tildes. Es la base de todas las comparaciones de este archivo. */
function sinTildes(valor: string): string {
  return valor.normalize('NFD').replace(DIACRITICOS, '').trim().toLowerCase()
}

/**
 * Normaliza una cabecera a una clave estable: minúsculas, sin tildes y con guion bajo.
 *
 *   'Nivel ID' → 'nivel_id'      'APORTE TEXTO' → 'aporte_texto'
 *   'Mostrable' → 'mostrable'    'Descripción' → 'descripcion'
 *
 * Sin esto, cambiar "Orden" por "orden" en la hoja rompería la web, y nadie relacionaría
 * jamás las dos cosas.
 */
function comoClave(cabecera: string): string {
  return sinTildes(cabecera)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

/**
 * La columna que TODAS las pestañas comparten, y por eso sirve para reconocer la
 * cabecera. Ver `buscarCabecera`.
 */
const COLUMNA_INTERRUPTOR = 'mostrable'

/**
 * Encuentra la fila de cabecera en vez de dar por hecho que es la primera.
 *
 * ── Por qué no basta con la primera fila ─────────────────────────────────────────────
 * Quien mantiene la hoja escribe instrucciones arriba de la tabla («todo en NO hasta
 * tener los números confirmados»), que es exactamente lo que hay que hacer para que otra
 * persona la llene bien. Si el lector toma esa nota como cabecera, ninguna columna se
 * llama `mostrable`, el filtro descarta la pestaña entera **en silencio**, y la web se
 * queda sin esa sección sin decir por qué. Pasó de verdad con la pestaña `Activos`.
 *
 * El criterio es la columna `mostrable` porque es la única que el encargo obliga a tener
 * en todas las pestañas. Se compara la celda COMPLETA, no si la contiene: una nota que
 * mencione la palabra «mostrable» no confunde a nadie.
 *
 * Si no aparece en las primeras filas se usa la primera, que es el comportamiento
 * razonable para una pestaña que todavía no sigue la convención.
 */
function buscarCabecera(valores: string[][]): number {
  const hastaDonde = Math.min(valores.length, 10)

  for (let indice = 0; indice < hastaDonde; indice++) {
    if (valores[indice].some((celda) => comoClave(celda) === COLUMNA_INTERRUPTOR)) return indice
  }

  return 0
}

/**
 * Convierte la matriz de un rango en filas con nombre.
 *
 * Ojo con algo que sorprende: Google **recorta las celdas vacías del final**, así que
 * una fila puede llegar con menos elementos que la cabecera. Por eso se recorre la
 * cabecera y no la fila, y lo que falte queda como cadena vacía.
 */
export function aFilas(valores: string[][]): Pestana {
  const indice = buscarCabecera(valores)
  const cabecera = valores[indice]
  if (!cabecera) return { filas: [], cabeceraEnFila: 1 }

  const claves = cabecera.map(comoClave)

  return {
    cabeceraEnFila: indice + 1,
    filas: valores.slice(indice + 1).map((celdas) => {
      const fila: Fila = {}
      claves.forEach((clave, columna) => {
        if (clave) fila[clave] = (celdas[columna] ?? '').trim()
      })
      return fila
    }),
  }
}

/**
 * Lee la columna `mostrable`, el interruptor editorial.
 *
 * Se acepta cualquier forma razonable de decir que sí porque quien llena la hoja escribe
 * "SÍ", "si", "Sí ", "x" o "TRUE" según el día, y descartar contenido bueno por una
 * tilde sería el peor de los fallos posibles: silencioso.
 *
 * Una celda vacía es NO. Es a propósito: la hoja va a tener filas a medio escribir la
 * mayor parte del tiempo, y lo seguro es que no se publiquen solas.
 */
export function esMostrable(fila: Fila): boolean {
  return ['si', 'x', 'true', 'verdadero', 'yes', '1'].includes(sinTildes(fila.mostrable ?? ''))
}

/**
 * Lee la columna `orden`. Si falta o no es un número, devuelve la posición en la hoja,
 * que es justo el desempate que espera quien la edita: "lo dejo como está y sale como
 * lo veo".
 */
export function aOrden(fila: Fila, posicion: number): number {
  const crudo = (fila.orden ?? '').trim().replace(',', '.')
  if (!crudo) return posicion

  const numero = Number(crudo)
  return Number.isFinite(numero) ? numero : posicion
}

/** Texto opcional: devuelve `null` en vez de cadena vacía, que es lo que dicen los tipos. */
export function oNulo(valor: string | undefined): string | null {
  const limpio = valor?.trim()
  return limpio ? limpio : null
}

/**
 * Ordena por `orden` y, cuando empata o falta, por la posición original en la hoja.
 *
 * `sort` en JavaScript es estable desde ES2019, así que bastaría con ordenar por
 * `orden`; el índice va explícito igual para que el desempate sea una decisión visible y
 * no un detalle del motor.
 */
export function porOrden<T extends { orden: number }>(elementos: T[]): T[] {
  return elementos
    .map((elemento, indice) => ({ elemento, indice }))
    .sort((a, b) => a.elemento.orden - b.elemento.orden || a.indice - b.indice)
    .map(({ elemento }) => elemento)
}
