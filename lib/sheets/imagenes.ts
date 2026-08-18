/**
 * Traduce enlaces de Google Drive a algo que un `<img src>` pueda usar. COMPARTIDO: lo
 * usan los logos de aliados en `/sponsors` y las fotos de las personas de la agenda.
 *
 * ── El problema, en una línea ────────────────────────────────────────────────────────
 * El enlace que Drive te da al pulsar "Compartir" **no es una imagen**. Es una página
 * web con visor, botones y menús:
 *
 *   https://drive.google.com/file/d/1fq1Jm…/view?usp=drive_link   →  text/html, 74 KB
 *
 * Puesto en un `<img>`, el navegador descarga ese HTML, no lo reconoce como imagen y
 * deja el hueco. En esta web eso se ve como el nombre de la empresa en texto (que es el
 * respaldo correcto), pero el logo no aparece nunca y nadie entiende por qué.
 *
 * ── La solución ──────────────────────────────────────────────────────────────────────
 * Del enlace se extrae el identificador del archivo y se rearma apuntando al endpoint
 * que sí devuelve los bytes de la imagen. Medido sobre el mismo archivo:
 *
 *   uc?export=view&id=…        →  image/png, 39 KB   (el original)
 *   thumbnail?id=…&sz=w600     →  image/png, 15 KB   ← se usa este
 *
 * Se elige `thumbnail` porque devuelve la imagen ya redimensionada. Un logo se muestra
 * a 48 px de alto: bajar 15 KB en vez de 39 KB por logo es gratis, y en una página que
 * se abre desde el celular con datos móviles se nota.
 *
 * ── Lo que hay que saber antes de confiar en esto ────────────────────────────────────
 *
 *  · **El archivo tiene que estar compartido como "cualquier persona con el enlace"**,
 *    en modo Lector. Si no, Drive responde con un error y el logo no carga.
 *  · **Estos endpoints no están documentados por Google.** Funcionan hoy y llevan años
 *    funcionando, pero Google ya rompió antes formas parecidas (`uc?export=view` da
 *    problemas con archivos grandes). El día que cambien, esta web no se rompe: cada
 *    imagen lleva el nombre como texto alternativo, así que se degrada a texto.
 *  · **Drive no es un CDN.** No promete cabeceras de caché ni velocidad, y tiene límites
 *    de descarga. Para un puñado de logos va sobrado; para las fotos de una galería
 *    entera, mejor el repo.
 *  · **El `<img>` que las pinta tiene que llevar `referrerPolicy="no-referrer"`.** Ver
 *    abajo; sin eso las imágenes no cargan en desarrollo.
 *
 * ── Por qué hace falta `referrerPolicy="no-referrer"` ────────────────────────────────
 * `thumbnail` no devuelve la imagen: devuelve un 302 a `lh3.googleusercontent.com`, y ese
 * segundo servidor MIRA LA CABECERA `Referer` y rechaza los que no le gustan con un
 * **429 y un HTML de error** — no un 403, lo que despista bastante al mirar la pestaña
 * Network. Medido sobre el mismo archivo, tres veces seguidas y con idéntico resultado:
 *
 *   (sin Referer)                    →  200, image/png     ← lo que se usa
 *   Referer: http://localhost:3000/  →  429, text/html
 *   Referer: https://localhost:3000/ →  429, text/html
 *   Referer: http://localhost/       →  429, text/html
 *   Referer: http://127.0.0.1:3000/  →  200, image/png
 *   Referer: https://example.com/    →  200, image/png
 *
 * O sea: lo que Google bloquea es el nombre `localhost`, sin importar esquema ni puerto.
 * Con la política por defecto del navegador (`strict-origin-when-cross-origin`) TODA la
 * web sale con los logos rotos en `next dev`, mientras que en Vercel se ven bien — un
 * fallo que solo existe en la máquina de quien desarrolla, que es el peor tipo de fallo.
 *
 * Quitando el `Referer` la imagen carga desde cualquier origen, así que además deja de
 * importar qué dominios decida bloquear Google mañana. No se pierde nada: es una imagen
 * pública en un servidor ajeno, y ese servidor no necesita saber quién la enlaza.
 *
 * Por eso Drive es la opción cómoda —se edita la hoja y listo, sin desplegar— y
 * `public/sponsors/` sigue siendo la opción robusta para lo que ya no va a cambiar.
 */

/**
 * Ancho al que Drive entrega la imagen. 600 px cubre de sobra el uso más grande de la
 * web (un logo a 48 px de alto en una pantalla 3x) sin traerse el original completo.
 */
const ANCHO_POR_DEFECTO = 600

/**
 * Las formas en las que un identificador de Drive llega pegado en una celda. Son todas
 * las que produce la propia interfaz de Google según por dónde copies el enlace.
 */
const PATRONES_DE_DRIVE = [
  /drive\.google\.com\/file\/d\/([\w-]+)/i, // Compartir → Copiar vínculo
  /drive\.google\.com\/open\?[^\s]*\bid=([\w-]+)/i, // enlaces antiguos
  /drive\.google\.com\/(?:uc|thumbnail)\?[^\s]*\bid=([\w-]+)/i, // ya "directos"
  /docs\.google\.com\/uc\?[^\s]*\bid=([\w-]+)/i,
  /lh3\.googleusercontent\.com\/d\/([\w-]+)/i, // el CDN, sin parámetros
]

/**
 * Si la URL es de Google Drive, la reescribe para que devuelva la imagen. Cualquier otra
 * cosa se devuelve intacta: un enlace a un CDN propio o al sitio de la empresa ya sirve
 * tal cual y no hay que tocarlo.
 */
export function urlDeImagen(url: string, ancho: number = ANCHO_POR_DEFECTO): string {
  for (const patron of PATRONES_DE_DRIVE) {
    const identificador = url.match(patron)?.[1]
    if (identificador) return `https://drive.google.com/thumbnail?id=${identificador}&sz=w${ancho}`
  }

  return url
}
