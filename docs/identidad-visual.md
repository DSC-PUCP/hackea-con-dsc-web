# Identidad visual

Cómo se traduce la identidad de Hack with DSC a la web. La lámina oficial es
`identidad-visual/IDENTIDAD VISUAL HACK WITH DSC.png`; las piezas publicadas de referencia
están en `referencias/public_1/`.

---

## 1. Color

Los valores están muestreados píxel a píxel de la lámina oficial, no estimados a ojo.

| Token           | Hex       | Rol                                                              |
| --------------- | --------- | ---------------------------------------------------------------- |
| `--brand-ink`   | `#0F0D1C` | Fondo. Todo el sitio vive sobre este tinta violáceo               |
| `--brand-light` | `#F1F1F4` | Texto principal                                                  |
| `--brand-purple`| `#813DF5` | Color primario. Botones, halos, el chevron que cierra `❱`         |
| `--brand-blue`  | `#3D90F5` | Secundario. Cierra el degradado, halos, acentos                   |
| `--brand-red`   | `#F53D5C` | Acento cálido. El chevron que abre `❰`                            |
| `--brand-green` | `#64DA2C` | Energía. "·DSC PUCP PRESENTA·", "Muchos eventos". Úsalo con pinzas |

> El verde no aparece en la lámina de paleta, pero sí en las dos piezas publicadas, en el
> mismo rol las dos veces: la frase que remata. Se muestreó de ahí (`#64DA2C`) y se usa
> exactamente para eso — nunca como color de una superficie grande.

### La regla

Esos **seis** valores son los únicos colores literales de todo el proyecto, y viven en el
bloque `:root` de [`app/globals.css`](../app/globals.css).

Todo lo demás se **deriva** con `color-mix()`:

```css
/* Superficies: tinta con un toque de morado. No son grises. */
--surface-1: color-mix(in oklab, var(--brand-ink) 93%, var(--brand-purple));
--surface-2: color-mix(in oklab, var(--brand-ink) 88%, var(--brand-purple));
--surface-3: color-mix(in oklab, var(--brand-ink) 82%, var(--brand-purple));

/* Texto secundario, bordes, etc. */
--muted-foreground: color-mix(in oklab, var(--brand-light) 64%, var(--brand-ink));
--border: color-mix(in oklab, var(--brand-light) 11%, transparent);
```

Consecuencia práctica: **cambiar el morado repinta media web sola** — botones, bordes,
halos, superficies, la aura de Bugle. Eso solo se mantiene si nadie escribe un color suelto
en un componente. Cero `#hex`, `rgb()` u `oklch()` fuera de ese bloque.

Única excepción, documentada como tal: `themeColor` en `lib/site-config.ts`, porque los
metadatos del navegador necesitan un literal y no pueden leer una variable CSS. Si cambias
`--brand-ink`, cambia también ese valor.

### Por qué las superficies llevan morado

Un dark mode con grises neutros se siente genérico. Mezclar un 7-18% de morado en el fondo
de tarjetas y superficies es lo que hace que el conjunto se lea *de esta marca* y no de
cualquier plantilla. Es sutil a propósito: si se nota el morado, es demasiado.

### Contraste

`--muted-foreground` está calibrado en ~6.5:1 sobre el fondo — cumple WCAG AA con margen.
Si bajas ese 64% deja de cumplir. El texto secundario es para leerse, no para decorar.

---

## 2. Tipografía

La identidad define tres tipografías. Dos son comerciales y **no están en el repo**, así
que se usan sustitutos libres del mismo género:

| Rol        | De marca         | En uso hoy        | Variable CSS        |
| ---------- | ---------------- | ----------------- | ------------------- |
| Títulos    | Agrandir Grand   | **Outfit**        | `--font-display`    |
| Subtítulos | CY Grotesk STD   | **Space Grotesk** | `--font-subtitle`   |
| Contenido  | Poppins          | **Poppins**       | `--font-sans`       |

