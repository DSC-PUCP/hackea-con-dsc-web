import { ArrowLeft, CalendarDays } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { copy } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'

/**
 * La 404. Next la muestra para cualquier URL que no exista (y para `notFound()`), dentro
 * del layout raíz: header, pie y movimiento vienen solos, así que esto es solo su `<main>`.
 * Next añade por su cuenta el `noindex`, así que no hace falta declarar metadatos.
 *
 * Todo está arriba del pliegue, así que entra con `enter` y no con `data-reveal`.
 */
export default function NotFound() {
  const t = copy.noEncontrado

  return (
    <main className="relative overflow-hidden">
      {/* La rejilla es lo único de "cabecera" que lleva: esta página ES su cabecera. */}
      <div aria-hidden className="bg-brand-grid absolute inset-0 -z-10" />

      <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 pt-28 pb-20 md:px-6 lg:min-h-[44rem] lg:grid-cols-[1.05fr_1fr] lg:gap-14 lg:pt-32">
        {/*
          Bugle a la izquierda en escritorio, mirando hacia el texto: su gesto (rascarse la
          cabeza delante de la pantalla vacía) lleva la vista al título.

          El «404» va DENTRO de la pantalla roja del dibujo, como si fuera lo único que
          muestra. No está pintado en la imagen (el generador deformaba el texto), así que
          se coloca encima con porcentajes medidos sobre el arte y una deformación que
          imita la perspectiva de la pantalla. El tamaño va en `cqw` (ancho del contenedor)
          para que siga cabiendo en la pantalla a cualquier tamaño de la imagen.
        */}
        <div className="enter @container relative mx-auto w-[min(100%,22rem)] sm:w-[26rem] lg:w-full lg:max-w-[34rem]">
          <Image
            src={assetPublico('/brand/bugle-perdido.webp')}
            alt={t.bugleAlt}
            width={1100}
            height={1324}
            priority
            sizes="(min-width: 1024px) 34rem, (min-width: 640px) 26rem, 90vw"
            className="bugle-shadow w-full"
          />
          <p className="absolute top-[25%] left-[83.6%] -translate-x-1/2 -translate-y-1/2 [transform:skew(-11deg,-9deg)] font-poster text-[9.5cqw] leading-none font-black tracking-tight text-brand-light">
            {t.codigo}
          </p>
        </div>

        <div style={{ '--enter-delay': '120ms' } as React.CSSProperties} className="enter">
          <h1 className="font-display text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t.titulo}
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-muted-foreground">
            <ConCodigo texto={t.descripcion} />
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="btn-brand inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-subtitle text-base font-semibold"
            >
              <ArrowLeft className="size-4" aria-hidden />
              {t.volver}
            </Link>
            <Link
              href="/agenda"
              className="inline-flex items-center justify-center gap-2.5 rounded-full border border-input bg-card/50 px-7 py-3.5 font-subtitle text-base font-semibold transition-colors hover:border-brand-purple/50 hover:bg-card"
            >
              <CalendarDays className="size-4 text-brand-purple" aria-hidden />
              {t.agenda}
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

/**
 * Pinta como código lo que en el texto va entre comillas invertidas, como en Markdown.
 *
 * Así la frase se queda entera y legible en lib/site-config.ts (`Ni \`git log\` la
 * encuentra…`) en vez de partida en tres trozos que nadie sabría volver a juntar. Al
 * partir por la comilla, los trozos impares son siempre los que iban entre comillas.
 */
function ConCodigo({ texto }: { texto: string }) {
  return texto.split('`').map((trozo, i) =>
    i % 2 === 1 ? (
      <code
        key={i}
        className="rounded-md bg-brand-green/10 px-1.5 py-0.5 font-mono text-[0.9em] text-brand-green"
      >
        {trozo}
      </code>
    ) : (
      trozo
    ),
  )
}
