/**
 * Lectura de la hoja de eventos.
 *
 * Es una hoja SEPARADA de la de patrocinio, con su propia variable de entorno
 * (`GOOGLE_SHEETS_EVENTS_ID`). El motivo no es técnico: así se le puede dar permiso de
 * edición de la agenda a quien organiza los eventos sin darle acceso al material de
 * sponsors, y al revés.
 *
 * Se comparten `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_PRIVATE_KEY`, pero **el permiso
 * no se hereda**: hay que compartir también esta hoja con el correo de la cuenta de
 * servicio, en modo Lector. Es el paso que todo el mundo olvida, y da un 403.
 */

import { leerRangos } from '../sheets/cliente.ts'
import { aFilas } from '../sheets/filas.ts'

import { eventosDesdeFilas, personasDesdeFilas } from './esquemas.ts'
import type { ContenidoEventos } from './types.ts'

/**
 * Los rangos que se leen.
 *
 * ── Por qué acá se lee ANCHO y en sponsors no ────────────────────────────────────────
 * `lib/sponsors/sheets.ts` pide columnas exactas (`Aliados!A1:F300`) para no leer nunca
 * lo interno. Acá se pide `A1:Z200` a propósito, y es una decisión distinta tomada con
 * los ojos abiertos:
 *
 * El equipo tiene que poder reordenar columnas en la hoja sin avisar a nadie. Con un
 * rango estrecho, meter una columna a la izquierda empuja una columna publicable fuera
 * del borde derecho y esa información desaparece de la web en silencio — el peor fallo
 * posible en una hoja que editan seis personas.
 *
 * Leer ancho significa que columnas internas (`Lugar`, `Obs`, `RESPONSABLE`, `CORREOS`,
 * el enlace a los docs) sí llegan a la memoria del servidor. **No pueden llegar al
 * navegador**: `lib/eventos/esquemas.ts` construye el objeto `Evento` campo por campo, y
 * lo que no esté en esa lista no existe para el resto del programa. La condición para que
 * esto siga siendo cierto es que nadie añada un `...fila` a ese mapeo.
 *
 * Los topes de fila son holgados: Google devuelve solo las filas que existen, así que
 * pedir de más no cuesta nada.
 */
const RANGOS = ["'Info Eventos (Web)'!A1:Z200", "'Info Personas (Web)'!A1:Z200"]

/**
 * Lee la hoja entera y la convierte en `ContenidoEventos`.
 *
 * Devuelve `null` —y no lanza— cuando no se puede leer. Quien llama sabe qué hacer con
 * eso: no pintar la sección. La portada no se cae porque la API de Google tenga un mal
 * día.
 *
 * El orden importa: las personas se leen primero porque los eventos las referencian por
 * ID, y un evento no puede resolver a sus ponentes antes de que exista el índice.
 */
export async function leerEventosDesdeSheets(): Promise<ContenidoEventos | null> {
  const idHoja = process.env.GOOGLE_SHEETS_EVENTS_ID?.trim()

  // Definida pero vacía cuenta como no configurada. Ver lib/site-url.ts: ese matiz ya
  // costó un despliegue en este proyecto.
  if (!idHoja) return null

  try {
    const [eventos, personas] = await leerRangos(idHoja, RANGOS)

    return {
      eventos: eventosDesdeFilas(aFilas(eventos), personasDesdeFilas(aFilas(personas))),
    }
  } catch (error) {
    console.error('[eventos] no se pudo leer la hoja; la agenda no se muestra:', error)
    return null
  }
}