Poppins coincide exacto: es la de marca y está en Google Fonts.

Y una cuarta que **no sustituye a ninguna**:

| Rol    | En uso         | Variable CSS    | Utilidad      |
| ------ | -------------- | --------------- | ------------- |
| Póster | **Unbounded**  | `--font-poster` | `font-poster` |

Es ancha y pesada, como Agrandir Grand en las piezas publicadas, y es la voz de póster de
la web. Dos reglas, y las dos importan:

- **Solo en MAYÚSCULAS** (`uppercase`). En minúsculas pierde todo el carácter.
- **Solo en momentos clave**: el titular de cada página (`/agenda`, `/sponsors`), las
  frases grandes de la portada («Menos diapositivas…», el lema entre chevrons, el cierre
  del bloque morado), los nombres de los formatos, el día de cada evento en la agenda, el
  «404» y el mural del pie. El resto de títulos siguen en `font-display`. Ponerla en todos
  los encabezados convertiría la página en un grito continuo: su fuerza depende de que
  aparezca poco.

**Outfit** para títulos: geométrica, altura de x parecida, pesos de 100 a 900. Es el
sustituto libre más cercano a Agrandir en proporciones y en carácter.

**Space Grotesk** para subtítulos: grotesca de corte técnico, se comporta bien en
versalitas con mucho espaciado de letras, que es justo el uso que tiene acá (los "eyebrow",
las etiquetas, la cinta que se desplaza).

### Uso

```tsx
<h2 className="font-display font-extrabold tracking-tight">…</h2>   {/* títulos */}
<h2 className="font-poster font-extrabold uppercase">…</h2>         {/* momento clave */}
<p className="font-subtitle uppercase tracking-[0.2em]">…</p>       {/* etiquetas */}
<p>…</p>                                                            {/* contenido: por defecto */}
```

### Cuando se compren las licencias

El cambio es de **dos archivos** y no toca ningún componente:

1. Poner los `.woff2` en `public/fonts/`.
2. En `app/globals.css`, declarar las familias y apuntar las variables a ellas:

```css
@font-face {
  font-family: 'Agrandir Grand';
  src: url('/fonts/agrandir-grand.woff2') format('woff2');
  font-weight: 400 900;
  font-display: swap;
}

@theme inline {
  --font-display: 'Agrandir Grand', ui-sans-serif, system-ui, sans-serif;
}
```

3. Quitar el import de `Outfit` en `app/layout.tsx`.

Como todos los componentes usan `font-display` / `font-subtitle` y nunca el nombre de la
familia, no hay nada más que tocar.

---

## 3. El chevron

`❰ ❱` es el elemento gráfico más reconocible de la marca: los dos corchetes angulares que
abrazan el wordmark. **Rojo el que abre, morado el que cierra.** Siempre en ese orden.

Está dibujado en SVG en [`components/brand/icons.tsx`](../components/brand/icons.tsx)
(componente `Chevron`). Es uno de los tres recursos firma (§5) y trabaja a dos escalas:

**Protagonista, a color pleno.** Gigante y recortado por el borde de la pantalla, como un
marco:

- el lema de la portada, «Del apunte al deploy», entre dos chevrons de pantalla entera;
- el mural `❰ HACK WITH DSC ❱` que remata el pie de **todas** las páginas, recortado por el
  borde inferior como un letrero que sigue más allá de la pantalla.

**Textura o puntuación, en pequeño:**

- flanqueando el nombre en la barra superior;
- como viñeta de los enlaces del pie y como separador en la cinta que se desplaza;
- enmarcando el rótulo de cada mes en la agenda;
- como comilla de apertura de los testimonios de `/sponsors`;
- en tamaño mural pero casi invisible (3-16% de opacidad) en el fondo de las cabeceras.

Lo que ya **no** hace: ser la viñeta de un rótulo encima de cada título de sección. Ese
molde (rótulo con chevron → título → párrafo gris) se repetía en todas las secciones y
era la mitad de lo que hacía que la web pareciera una plantilla.

