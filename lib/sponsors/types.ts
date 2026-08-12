/**
 * Modelo de datos de la página de patrocinio (`/sponsors`).
 *
 * Es el contrato entre la hoja de cálculo de patrocinio y la interfaz. Igual que en
 * `lib/eventos/types.ts`, la hoja es la fuente de verdad del CONTENIDO pero nunca de la
 * PRESENTACIÓN: en las celdas no van colores, ni clases, ni HTML.
 *
 * Todo lo que llega de la hoja pasa antes por `lib/sponsors/esquemas.ts`, así que a
 * partir de acá el resto del código trabaja con datos ya limpios: sin filas ocultas, sin
 * campos vacíos disfrazados de string, y ya ordenados.
 *
 * Convención que comparten TODAS las pestañas:
 *   · columna `mostrable` (SÍ/NO) — el interruptor editorial. Se filtra antes que nada;
 *   · columna `orden` (número)    — el orden de aparición.
 * Ninguna de las dos llega hasta acá: se consumen al validar.
 */

/**
 * Copia editorial de la página, como pares clave–valor (`hero.titulo`, `cta.label`…).
 *
 * Es un `Record` y no un tipo con campos fijos a propósito: la hoja tiene que poder
 * ganar claves sin que haya que tocar el repo. Las claves que la página espera están
 * escritas —y explicadas— en `lib/sponsors/fallback.ts`, que además es lo que se usa
 * cuando una falta.
 */
export type Textos = Record<string, string>

/** Claves válidas de la columna `icono` de la pestaña `Activos`. */
export type IconoActivo = 'visibilidad' | 'comunidad' | 'premio' | 'campus' | 'contenido'

/** Uno de los activos que DSC entrega a cambio del patrocinio. */
export type Activo = {
  id: string
  titulo: string
  descripcion: string
  /** `null` si la hoja trae una clave que no está en el mapa de iconos: se pinta sin icono. */
  icono: IconoActivo | null
  orden: number
}

export type Beneficio = {
  beneficio: string
  /** Texto secundario, más chico. Opcional. */
  detalle: string | null
  orden: number
}

export type Nivel = {
  /** Identificador estable en minúsculas. NUNCA el nombre: el nombre cambia. */
  id: string
  nombre: string
  resumen: string
  /**
   * Texto libre sobre el aporte. Puede estar vacío.
   *
   * Es TEXTO, no un número: no se parsea, no se ordena y no se compara. Si algún día se
   * publican rangos, van acá tal cual los escriba el equipo.
   */
  aporteTexto: string | null
  /** Resalta el nivel. Como máximo uno; el validador se encarga de que así sea. */
  destacado: boolean
  orden: number
  /** Un nivel sin beneficios se muestra igual, con su `resumen`. No es un error. */
  beneficios: Beneficio[]
}

export type Aliado = {
  nombre: string
  /**
   * Ruta ya resuelta y lista para usar en un `src`: o una URL absoluta tal como vino de
   * la hoja, o `/sponsors/aliados/<archivo>` si vino solo el nombre del archivo.
   * `null` si no hay logo: entonces se muestra el nombre en texto.
   */
  logo: string | null
  url: string | null
  /** Texto libre ("Torneo de Vibecoding 2026"). Si está vacío, no se agrupa. */
  edicion: string | null
  orden: number
}

export type Metrica = {
  /** Texto, no número: `+30`, `10 equipos`, `4.2k`. No se formatea ni se hacen cuentas. */
  valor: string
  etiqueta: string
  nota: string | null
  orden: number
}

export type Testimonio = {
  autor: string
  rol: string | null
  /** Puede ser largo de verdad: son publicaciones de LinkedIn de 400+ palabras. */
  texto: string
  url: string | null
  /** Misma resolución que `logo` en `Aliado`. Si falta, se muestran las iniciales. */
  foto: string | null
  orden: number
}

/** Todo lo que la página necesita para renderizarse. */
export type ContenidoSponsors = {
  textos: Textos
  activos: Activo[]
  niveles: Nivel[]
  aliados: Aliado[]
  metricas: Metrica[]
  testimonios: Testimonio[]
}
