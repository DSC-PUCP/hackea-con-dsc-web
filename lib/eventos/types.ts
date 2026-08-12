/**
 * Modelo de datos de los eventos.
 *
 * ⚠️ TODAVÍA NO SE USA EN LA WEB. La página no muestra nada de eventos por decisión
 * de producto: primero tiene que estar lista la lectura desde Google Sheets con caché.
 * Ver docs/arquitectura.md → "Fase 2".
 *
 * Estos tipos son el contrato entre la hoja de cálculo y la interfaz. Están calcados
 * de las columnas que ya usa el equipo en su hoja de planificación
 * (`internals/Eventos | Hack with DSC.xlsx`), así que quien implemente el lector solo
 * tiene que mapear columna → campo.
 *
 * Regla de oro del mapeo: la hoja es la fuente de verdad del CONTENIDO, pero nunca
 * de la PRESENTACIÓN. Nada de colores, clases ni HTML dentro de las celdas.
 */

// hola soy claude 🫠

/** Los formatos de evento del programa. Coincide con la columna "Tipo" de la hoja. */
export type TipoEvento = 'Taller' | 'Ponencia' | 'Hackathon' | 'Networking' | 'Panel'

/**
 * Una persona que participa en un evento: ponente, mentor o jurado.
 * Viene de la hoja de personas, que se une con la de eventos por `id`.
 */
export type Persona = {
  /** Columna "ID Persona". Estable: no cambia aunque se corrija el nombre. */
  id: string
  /** Columna "Nombres y apellidos". */
  nombre: string
  /** Columna "LinkedIn URL". `null` si no tiene o no quiso compartirlo. */
  linkedin: string | null
  /** Columna "Github URL". */
  github: string | null
  /** Columna "IMAGEN URL". Foto de perfil. */
  imagen: string | null
}

export type Evento = {
  /** Columna "EVENT_ID". Es la clave estable del evento; nunca se reutiliza. */
  id: string
  /** Columna "Nombre de evento". */
  titulo: string
  /** Columna "Tipo". */
  tipo: TipoEvento
  /** Columna "Temática": de qué trata, en una frase. */
  tematica: string
  /**
   * Columna "Info web": el texto que sí se publica.
   * Ojo: la hoja también tiene "Observaciones", que es interno y NO se publica.
   */
  infoWeb: string | null

  /**
   * Fecha confirmada, en ISO 8601 (`2026-08-20`).
   * `null` cuando todavía es tentativa: en ese caso se usa `fechaTentativa`.
   */
  fecha: string | null
  /** Columna "Fecha tentativa": texto libre tipo "Sem 3". Se muestra tal cual. */
  fechaTentativa: string | null
  /** Columna "Hora", texto libre: "12:00pm – 2:00pm". */
  hora: string | null
  /** Columna "Tiempo": duración o formato ("2 o 3 días", "24 horas"). */
  duracion: string | null
  /** Columna "Lugar". `null` o "Por confirmar" mientras no se sepa. */
  lugar: string | null

  /** Columna "Permite externos a PUCP". */
  permiteExternos: boolean
  /** Columna "Link de inscripción (luma)". `null` → mostrar "próximamente". */
  inscripcion: string | null

  ponentes: Persona[]
  mentores: Persona[]
  jurados: Persona[]

  /**
   * Columna "Mostrable en web".
   *
   * Es el interruptor editorial del equipo: el lector DEBE descartar todo evento en
   * el que esto sea falso. Así la hoja puede tener eventos a medio planificar sin
   * riesgo de que se filtren a la web.
   */
  mostrableEnWeb: boolean
}

/**
 * Lo que devuelve el lector de la hoja.
 *
 * Trae `obtenidoEn` para poder mostrar en la interfaz cuándo se actualizó por última
 * vez, y `origen` para saber si se está viendo dato fresco o la copia en caché — que
 * es justo lo que se necesita para depurar cuando alguien reclama "ya lo cambié en la
 * hoja y la web no se actualiza".
 */
export type ResultadoEventos = {
  eventos: Evento[]
  obtenidoEn: string
  origen: 'sheets' | 'cache'
}