---

## 4. Bugle

La mascota: un ave cyberpunk con capucha, guantes y botas con luces. Es el protagonista de
la portada y aparece en cada página, siempre con un gesto que lleva la vista a algo.

| Archivo (`public/brand/`) | Pose                                                 | Dónde                                    |
| ------------------------- | ---------------------------------------------------- | ---------------------------------------- |
| `bugle-cyberpunk.webp`    | corriendo hacia adelante                             | hero de la portada; cruza la pantalla con el código Konami |
| `bugle-hacker.webp`       | de espaldas, con pantalla holográfica                | cabecera de `/agenda` (espejado, para que mire hacia dentro) |
| `bugle-asomado.webp`      | asomándose desde el borde DERECHO, cortado en recto  | junto a los formatos de la portada       |
| `bugle-senalando.webp`    | de pie, señalando hacia la IZQUIERDA del cuadro      | bloque morado de la portada y de `/sponsors`, señalando el botón |
| `bugle-perdido.webp`      | rascándose la cabeza junto a una pantalla roja vacía | la 404 (el «404» va encima, como texto)   |

En `/sponsors` aparece una sola vez, en el cierre: más le restaría seriedad a una página que
lee marketing.

En el hero de la portada lleva tres cosas encima, y las tres importan:

- **`bugle-shadow`** — una sombra de color debajo, para que no parezca un sticker pegado
  sobre el fondo.
- **`animate-float`** — una flotación lenta de 7 s.
- **`parallax-front`** — se mueve con el cursor, en la capa más cercana.

El parallax y la flotación van en elementos **anidados**, no en el mismo: los dos usan la
propiedad `translate` y se pisarían.

### Reglas de uso

- **Recortarlo sí, pero contra un borde**, nunca en el aire. `bugle-asomado` está cortado en
  recto para pegarse al canto de la pantalla; `bugle-hacker` se corta por el borde inferior
  de la cabecera de la agenda, como si estuviera parado detrás. Un Bugle cortado flotando
  en medio de la página se ve como un error.
- **Mira o señala hacia dentro**, hacia el texto o el botón, nunca fuera del cuadro. Si el
  arte mira al lado equivocado, se espeja (`-scale-x-100`).
- No le cambies el color ni lo pongas sobre un fondo claro: está iluminado para oscuro. El
  bloque morado le sirve, porque es su color.
- Sobre tinta, con `bugle-shadow` o un halo detrás; sin eso flota sin peso. Sobre el bloque
  morado no le hace falta.
- Es un personaje, no un icono: no lo uses en tamaño pequeño ni como viñeta.
- Siempre con `next/image` y la ruta pasada por `assetPublico()` (`lib/site-url.ts`).

---

## 5. Recursos firma

Lo que hace que la web se lea como Hack with DSC y no como una plantilla oscura más. Salen
de las piezas publicadas (`referencias/public_1/`) y son **tres**, a propósito: un cuarto
diluiría a los otros. Todos son utilidades de `app/globals.css` (sección «Recursos firma»).

La dirección es **póster de evento / streetwear, intensidad 3 de 5**: titulares cortos con
punto, un detalle humano por sección y contención en el resto.

### 5.1 La barra de póster — `barra-poster`

La de la pieza 2 (Talleres / Ponencias / Hackathones): degradado azul → morado → magenta y
una **sombra maciza desplazada hacia abajo, sin difuminar**. Esa sombra dura es lo que la
separa de una tarjeta de SaaS: se ve impresa, no flotando.

Sangra hasta un borde de la pantalla, y el componente decide cuál (`rounded-l-none!` o
`rounded-r-none!`). Del otro lado arranca en la misma vertical que el contenido, con la
variable `--borde` (ver `components/portada/formatos.tsx`). Se usa en los formatos de la
portada (alternando de lado, como en la pieza), en el aviso del grupo de `/agenda`, en el
nivel destacado de `/sponsors` y, en fino, como filete sobre cada beneficio de esa página.

