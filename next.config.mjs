/**
 * Deduce el `basePath` a partir de `NEXT_PUBLIC_SITE_URL`.
 *
 * ── Para qué sirve ────────────────────────────────────────────────────────────────────
 * Hoy el sitio vive en la raíz de un dominio (`https://hack-with-dsc.vercel.app/`), y
 * `basePath` queda desactivado. En el futuro va a vivir en un SUBDIRECTORIO del dominio
 * oficial de DSC: `https://dsc.inf.pucp.edu.pe/hack-with-dsc`.
 *
 * En ese escenario Next necesita saber el prefijo, porque si no pide sus propios archivos
 * (`/_next/static/...`) a la raíz del dominio, donde no están: la web carga sin estilos y
 * los enlaces internos llevan al sitio equivocado.
 *
 * ── Por qué se deriva y no es su propia variable ──────────────────────────────────────
 * Podría existir un `BASE_PATH` aparte, pero entonces habría DOS fuentes para el mismo
 * dato (la ruta dentro de la URL, y el prefijo) y en cuanto se desincronizaran tendríamos
 * un fallo confuso: metadatos apuntando a un sitio y assets a otro.
 *
 * Con una sola variable no hay nada que sincronizar. Para mudar el sitio al
 * subdirectorio basta compilar con:
 *
 *   NEXT_PUBLIC_SITE_URL=https://dsc.inf.pucp.edu.pe/hack-with-dsc
 *
 * y tanto el `basePath` como las URL de Open Graph, el sitemap y el canonical salen bien
 * solos. Ver docs/despliegue.md y lib/site-url.ts.
 */
function basePathDesdeUrlDelSitio() {
  const valor = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (!valor) return undefined

  try {
    const url = new URL(/^https?:\/\//i.test(valor) ? valor : `https://${valor}`)
    // Next exige que empiece con "/" y que NO termine con "/". Sin ruta, pathname es "/",
    // que al quitarle la barra queda vacío: eso significa "raíz", o sea sin basePath.
    const ruta = url.pathname.replace(/\/+$/, '')
    return ruta || undefined
  } catch {
    // Valor inválido: lo maneja lib/site-url.ts. Acá simplemente no hay basePath.
    return undefined
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: basePathDesdeUrlDelSitio(),

  /**
   * Este proyecto se despliega en DOS sitios, y cada uno quiere un empaquetado
   * distinto:
   *
   *   · Docker en la MV → necesita `standalone`: empaqueta la app con solo las
   *     dependencias que de verdad usa, en `.next/standalone`. Es lo que permite que
   *     la imagen no lleve `node_modules` completo (~314 MB en vez de ~1 GB) y que el
   *     servidor no necesite tener Node ni pnpm instalados.
   *
   *   · Vercel → NO lo necesita. Vercel detecta Next.js y aplica su propio
   *     empaquetado; `standalone` le sobra y lo ignora.
   *
   * Por eso se activa solo cuando se pide de forma explícita, y quien lo pide es el
   * Dockerfile (`ENV NEXT_OUTPUT=standalone` en la etapa de compilación). Así ningún
   * target arrastra configuración del otro.
   */
  output: process.env.NEXT_OUTPUT === 'standalone' ? 'standalone' : undefined,

  /**
   * Las imágenes ya vienen optimizadas del repo: `scripts/prepare-assets.mjs`
   * (`pnpm assets`) genera los WebP de `public/brand/`. Por eso no hace falta el
   * optimizador de Next en tiempo de ejecución, lo que evita tener que instalar
   * `sharp` en el contenedor y quita una pieza que se puede romper en el servidor.
   *
   * Si algún día se sirven imágenes externas (fotos de ponentes desde Google Drive),
   * habrá que quitar esto y declarar los dominios en `images.remotePatterns`.
   */
  images: {
    unoptimized: true,
  },

  /**
   * Los errores de TypeScript rompen el build a propósito.
   *
   * Antes estaba en `true`, lo que dejaba pasar errores reales hasta producción. Si el
   * build falla por tipos, se arregla el tipo — no se vuelve a poner en `true`.
   */
  typescript: {
    ignoreBuildErrors: false,
  },

  /** No expone la cabecera `X-Powered-By: Next.js`. */
  poweredByHeader: false,
}

export default nextConfig
