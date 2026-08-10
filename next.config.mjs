/** @type {import('next').NextConfig} */
const nextConfig = {
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
