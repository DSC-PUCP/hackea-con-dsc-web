/**
 * Modelo de datos de la agenda del programa.
 *
 * Es el contrato entre la hoja de eventos y la portada. Igual que en
 * `lib/sponsors/types.ts`, la hoja manda en el CONTENIDO pero nunca en la PRESENTACIÓN:
 * en las celdas no van colores, ni clases, ni HTML.
 *
 * Todo lo que llega de la hoja pasa antes por `lib/eventos/esquemas.ts`, así que a partir
 * de acá el resto del código trabaja con datos limpios: sin filas ocultas, sin campos
 * vacíos disfrazados de cadena, con las personas ya resueltas y ya ordenado por fecha.
 *
 * ── La regla que gobierna todos estos tipos ──────────────────────────────────────────
 * **Casi todo es opcional.** Un evento del que solo se sabe el nombre tiene que poder
 * publicarse, porque durante la mitad del programa ese es el estado real de las cosas. Si
 * el tipo exigiera fecha, descripción y ponentes, el equipo tendría que elegir entre
 * inventarse los datos o no anunciar nada.
 *
 * Lo único obligatorio es `nombre`: sin él no hay nada que mostrar.
 */

import type { Cuando } from './fechas.ts'

/**
 * Alguien que participa en un evento. Sale de la pestaña `Info Personas (Web)`, y los
 * eventos la referencian por `id`.
 *
 * Se guarda una sola vez y se referencia N veces a propósito: una misma persona da tres
 * talleres y es jurado en dos hackathons, y su LinkedIn no puede estar copiado en cinco
 * filas distintas esperando a que alguien lo actualice en todas.
 */
export type Persona = {
  /** El de la columna `ID Persona`, en mayúsculas: `SHIARA`, `ANT_CUEVA`. */
  id: string
  nombre: string
  /** «Ingeniera de datos en X». Sin esto, la tarjeta muestra un nombre y ya. */
  cargo: string | null
  linkedin: string | null
  github: string | null
  /**
   * Ruta lista para un `src`, con los enlaces de Google Drive ya traducidos (ver
   * lib/sheets/imagenes.ts). `null` si no hay: entonces se pintan las iniciales.
   */
  foto: string | null
}

/**
 * Los tres papeles que alguien puede tener en un evento.
 *
 * Son tres columnas separadas en la hoja y no una sola con etiquetas porque quien la
 * llena piensa por papel («¿quiénes son los jurados de esta hackathon?»), no por persona.
 */
export type Rol = 'ponentes' | 'mentores' | 'jurados'

/**
 * Familia del evento, ya normalizada. `otro` recoge lo que el equipo escriba y todavía no
 * tenga categoría —la hoja es libre y siempre aparece un formato nuevo—, y sirve para que
 * la tarjeta no se quede sin estilo.
 */
export type TipoEvento = 'taller' | 'ponencia' | 'hackathon' | 'networking' | 'otro'

export type Evento = {
  /** La columna `ID` de la hoja, o la posición si está vacía. Solo para `key` de React. */
  id: string
  nombre: string
  tipo: TipoEvento
  /** Lo que dice la celda, tal cual, para imprimirlo. `Ponencia o taller` se respeta. */
  tipoEtiqueta: string | null
  /** `null` cuando no hay ni fecha: la tarjeta dice «Fecha por confirmar». */
  cuando: Cuando | null
  descripcion: string | null
  ponentes: Persona[]
  mentores: Persona[]
  jurados: Persona[]
  /** URL de Luma. `null` mientras no exista: el botón sale desactivado. */
  inscripcion: string | null
  /**
   * `true` si está abierto a gente de fuera de la PUCP, `false` si no, `null` si en la
   * hoja dice algo que no es ni sí ni no («Maso»). En `null` no se muestra distintivo:
   * es mejor no decir nada que decir algo que quizá no sea cierto.
   */
  permiteExternos: boolean | null
}

/** Todo lo que la sección de agenda necesita para renderizarse. */
export type ContenidoEventos = {
  eventos: Evento[]
}
