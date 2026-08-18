/**
 * Cliente de lectura de Google Sheets. COMPARTIDO por las dos hojas del proyecto
 * —patrocinio y eventos—, así que acá no hay nada específico de ninguna.
 *
 * ── Por qué no se usa el paquete `googleapis` ────────────────────────────────────────
 * Todo lo que este proyecto necesita de Google es UNA llamada de solo lectura
 * (`spreadsheets.values.batchGet`). `googleapis` trae decenas de megas de superficie
 * para cientos de servicios que no se tocan, y la imagen de Docker de producción está
 * deliberadamente mantenida en ~314 MB. Con `google-auth-library` (que es lo único
 * genuinamente difícil: firmar el JWT y renovar el token) más `fetch` a la API REST,
 * el resultado es el mismo y se lee en una pantalla.
 *
 * ── Permisos ─────────────────────────────────────────────────────────────────────────
 * Ámbito de SOLO LECTURA. La app nunca escribe en la hoja, y la cuenta de servicio no
 * debería tener permiso para hacerlo. Ver docs/arquitectura.md §3.2.
 */

import { GoogleAuth } from 'google-auth-library'

const AMBITO_SOLO_LECTURA = 'https://www.googleapis.com/auth/spreadsheets.readonly'

/**
 * Cuánto se espera a Google antes de rendirse.
 *
 * Existe porque una regeneración de caché colgada es peor que una fallida: la fallida
 * cae al contenido de reserva y se acabó, la colgada retiene un worker. Diez segundos es
 * mucho más de lo que tarda `batchGet` en el peor día.
 */
const ESPERA_MAXIMA_MS = 10_000

/**
 * Una variable de entorno DEFINIDA PERO VACÍA es el caso que ya tumbó un despliegue en
 * este proyecto (ver lib/site-url.ts). Acá se trata igual que si no existiera.
 */
function variable(nombre: string): string | null {
  const valor = process.env[nombre]?.trim()
  return valor ? valor : null
}

/**
 * ¿Están las credenciales de la cuenta de servicio?
 *
 * Se consulta ANTES de intentar nada, para que la ausencia de credenciales —el estado
 * normal en desarrollo local— no produzca ni una excepción ni una línea de log. Caer al
 * contenido de reserva tiene que ser silencioso.
 */
export function hayCredencialesDeGoogle(): boolean {
  return Boolean(variable('GOOGLE_SERVICE_ACCOUNT_EMAIL') && variable('GOOGLE_PRIVATE_KEY'))
}

/**
 * Reconstruye la clave privada en formato PEM, venga como venga.
 *
 * ── Por qué hace falta tanta tolerancia ──────────────────────────────────────────────
 * Una clave privada es un bloque de varias líneas metido en una variable de entorno de
 * una sola línea, y cada herramienta que lee un `.env` resuelve ese conflicto distinto.
 * Ya se dieron los tres casos en este proyecto:
 *
 *   · Vercel y el JSON de Google Cloud → una línea con `\n` literales;
 *   · `node --env-file` → acepta valores de varias líneas y quita las comillas;
 *   · `next build` (dotenv) → con un valor de varias líneas **deja las comillas dentro**,
 *     así que la clave empieza por `"` y OpenSSL revienta con
 *     `error:1E08010C:DECODER routines::unsupported`, que no dice absolutamente nada.
 *
 * Ese último caso es traicionero: `pnpm probar:sponsors` funcionaba y `pnpm build` no,
 * con las mismas credenciales. En vez de exigirle a cada persona que la escriba de una
 * forma exacta, se normaliza: se quitan las comillas, se convierten los `\n` literales
 * en saltos reales, y se rearma el PEM línea por línea.
 */
function clavePrivada(valor: string): string {
  const lineas = valor
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\\n/g, '\n')
    .split('\n')
    .map((linea) => linea.trim())
    .filter(Boolean)

  const pem = `${lineas.join('\n')}\n`

  // Fallar acá con un mensaje entendible, y no en las tripas de OpenSSL diez líneas
  // después. El lector lo captura y cae al contenido de reserva; el motivo queda escrito.
  if (!/^-----BEGIN [A-Z ]*PRIVATE KEY-----/.test(pem)) {
    throw new Error(
      'GOOGLE_PRIVATE_KEY no parece una clave PEM: tiene que empezar con ' +
        '"-----BEGIN PRIVATE KEY-----". Cópiala del campo `private_key` del JSON de ' +
        'Google Cloud, entre comillas dobles y en una sola línea con los \\n literales.',
    )
  }

  return pem
}

let autenticacion: GoogleAuth | null = null

function obtenerAutenticacion(): GoogleAuth {
  // Se reutiliza entre llamadas a propósito: la librería cachea el token de acceso
  // dentro de esta instancia, así que crear una nueva cada vez significaría pedirle un
  // token a Google en cada regeneración.
  autenticacion ??= new GoogleAuth({
    credentials: {
      client_email: variable('GOOGLE_SERVICE_ACCOUNT_EMAIL') ?? '',
      private_key: clavePrivada(variable('GOOGLE_PRIVATE_KEY') ?? ''),
    },
    scopes: [AMBITO_SOLO_LECTURA],
  })

  return autenticacion
}

/**
 * Lee varios rangos de una hoja en UNA sola llamada.
 *
 * Es `batchGet` y no una llamada por pestaña por una razón concreta: con seis pestañas y
 * una regeneración cada diez minutos, una llamada por pestaña serían 36 peticiones por
 * hora contra la cuota, para traer exactamente lo mismo.
 *
 * Los rangos se escriben con columnas explícitas (`Niveles!A1:G200`) y nunca como la
 * pestaña entera: así el equipo puede agregar columnas internas a la derecha sin que la
 * web se entere, y nunca se leen datos que no se publican.
 *
 * Devuelve una matriz por cada rango pedido, EN EL MISMO ORDEN. Un rango sin datos
 * devuelve una matriz vacía, no un error.
 */
export async function leerRangos(idHoja: string, rangos: string[]): Promise<string[][][]> {
  const cliente = await obtenerAutenticacion().getClient()
  const { token } = await cliente.getAccessToken()

  if (!token) throw new Error('Google no devolvió un token de acceso')

  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(idHoja)}/values:batchGet`,
  )
  for (const rango of rangos) url.searchParams.append('ranges', rango)
  // FORMATTED_VALUE: los valores llegan como los ve una persona en la hoja. Es lo que se
  // quiere, porque todo lo que se publica es texto ("+30", "10 equipos") y nadie hace
  // cuentas con ello.
  url.searchParams.set('valueRenderOption', 'FORMATTED_VALUE')
  url.searchParams.set('majorDimension', 'ROWS')

  const respuesta = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    signal: AbortSignal.timeout(ESPERA_MAXIMA_MS),
    // La caché la maneja `unstable_cache` una capa más arriba. Que Next no meta otra.
    cache: 'no-store',
  })

  if (!respuesta.ok) {
    // 403 casi siempre significa lo mismo: nadie compartió la hoja con el correo de la
    // cuenta de servicio. Es el paso que más se olvida y el error de Google no lo dice.
    const pista =
      respuesta.status === 403
        ? ' — ¿compartiste la hoja con el correo de la cuenta de servicio, en modo Lector?'
        : ''
    throw new Error(`Google Sheets respondió ${respuesta.status}${pista}`)
  }

  const datos = (await respuesta.json()) as {
    valueRanges?: { values?: string[][] }[]
  }

  return rangos.map((_, indice) => datos.valueRanges?.[indice]?.values ?? [])
}
