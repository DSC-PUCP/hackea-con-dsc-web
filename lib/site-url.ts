/**
 * Resuelve la URL pública del sitio.
 *
 * Vive en su propio archivo, y no en `lib/site-config.ts`, por dos razones:
 *
 *  1. `site-config.ts` lo importan componentes de cliente, y acá se leen variables de
 *     entorno que solo existen en el servidor (las `VERCEL_*` sin prefijo). En el
 *     paquete del navegador quedarían como `undefined`: no rompe nada, pero es código
 *     muerto viajando al usuario.
 *  2. Resolverla bien tiene más matices de los que parece (ver abajo), y merecen estar
 *     explicados en un solo sitio.
 *
 * Solo lo usa `app/layout.tsx`, para los metadatos de Open Graph.
 *
 * ── Por qué existe toda esta ceremonia ──────────────────────────────────────────────
 * La versión anterior era `process.env.NEXT_PUBLIC_SITE_URL ?? '<dominio>'`, y rompió
 * el build en Vercel con `TypeError: Invalid URL, input: ''`.
 *
 * El motivo: `??` solo cae al valor por defecto con `null` o `undefined`. Una variable
 * DEFINIDA PERO VACÍA (que es lo que queda si se crea en el panel de Vercel sin
 * escribirle valor) pasa el filtro, llega como `''` a `new URL('')` y tumba el build
 * entero. Y falla en `next build`, no en tiempo de ejecución, así que se lleva el
 * despliegue completo por delante.
 *
 * De ahí las tres reglas de este módulo:
 *   · un valor vacío o con solo espacios se trata como "no configurado";
 *   · un valor inválido no rompe el build: se descarta y se prueba el siguiente;
 *   · siempre se devuelve una URL absoluta y válida.
 */

/**
 * Último recurso: el dominio donde vive el sitio hoy (Vercel, desde la rama `main`).
 *
 * Solo se usa si no hay ninguna variable de entorno útil — o sea, en desarrollo local.
 * En Vercel casi nunca se llega hasta acá, porque `VERCEL_PROJECT_PRODUCTION_URL` está
 * siempre definida (salvo que se desactive el acceso a variables de sistema).
 *
 * ⚠️ **Sin ruta.** Este valor no debe llevar subdirectorio. El día que el sitio se mueva a
 * `https://dsc.inf.pucp.edu.pe/hack-with-dsc`, eso NO se pone acá: se pone en la variable
 * `NEXT_PUBLIC_SITE_URL` al compilar, porque `next.config.mjs` deriva de ella el
 * `basePath` que Next necesita para que los assets se pidan del sitio correcto. Si se
 * escribiera la ruta acá, habría URL con subdirectorio pero sin `basePath`, y la web
 * saldría sin estilos. Ver docs/despliegue.md.
 */
const URL_POR_DEFECTO = 'https://hack-with-dsc.vercel.app'

/**
 * En orden de preferencia:
 *
 *  1. `NEXT_PUBLIC_SITE_URL` — la que se configura a mano. Manda siempre, porque es la
 *     única que puede apuntar al dominio propio de la universidad.
 *  2. `VERCEL_PROJECT_PRODUCTION_URL` — la pone Vercel sola y, según su documentación,
 *     está definida incluso en las previsualizaciones, apuntando siempre a producción.
 *     Es exactamente lo que se quiere para una imagen de Open Graph: que el preview de
 *     WhatsApp de una rama no enlace a la imagen de esa rama.
 *  3. `VERCEL_URL` — el dominio de ESTE despliegue concreto. Peor para Open Graph
 *     (cambia en cada deploy), pero mejor que nada.
 *
 * De 2 y 3 se prueban las dos variantes, con y sin el prefijo `NEXT_PUBLIC_`, porque
 * Vercel expone ambas para proyectos Next.js y ninguna está garantizada: dependen de la
 * casilla "Enable access to System Environment Variables" del panel.
 */
const candidatos = [
  process.env.NEXT_PUBLIC_SITE_URL,
  process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
  process.env.NEXT_PUBLIC_VERCEL_URL,
  process.env.VERCEL_URL,
]

/**
 * Normaliza un candidato a URL absoluta, o devuelve `null` si no sirve.
 *
 * Conserva la RUTA a propósito. Antes esto usaba `.origin`, que la descartaba, y con un
 * valor como `https://dsc.inf.pucp.edu.pe/hack-with-dsc` el sitemap y la imagen de Open
 * Graph acababan apuntando al dominio pelado — al sitio equivocado. El sitio puede vivir
 * en un subdirectorio de un dominio compartido, así que la ruta es parte de su identidad.
 *
 * Lo único que se quita es la barra final, para poder concatenar sin duplicarla.
 */
function normalizar(valor: string): string | null {
  // Las variables de Vercel vienen SIN esquema ("mi-sitio.vercel.app"), y una persona
  // configurando a mano se olvida del https:// la mitad de las veces.
  const conEsquema = /^https?:\/\//i.test(valor) ? valor : `https://${valor}`

  try {
    const url = new URL(conEsquema)
    // pathname siempre trae al menos "/", que acá sobra.
    const ruta = url.pathname.replace(/\/+$/, '')
    return `${url.origin}${ruta}`
  } catch {
    // Valor inválido: un dominio mal escrito no debe costar un despliegue.
    return null
  }
}

function resolver(): string {
  for (const candidato of candidatos) {
    const valor = candidato?.trim()
    if (!valor) continue

    const normalizado = normalizar(valor)
    if (normalizado) return normalizado
  }

  // El valor por defecto pasa por la misma normalización, para que la promesa de "sin
  // barra final" valga en TODOS los casos y no solo en algunos. El `??` final es por si
  // alguien deja el valor por defecto mal escrito: es mejor una URL fea que un build roto.
  return normalizar(URL_POR_DEFECTO) ?? 'https://localhost'
}

/**
 * URL pública del sitio: absoluta, válida y sin barra final. Puede incluir una ruta
 * (`https://dominio/subcarpeta`) si el sitio vive en un subdirectorio.
 */
export const urlDelSitio = resolver()
