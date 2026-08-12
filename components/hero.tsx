import { ArrowDown, MessageCircle } from 'lucide-react'
import Image from 'next/image'

import { Chevron } from '@/components/brand/icons'
import { cintaPalabras, copy, links, site } from '@/lib/site-config'
import { assetPublico } from '@/lib/site-url'

/**
 * Portada a pantalla completa.
 *
 * Es un componente de servidor: todo el movimiento lo hace el CSS.
 *
 * La entrada del contenido usa la utilidad `enter` (animación CSS al cargar) y NO
 * `data-reveal`: lo que se ve al abrir la página no puede depender de que un
 * IntersectionObserver se dispare. `data-reveal` queda para las secciones de más
 * abajo, donde sí tiene sentido esperar el scroll.
 *
 * Capas, de atrás hacia adelante:
 *   1. rejilla tipo blueprint, difuminada hacia los bordes
 *   2. tres halos de neón que respiran (morado, azul, rojo)
 *   3. dos chevrons gigantes de marca, apenas visibles
 *   4. grano de película
 *   5. contenido: texto a la izquierda, Bugle a la derecha
 *   6. cinta de palabras que se desplaza, al pie
 */
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden pt-28 pb-0 lg:pt-24"
    >
      {/* ── Fondo ───────────────────────────────────────────────────────────── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="bg-brand-grid parallax-back absolute inset-[-2rem]" />

        <div className="glow-purple animate-breathe parallax-mid absolute top-[-14%] right-[-14%] size-[42rem] max-w-[130vw]" />
        <div className="glow-blue animate-breathe parallax-back absolute top-[-22%] left-[-18%] size-[38rem] max-w-[130vw] [animation-delay:-3s]" />
        <div className="glow-red animate-breathe parallax-mid absolute bottom-[-24%] left-[28%] size-[34rem] max-w-[130vw] [animation-delay:-6s]" />

        {/*
          Los chevrons del logotipo, en tamaño mural. La opacidad es deliberadamente
          bajísima: tienen que leerse como una textura de marca, no como dos formas
          geométricas compitiendo con Bugle. Al 7% se comían la composición.
        */}
        <Chevron
          dir="left"
          className="parallax-front absolute top-[20%] left-[-4rem] h-[16rem] w-auto text-brand-red/[0.035] lg:h-[22rem]"
        />
        <Chevron
          dir="right"
          className="parallax-front absolute right-[-4rem] bottom-[22%] h-[16rem] w-auto text-brand-purple/[0.035] lg:h-[22rem]"
        />

        <div className="bg-brand-noise absolute inset-0" />
        {/* Funde con la sección siguiente para que el corte no se note. */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />
      </div>

      {/* ── Contenido ───────────────────────────────────────────────────────── */}
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-8 px-5 md:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1fr)] lg:gap-6">
        {/* En móvil se apila: primero el texto, después Bugle. En escritorio, el grid
            los pone lado a lado sin necesidad de reordenar nada. */}
        <div className="text-center lg:text-left">
          <p
            className="enter inline-flex items-center gap-2.5 rounded-full border border-brand-green/30 bg-brand-green/10 px-3.5 py-1.5 font-subtitle text-[0.7rem] font-semibold tracking-[0.22em] text-brand-green uppercase"
          >
            <span className="animate-flicker size-1.5 rounded-full bg-brand-green" />
            {copy.hero.eyebrow}
          </p>

          {/*
            El wordmark se usa como imagen y no como texto porque las tipografías de
            marca (Agrandir Grand) son comerciales y no están en el repo. Así el
            logotipo sale exacto. El texto real va en un <span> para lectores de
            pantalla y para el SEO.
          */}
          <h1
            style={{ '--enter-delay': '90ms' } as React.CSSProperties}
            className="enter mt-7"
          >
            <span className="sr-only">{site.name}</span>
            <Image
              src={assetPublico('/brand/logo-hack-with-dsc.webp')}
              alt=""
              width={800}
              height={406}
              priority
              className="logo-glow mx-auto w-[min(100%,20rem)] sm:w-[min(100%,24rem)] lg:mx-0 lg:w-[min(100%,27rem)]"
            />
          </h1>

          <p
            style={{ '--enter-delay': '180ms' } as React.CSSProperties}
            className="enter mt-8 font-display text-3xl leading-[1.08] font-extrabold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem]"
          >
            {copy.hero.titulo.normal}{' '}
            <span className="text-brand-gradient">{copy.hero.titulo.destacado}</span>.
          </p>

          <p
            style={{ '--enter-delay': '260ms' } as React.CSSProperties}
            className="enter mx-auto mt-5 max-w-xl text-base leading-relaxed text-pretty text-muted-foreground lg:mx-0 lg:text-lg"
          >
            {copy.hero.descripcion}
          </p>

          <div
            style={{ '--enter-delay': '340ms' } as React.CSSProperties}
            className="enter mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center lg:justify-start"
          >
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 font-subtitle text-base font-semibold"
            >
              <MessageCircle className="size-5" aria-hidden />
              {copy.hero.ctaPrimario}
            </a>

            <a
              href="#que-es"
              className="group inline-flex items-center justify-center gap-2.5 rounded-full border border-input bg-card/50 px-7 py-3.5 font-subtitle text-base font-semibold backdrop-blur-sm transition-colors hover:border-brand-purple/50 hover:bg-card"
            >
              {copy.hero.ctaSecundario}
              <ArrowDown
                className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden
              />
            </a>
          </div>
        </div>

        {/*
          ── Bugle ───────────────────────────────────────────────────────────────
          Tres capas anidadas, y tienen que estar separadas: `enter`,
          `parallax-front` y `animate-float` mueven las tres la MISMA propiedad
          (`translate`). En un solo elemento se pisarían — y peor: `enter` termina en
          `translate: 0 0` con relleno `both`, así que dejaría el parallax congelado
          para siempre.
        */}
        <div>
          <div style={{ '--enter-delay': '120ms' } as React.CSSProperties} className="enter">
            <div className="parallax-front relative mx-auto w-[min(100%,30rem)] lg:w-full">
              {/* Aura detrás de la mascota, para asentarla en la escena. */}
              <div
                aria-hidden
                className="glow-purple animate-breathe absolute inset-[-22%] -z-10"
              />
              <div className="animate-float">
                <Image
                  src={assetPublico('/brand/bugle-cyberpunk.webp')}
                  alt={copy.hero.bugleAlt}
                  width={967}
                  height={696}
                  priority
                  sizes="(min-width: 1024px) 46vw, 90vw"
                  className="bugle-shadow w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Pie de la portada ───────────────────────────────────────────────── */}
      <div className="relative mt-12 lg:mt-16">
        <a
          href="#que-es"
          className="mx-auto mb-8 flex w-fit flex-col items-center gap-2 font-subtitle text-[0.7rem] tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          {copy.hero.scrollCue}
          <ArrowDown className="animate-cue size-4" aria-hidden />
        </a>

        <Cinta />
      </div>
    </section>
  )
}

