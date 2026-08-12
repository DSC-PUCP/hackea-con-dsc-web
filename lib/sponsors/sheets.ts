/**
 * Lectura de la hoja de patrocinio.
 *
 * Es una hoja NUEVA y separada de la de eventos, con su propia variable de entorno. El
 * motivo no es técnico: así se le puede dar permiso de edición del material de sponsors
 * a gente que no debe poder tocar la agenda del programa.
 *
 * Se comparten `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_PRIVATE_KEY`, pero **el permiso
 * no se hereda**: hay que compartir también esta hoja con el correo de la cuenta de
 * servicio, en modo Lector. Es el paso que todo el mundo olvida.
 */

import { leerRangos } from '../sheets/cliente.ts'
import { aFilas } from '../sheets/filas.ts'

import {
  activosDesdeFilas,
  aliadosDesdeFilas,
  metricasDesdeFilas,
  nivelesDesdeFilas,
  testimoniosDesdeFilas,
  textosDesdeFilas,
} from './esquemas.ts'
import type { ContenidoSponsors } from './types.ts'

/**
 * Los rangos que se leen, con columnas EXPLÍCITAS y en una sola llamada.
 *
 * Las columnas van escritas (`A1:C400`) y no como la pestaña entera a propósito: el
 * equipo tiene que poder agregar columnas internas a la derecha —notas, responsables,
 * fechas de contacto— sin que la web las lea ni se rompa por ellas.
 *
 * Los topes de fila son holgados. Pedir de más no cuesta nada: Google devuelve solo las
 * filas que existen.
 */
const RANGOS = [
  'Textos!A1:C400',
  'Activos!A1:F200',
  'Niveles!A1:G100',
  'Beneficios!A1:E400',
  'Aliados!A1:F300',
  'Metricas!A1:E100',
  'Testimonios!A1:G200',
]

/**
 * Lee la hoja entera y la convierte en `ContenidoSponsors`.
 *
 * Devuelve `null` —y no lanza— cuando no se puede leer. Quien llama sabe qué hacer con
 * eso: caer al contenido de reserva. La página no se cae porque la API de Google tenga
 * un mal día, que es un requisito explícito del encargo.
 */
export async function leerSponsorsDesdeSheets(): Promise<ContenidoSponsors | null> {
  const idHoja = process.env.GOOGLE_SHEETS_SPONSORS_ID?.trim()

  // Definida pero vacía cuenta como no configurada. Ver lib/site-url.ts: ese matiz ya
  // costó un despliegue en este proyecto.
  if (!idHoja) return null

  try {
    const [textos, activos, niveles, beneficios, aliados, metricas, testimonios] =
      await leerRangos(idHoja, RANGOS)

    return {
      textos: textosDesdeFilas(aFilas(textos)),
      activos: activosDesdeFilas(aFilas(activos)),
      niveles: nivelesDesdeFilas(aFilas(niveles), aFilas(beneficios)),
      aliados: aliadosDesdeFilas(aFilas(aliados)),
      metricas: metricasDesdeFilas(aFilas(metricas)),
      testimonios: testimoniosDesdeFilas(aFilas(testimonios)),
    }
  } catch (error) {
    console.error('[sponsors] no se pudo leer la hoja; se usa el contenido de reserva:', error)
    return null
  }
}
