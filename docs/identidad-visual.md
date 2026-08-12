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

**Outfit** para títulos: geométrica, altura de x parecida, pesos de 100 a 900. Es el
sustituto libre más cercano a Agrandir en proporciones y en carácter.

**Space Grotesk** para subtítulos: grotesca de corte técnico, se comporta bien en
versalitas con mucho espaciado de letras, que es justo el uso que tiene acá (los "eyebrow",
las etiquetas, la cinta que se desplaza).

### Uso

```tsx
<h2 className="font-display font-extrabold tracking-tight">…</h2>   {/* títulos */}
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

Está dibujado en SVG en [`components/brand/icons.tsx`](../components/brand/icons.tsx) y se
usa en cuatro sitios:

- flanqueando el nombre en la barra superior y en el pie;
- como viñeta de los "eyebrow" de sección;
- como separador en la cinta que se desplaza;
- en tamaño mural, al 7% de opacidad, en el fondo de la portada.

Ese último uso es el que hace que la portada se sienta de la marca aunque el logotipo sea
pequeño.

---

## 4. Bugle

La mascota: un ave cyberpunk con capucha, guantes y botas con luces. Es el protagonista de
la portada.

| Archivo                          | Pose                                   | Uso                          |
| -------------------------------- | -------------------------------------- | ---------------------------- |
| `public/brand/bugle-cyberpunk.webp` | corriendo hacia adelante            | portada                      |
| `public/brand/bugle-hacker.webp`    | de espaldas, con pantalla holográfica | **sin usar**, reservado para la futura sección de eventos |

En la portada lleva tres cosas encima, y las tres importan:

- **`bugle-shadow`** — una sombra de color debajo, para que no parezca un sticker pegado
  sobre el fondo.
- **`animate-float`** — una flotación lenta de 7 s.
- **`parallax-front`** — se mueve con el cursor, en la capa más cercana.

El parallax y la flotación van en elementos **anidados**, no en el mismo: los dos usan la
propiedad `translate` y se pisarían.

### Reglas de uso

- Nunca lo recortes, ni le cambies el color, ni lo pongas sobre un fondo claro (está
  iluminado para oscuro).
- Siempre con una aura (`glow-purple`) detrás. Sin ella flota sin peso.
- Es un personaje, no un icono: no lo uses en tamaño pequeño ni como viñeta.

---

## 5. Los assets se generan, no se editan

Los originales viven en `identidad-visual/` (PNG de 1080×1350, con transparencia). Lo que
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

## 6. Movimiento

Todo el movimiento vive en `globals.css` y se apaga entero con `prefers-reduced-motion`.

| Animación         | Dónde                        | Duración |
| ----------------- | ---------------------------- | -------- |
| `animate-float`   | Bugle                        | 7 s      |
| `animate-breathe` | los halos de neón            | 9 s      |
| `animate-marquee` | la cinta de palabras         | 42 s     |
| `animate-cue`     | la flecha "conoce el programa" | 2,2 s  |
| `animate-flicker` | el punto verde del eyebrow   | 3,2 s    |
| aparición al scroll | cualquier `[data-reveal]`  | 0,75 s   |

Duraciones largas y desfasadas entre sí a propósito: varias animaciones lentas y fuera de
fase se leen como una escena viva; varias rápidas y sincronizadas se leen como una página
que no se está quieta.

Los halos son **degradados radiales**, no `filter: blur()` sobre divs de color. Se ven igual
y cuestan mucho menos GPU — que es lo que importa en la laptop de un estudiante y en un
celular de gama media.

---

## 7. Tono de los textos

Todos los textos están en [`lib/site-config.ts`](../lib/site-config.ts), en `copy`.

- **Directo y técnico.** "Del localhost al link", no "sinergias disruptivas".
- **Sin exagerar.** Si no está en `docs/esencia.md` o en las piezas publicadas, no se
  afirma. Nada de números inventados ni de promesas que el programa no hace.
- **Español de Perú**, tratando de tú.
- **Concreto.** "Compite, construye y demuestra todo tu talento en equipo" dice algo;
  "potencia tu perfil profesional" no dice nada.

La frase que cierra la sección — *"Un programa. **Muchos eventos.** Una comunidad que crece
contigo."* — viene textual de la pieza oficial, con "Muchos eventos" en verde, igual que
ahí. Es el remate de la marca: no la reescribas.