/**
 * Cinta de palabras que se desplaza sin parar.
 *
 * Cómo funciona el bucle sin costuras: se renderiza la lista 4 veces y la animación
 * mueve la pista -50%. Al terminar, la segunda mitad quedó exactamente donde estaba
 * la primera, así que el reinicio es invisible.
 *
 * Por qué 4 y no 2: cada mitad tiene que ser más ancha que la pantalla, o se vería un
 * hueco en monitores grandes. Dos copias por mitad dan de sobra.
 *
 * Solo la primera copia se anuncia a los lectores de pantalla; el resto es decoración.
 */
function Cinta() {
  const mitad = [...cintaPalabras, ...cintaPalabras]

  return (
    <div className="mask-fade-x relative flex overflow-hidden border-y border-border/70 bg-card/30 py-3.5">
      <div className="animate-marquee flex shrink-0 items-center gap-7 pr-7">
        {[...mitad, ...mitad].map((palabra, indice) => (
          <span
            key={`${palabra}-${indice}`}
            aria-hidden={indice >= cintaPalabras.length}
            className="flex shrink-0 items-center gap-7 font-subtitle text-sm font-semibold tracking-[0.14em] text-muted-foreground uppercase"
          >
            {palabra}
            <Chevron dir="right" className="h-3 w-auto text-brand-purple" />
          </span>
        ))}
      </div>
    </div>
  )
}