### 5.2 Stickers — `sticker`, `sticker-<color>`, `etiqueta-sticker`

Como los de una laptop: fondo de color, borde claro de troquel, sombra dura y un giro leve
(`--sticker-giro`, que el componente alterna para que no queden todos torcidos igual). Al
pasar el cursor se enderezan y suben.

- Variantes: `sticker-claro`, `-verde`, `-morado`, `-rojo`, `-azul`. Las cinco pasan AA.
- `etiqueta-sticker` es la versión chica, en línea, con las mismas variantes: el tipo de
  evento en la agenda, el sello «Ya fue», «Muchos eventos» en el bloque morado, el
  distintivo «Destacado».
- En la agenda el color dice el tipo: taller azul, ponencia morado, hackathon rojo,
  networking verde.
- Los pilares de la portada son stickers grandes, pegados «con desorden a propósito».

### 5.3 Chevrons gigantes

Ver §3.

### Lo que acompaña a los tres

| Utilidad        | Qué es                                                                  |
| --------------- | ----------------------------------------------------------------------- |
| `bloque-morado` | Una sección entera en morado plano. **Máximo una por página**, o deja de romper. Hoy: el cierre de la portada y el de `/sponsors` |
| `btn-tinta`     | Botón tinta con sombra dura, para usar ENCIMA de un bloque o una barra de color, donde `btn-brand` se perdería |
| `btn-sombra`    | Botón claro con sombra dura morada, para acciones repetidas sobre tinta («Inscribirme» en cada evento). `btn-brand` es EL botón de la página: repetido en cada fila, la lista se volvía una fila de neones |
| `marcador`      | Rotulador detrás de una palabra (color con `--marcador`). Sobre morado no: se ensucia; ahí va un sticker |

### Menos niebla

Halos, rejilla y grano van **solo en las cabeceras** (los heroes de cada página y la 404).
El resto de la página es fondo tinta limpio, y el color fuerte llega con bloques sólidos,
barras y stickers. Con halos en todas las secciones la página entera se volvía una niebla
uniforme.

---

## 6. Los assets se generan, no se editan

Los originales viven en `identidad-visual/` (PNG con transparencia; las poses de Bugle, en
`identidad-visual/bugle/`). Lo que
sirve la web está en `public/brand/` y lo produce
[`scripts/prepare-assets.mjs`](../scripts/prepare-assets.mjs):

```bash
pnpm assets
```

Recorta el área transparente, redimensiona, convierte a WebP y compone la imagen de Open
Graph. Resultados:

| Archivo                        | Peso   |
| ------------------------------ | ------ |
| `bugle-cyberpunk.webp`         | 62 KB  |
| `bugle-hacker.webp`            | 68 KB  |
| `bugle-asomado.webp`           | 45 KB  |
| `bugle-senalando.webp`         | 157 KB |
| `bugle-perdido.webp`           | 206 KB |
| `logo-hack-with-dsc.webp`      | 28 KB  |
| `logo-hack-with-dsc-light.webp`| 34 KB  |
| `noise.png`                    | 22 KB  |
| `og.jpg`                       | 139 KB |
| `og-sponsors.jpg`              | 131 KB |

El original de Bugle pesa 660 KB; el WebP recortado, 62 KB. La portada entera carga menos
que una sola de las imágenes originales.

**No edites `public/brand/` a mano.** Si cambia un original, corre `pnpm assets` y comitea
el resultado.

### Las imágenes de Open Graph

Es lo que se ve cuando alguien comparte un link por WhatsApp. Hay **una por página**:

| Archivo | Ruta | Cómo se distingue |
| --- | --- | --- |
| `public/og.jpg` | `/` | halos azul + rojo + morado |
| `public/og-sponsors.jpg` | `/sponsors` | halos morado + verde, y el rótulo «PATROCINIO» |

