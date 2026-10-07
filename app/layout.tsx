import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Outfit, Poppins, Space_Grotesk, Unbounded } from 'next/font/google'

import { Konami } from '@/components/konami'
import { KonamiEscena } from '@/components/konami-escena'
import { PointerParallax } from '@/components/pointer-parallax'
import { ScrollReveal } from '@/components/scroll-reveal'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { idDeGoogleAnalytics, verificacionDeGoogle } from '@/lib/google'
import { site, themeColor } from '@/lib/site-config'
import { assetPublico, urlDelSitio } from '@/lib/site-url'
import './globals.css'

/*
 * TIPOGRAFÍAS
 *
 * La identidad visual define tres: Agrandir Grand (títulos), CY Grotesk STD
 * (subtítulos) y Poppins (contenido). Las dos primeras son comerciales y no están en
 * el repo, así que acá se usan sustitutos libres del mismo género:
 *
 *   Agrandir Grand  →  Outfit         (geométrica, misma altura de x, pesos 100-900)
 *   CY Grotesk STD  →  Space Grotesk  (grotesca técnica, buen carácter en versalitas)
 *   Poppins         →  Poppins        (es la de marca: coincide exacto)
 *
 * Y una cuarta, que NO sustituye a ninguna: **Unbounded**, la letra "de póster". Es ancha,
 * como Agrandir Grand en las piezas publicadas, y solo se usa en mayúsculas en los
 * momentos clave (utilidad `font-poster`). Ponerla en todos los títulos los volvería un
 * grito continuo: su fuerza depende de que aparezca poco.
 *
 * El logotipo NO usa ninguna de estas: se sirve como imagen, así que el wordmark de
 * marca siempre sale exacto sin importar la tipografía del texto.
 *
 * Cuando se compren las licencias, ver docs/identidad-visual.md: el cambio es de dos
 * archivos y no toca ningún componente.
 */

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-unbounded',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  // Poppins no es variable: hay que pedir cada peso que se vaya a usar.
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  // urlDelSitio siempre es una URL absoluta válida, así que esto no puede reventar el
  // build. Ver lib/site-url.ts: antes sí lo hizo.
  metadataBase: new URL(urlDelSitio),
  title: site.seo.title,
  description: site.seo.description,
  keywords: [...site.seo.keywords],
  applicationName: site.name,
  authors: [{ name: site.organizerFull }],
  /*
   * La portada es la ÚNICA página que no traía canonical, y era justo la que más lo
   * necesita: es la que se comparte, la que Google visita primero y la que va a existir
   * en dos dominios a la vez el día de la mudanza al de la universidad. Sin ella, Google
   * decide por su cuenta cuál de las dos versiones indexa, y puede elegir la vieja.
   *
   * `/agenda` y `/sponsors` ya declaran el suyo en su propio `page.tsx`; esto completa el
   * juego. Sale de `urlDelSitio` por lo mismo que allá: el dominio no se escribe a mano
   * en ningún sitio.
   */
  alternates: {
    canonical: urlDelSitio,
  },
  /*
   * Prueba de propiedad para Google Search Console. Se imprime como
   * `<meta name="google-site-verification" content="...">`.
   *
   * Es `undefined` mientras no haya variable configurada — y NO un objeto con la cadena
   * vacía dentro — porque un `content=""` Search Console lo lee como una verificación
   * que falló, no como una que todavía no se ha hecho. Ver lib/google.ts.
   */
  verification: verificacionDeGoogle ? { google: verificacionDeGoogle } : undefined,
  openGraph: {
    type: 'website',
    locale: 'es_PE',
    url: urlDelSitio,
    siteName: site.name,
    title: site.seo.title,
    description: site.seo.description,
    images: [{ url: '/og.jpg', width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: site.seo.title,
    description: site.seo.description,
    images: ['/og.jpg'],
  },
  /*
   * Los iconos NO se declaran acá a propósito. Salen de `app/icon.svg` y
   * `app/apple-icon.png`, que Next detecta por el nombre del archivo y enlaza él solo.
   *
   * Dos razones para preferir la convención al bloque manual:
   *
   *  · Next les aplica el `basePath` y un hash de contenido. Un `icon: '/loquesea.png'`
   *    escrito a mano apunta a la raíz del dominio, y el día que el sitio viva en
   *    `/hack-with-dsc` deja de existir — el mismo fallo que obligó a crear
   *    `assetPublico()` en lib/site-url.ts.
   *  · Si este bloque existiera, GANARÍA sobre los archivos, y quien añadiera un
   *    `app/icon.png` no entendería por qué no pasa nada.
   *
   * Acá vivía un `icon` apuntando al logotipo (800x406), repetido dos veces: el navegador
   * lo aplastaba a cuadrado y el favicon salía deformado. Ver el comentario de app/icon.svg.
   */
}

export const viewport: Viewport = {
  // La web es dark-only a propósito. Ver el comentario de cabecera en globals.css.
  colorScheme: 'dark',
  themeColor,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`dark ${outfit.variable} ${spaceGrotesk.variable} ${unbounded.variable} ${poppins.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          Marca el documento como "con JavaScript" antes del primer pintado.
          Las animaciones de aparición al hacer scroll solo esconden contenido si esta
          clase existe, así que sin JS la página se ve completa en vez de en blanco.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body
        className="antialiased"
        /*
          La textura de grano es la única imagen que se pide desde el CSS, y el CSS no
          sabe si el sitio vive en un subdirectorio. Se le pasa la ruta ya resuelta por
          `assetPublico`, para que la regla de "ninguna ruta de asset escrita a mano"
          valga también ahí. La usa la utilidad `bg-brand-noise` de globals.css.
        */
        style={{ '--url-grano': `url(${assetPublico('/brand/noise.png')})` } as React.CSSProperties}
      >
        {/*
          El armazón común de TODAS las páginas vive acá, no en cada page.tsx.

          `PointerParallax` y `ScrollReveal` no dibujan nada: publican estado (la posición
          del cursor en variables CSS, y un atributo `data-visible` en lo que ya se ve) y
          el CSS decide qué se mueve. Estar en el layout significa que cualquier ruta
          nueva hereda el movimiento sin tener que acordarse de montarlos — y acordarse es
          justo lo que se olvida: sin `ScrollReveal`, todo lo que tenga `data-reveal`
          queda invisible en `opacity: 0`, y encima solo cuando el JavaScript SÍ carga.

          Consecuencia práctica: una página nueva es solo su `<main>`.
        */}
        <PointerParallax />
        <ScrollReveal />

        <SiteHeader />
        {children}
        <SiteFooter />

        {/*
          Los huevos de pascua: el saludo de consola y el código Konami. `Konami` solo
          escucha el teclado y pone `data-konami` en <html>; `KonamiEscena` es lo que se
          ve, y no pinta nada hasta que ese atributo existe. Van en el layout para que el
          código funcione en cualquier página.
        */}
        <Konami />
        <KonamiEscena />

        {/*
          Las DOS analíticas del sitio, y sí, miden lo mismo a propósito:

           · `<Analytics />` es la de Vercel. Viene incluida con el hosting, no usa
             cookies y da lo básico (visitas por página, de dónde llegan). Deja de existir
             el día que el sitio se mude a la MV de la universidad.
           · `<GoogleAnalytics />` es GA4, en la cuenta de DSC. Es la que sobrevive a esa
             mudanza, la que el equipo puede compartir con quien quiera, y la que se
             enlaza con Search Console para ver por qué búsquedas llega la gente.

          Las dos van condicionadas a producción por el mismo motivo: en desarrollo uno
          recarga la portada cincuenta veces por hora, y esas cincuenta visitas falsas
          ensucian los datos reales. Para probar que GA de verdad emite, hay que hacer
          `pnpm build && pnpm start` — eso ya es "producción" para Node.

          GA4 se salta además el `if` si no hay ID configurado, así que un despliegue de
          prueba de otra persona nunca manda datos a la propiedad de DSC.
        */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
        {process.env.NODE_ENV === 'production' && idDeGoogleAnalytics && (
          <GoogleAnalytics gaId={idDeGoogleAnalytics} />
        )}
      </body>
    </html>
  )
}
