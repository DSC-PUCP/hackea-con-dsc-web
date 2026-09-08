/**
 * Los dos identificadores de Google que el sitio necesita, leídos del entorno.
 *
 * Son dos cosas distintas que se parecen mucho y conviene no confundir:
 *
 *   · **Google Analytics** (`G-XXXXXXXXXX`) — mide visitas. Es lo que hace que el panel
 *     de analytics.google.com muestre algo.
 *   · **Google Search Console** (una cadena larga y opaca) — NO mide nada. Es solo una
 *     contraseña pública que le demuestra a Google que quien reclama el sitio en Search
 *     Console es quien puede editarlo. Una vez verificado ya no hace nada más, pero
 *     **no se quita**: si el `<meta>` desaparece, Google revoca la verificación.
 *
 * Ninguno de los dos es secreto: los dos acaban impresos en el HTML público. Están en
 * variables de entorno y no escritos acá porque cambian según el sitio (producción, una
 * copia de pruebas, el día que esto se mude al dominio de la universidad) y porque así
 * un despliegue sin configurar no manda datos a la cuenta equivocada.
 *
 * Paso a paso para obtener los dos valores: `docs/analitica-y-seo.md`.
 *
 * ── Por qué `''` cuenta como "no configurado" ──────────────────────────────────────
 * Misma lección que dejó `lib/site-url.ts`: una variable creada en el panel de Vercel y
 * dejada sin valor llega como cadena vacía, no como `undefined`. Sin este filtro, un
 * `NEXT_PUBLIC_GA_ID` vacío inyectaría el script de Google apuntando a la propiedad
 * `G-` (ninguna), y el `<meta>` de verificación saldría con `content=""`, que Search
 * Console lee como una verificación fallida en vez de como "todavía no está".
 */

/** Convierte una variable de entorno en `string` con contenido, o en `null`. */
function leer(valor: string | undefined): string | null {
  const limpio = valor?.trim()
  return limpio ? limpio : null
}

/**
 * ID de medición de Google Analytics 4. Empieza por `G-`.
 *
 * ⚠️ Es `NEXT_PUBLIC_*`: **se incrusta al compilar**, no se lee al arrancar. Ponerla o
 * cambiarla en Vercel exige volver a desplegar; guardar la variable no basta.
 */
export const idDeGoogleAnalytics = leer(process.env.NEXT_PUBLIC_GA_ID)

/**
 * Código de verificación de Google Search Console. Es el `content=` del `<meta>` que
 * ofrece Search Console, **no** la etiqueta entera: solo la cadena de dentro.
 *
 * Lo consume `app/layout.tsx` a través de `metadata.verification.google`, así que el
 * `<meta>` sale en TODAS las páginas del sitio. Search Console solo mira la portada,
 * pero que esté en todas no cuesta nada y sobrevive a que alguien cambie qué página es
 * la raíz.
 */
export const verificacionDeGoogle = leer(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION)