Las dos se componen con el logotipo y con Bugle sobre el degradado de marca. El wordmark
va **como imagen**, no como texto, así que no dependen de las tipografías comerciales.

La única excepción es el rótulo «PATROCINIO» de la segunda, que sí es texto renderizado
con una pila de fuentes genéricas: es una palabra en versalitas, hace falta para que las
dos previsualizaciones no se confundan en el mismo chat, y como el JPEG se comitea, el
resultado no depende de qué fuentes tenga la máquina que corra `pnpm assets`.

### El grano

`noise.png` es una textura de 128×128 con semilla fija (para que el archivo sea idéntico en
cada corrida) que se repite por toda la página al 3,5% de opacidad, en modo `overlay`.
Rompe la planitud de los degradados grandes y disimula las bandas que deja la compresión.
Es de esas cosas que no se ven pero que se notan si las quitas.

---

## 7. Movimiento

Todo el movimiento vive en `globals.css` y se apaga entero con `prefers-reduced-motion`.

| Animación         | Dónde                        | Duración |
| ----------------- | ---------------------------- | -------- |
| `animate-float`   | Bugle                        | 7 s      |
| `animate-breathe` | los halos de neón            | 9 s      |
| `animate-marquee` | la cinta de palabras         | 42 s     |
| `animate-cue`     | la flecha "conoce el programa" | 2,2 s  |
| `animate-flicker` | el punto verde del eyebrow   | 3,2 s    |
| aparición al scroll | cualquier `[data-reveal]`  | 0,75 s   |
| hover de stickers | `sticker` (se endereza y sube) | 0,35 s |
| código Konami     | Bugle cruza la pantalla + mensaje | 5,2 s |

El código Konami (↑↑↓↓←→←→BA) es un huevo de pascua: `components/konami.tsx` pone
`data-konami` en `<html>` y la escena (`components/konami-escena.tsx`) la anima el CSS. Con
menos movimiento, Bugle no cruza y el mensaje aparece quieto.

Duraciones largas y desfasadas entre sí a propósito: varias animaciones lentas y fuera de
fase se leen como una escena viva; varias rápidas y sincronizadas se leen como una página
que no se está quieta.

Los halos son **degradados radiales**, no `filter: blur()` sobre divs de color. Se ven igual
y cuestan mucho menos GPU — que es lo que importa en la laptop de un estudiante y en un
celular de gama media.

---

## 8. La voz de los textos

Todos los textos están en [`lib/site-config.ts`](../lib/site-config.ts), en `copy`.

- **Habla «nosotros», el equipo.** Cercana, tratando de tú, en español de Perú, con jerga
  peruana suave («chamba», «de una», «chismear») cuando sale natural.
- **Humor de programador en dosis de guiño**: uno por sección, no un chiste por frase.
  «Si solo corre en tu máquina, no cuenta.», «Ni `git log` la encuentra.»
- **Los títulos son frases cortas con punto, no rótulos.** «Las reglas de la casa.», no
  «Nuestros pilares». Es la diferencia entre una página que habla y una que enumera.
- **Directo y técnico.** «Del localhost al link», no «sinergias disruptivas».
- **Los hechos no se inventan.** Todo lo que se afirma sale de `docs/esencia.md` o de las
  piezas publicadas. La voz cambia cómo se dice, no qué se promete: nada de números
  inventados ni de promesas que el programa no hace.

Las frases de las piezas se pueden **reescribir** para la web, siempre que conserven su
sentido. El cierre de la portada es el ejemplo: la pieza 2 dice *«Un programa. Muchos
eventos. Una comunidad que crece contigo.»* y la web dice *«Un programa. **Muchos
eventos.** Un solo grupo.»*, porque ahí el botón lleva al grupo de WhatsApp. «Muchos
eventos» sigue en verde, igual que en la pieza.

`/sponsors` es la excepción de tono: la lee una empresa, así que su contenido (que sale de
la hoja) es sobrio, y de la voz nueva solo lleva la micro-copia y una dosis baja de los
recursos firma.
