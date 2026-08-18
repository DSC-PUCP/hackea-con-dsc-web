# AGENTS.md — Hack with DSC (web)

Contexto operativo para agentes de IA que trabajen en este repo. Léelo completo antes
de tocar código: hay decisiones de producto aquí que **no** se deducen leyendo los
archivos, y varias de ellas se han tomado a propósito.

---

## 1. Qué es esto

Web pública de **Hack with DSC**, el programa de eventos del *Developer Student Club
PUCP*: talleres, ponencias y hackathons para estudiantes de tecnología. La web es la
cara pública del programa; su trabajo es que alguien entienda de qué va en 15 segundos
y termine en el grupo de WhatsApp de la comunidad.

El "por qué" del programa está en [`docs/esencia.md`](docs/esencia.md). Es la fuente
para cualquier texto sobre propósito, pilares o tono. **No inventes claims** sobre el
programa: si no está en `esencia.md` o en las piezas de `referencias/`, no va.

Stack: **Next.js 16** (App Router) · **React 19** · **Tailwind CSS v4** ·
**TypeScript** · **pnpm** · **Docker** sobre una MV Ubuntu Server con nginx.

**Dos destinos de despliegue**: `main` → Vercel (activo hoy), y una futura rama `prod` →
MV Ubuntu con Docker. Por eso `output: 'standalone'` **no** está activo por defecto: lo
pide solo el Dockerfile vía `NEXT_OUTPUT=standalone`. No lo pongas fijo en
`next.config.mjs`. Ver `docs/arquitectura.md` §1.1.

---

## 2. Reglas que no se rompen

Estas son las que más fácil se violan por accidente. Si una tarea parece pedirte
romper alguna, para y pregunta.

### 2.1 Una sola fuente de verdad, siempre

Este es **el** principio del repo, pedido explícitamente por el dueño del proyecto.

| Qué                       | Dónde se define                      | Regla                                                     |
| ------------------------- | ------------------------------------ | --------------------------------------------------------- |
| Colores                   | `app/globals.css` → bloque `:root`   | 6 tokens de marca. **Cero** `#hex`/`rgb()`/`oklch()` fuera |
| Efectos visuales          | `app/globals.css` → `@utility`       | glows, parallax, sombras, cinta: utilidades con nombre     |
| Textos                    | `lib/site-config.ts` → `copy`        | ningún texto visible escrito dentro de un componente       |
| Enlaces                   | `lib/site-config.ts` → `links`       | los `null` se ocultan solos en la interfaz                 |
| Navegación                | `lib/site-config.ts` → `navegacion`  | —                                                          |
| Datos de secciones        | `lib/site-config.ts`                 | `formatos`, `pilares`, `cintaPalabras`                     |
| Tipografías               | `app/layout.tsx` + `globals.css`     | 3 variables CSS: `--font-display/-subtitle/-sans`          |

Corolarios prácticos:

- Necesitas un color nuevo → **no** lo escribes en el componente. Lo derivas de los 6
  tokens con `color-mix()` en `globals.css`, o usas una clase Tailwind existente
  (`text-brand-purple`, `bg-brand-green/10`).
- Necesitas un efecto nuevo → `@utility` en `globals.css`, con comentario de por qué.
- Necesitas cambiar una frase → `lib/site-config.ts`, nunca el `.tsx`.
- Única excepción documentada: `themeColor` en `lib/site-config.ts`, porque los
  metadatos de Next no pueden leer una variable CSS. Está comentada como tal.

### 2.2 No se muestra NADA de eventos todavía

El sitio tiene **tres páginas**: la portada (`Hero` + **"Qué es Hack with DSC"**, y nada
más), `/agenda` y `/sponsors`.

La agenda estuvo un tiempo en la portada y se movió a su propia ruta: es contenido que
crece y que se comparte por su cuenta, y al final de la portada obligaba a recorrer el
hero entero para ver una fecha.

**Ninguna fecha, ponente ni enlace de inscripción se escribe en el repo.** Todo eso sale
de Google Sheets (`lib/eventos/`). Ojo con la diferencia entre sección y página: una
sección puede devolver `null` y desaparecer, **una ruta no**. `/agenda` sigue existiendo
aunque la hoja esté caída, así que tiene estado vacío propio con salida al WhatsApp.

Motivo: publicar fechas que después cambian quema credibilidad, y el programa se
planifica en una hoja de cálculo que se mueve todas las semanas. Por eso tampoco hay
contenido de reserva para eventos, al contrario que en `/sponsors` — una fecha vieja es
peor que ninguna fecha.

`internals/` contiene la hoja de planificación real. **Es material interno**: sirve
para entender la forma de los datos, no para copiar contenido a la web. Está en
`.gitignore` y en `.dockerignore`.

Si te piden "añade un evento", la respuesta correcta es que se añade **en la hoja**, no en
el repo. Si te piden cambiar cómo se ve la agenda, eso sí es código: `components/eventos/`.

### 2.3 Dark-only

No hay tema claro ni interruptor. La identidad visual (neones, el arte de Bugle) vive
sobre el fondo tinta y se lava en claro. `globals.css` tiene un solo set de tokens, sin
bloque `prefers-color-scheme`. No añadas uno.

### 2.4 Accesibilidad y movimiento

Todo el movimiento se apaga con `prefers-reduced-motion`; ya está resuelto en
`globals.css` y en los dos componentes de cliente. Si añades una animación, comprueba
que caiga bajo esa regla.

Sin JavaScript la página se ve **completa**: las animaciones de aparición solo esconden
contenido si existe la clase `js` en `<html>` (la pone un script en línea en el
`layout`). No hagas que el contenido dependa de JS.

---

## 3. Mapa del repo

```
app/
  layout.tsx            tipografías, metadatos, clase `js`, y el ARMAZÓN COMÚN:
                        header, pie, PointerParallax y ScrollReveal
  page.tsx              la portada `/`: solo su <main> con Hero + QueEs
  agenda/page.tsx       la agenda `/agenda`: lee la hoja UNA vez y reparte entre las
                        dos secciones. Tiene estado vacío porque una ruta no se esconde
  sponsors/page.tsx     la página de patrocinio `/sponsors`: solo su <main>
  globals.css           SISTEMA DE DISEÑO (colores, utilidades, animaciones)
  sitemap.ts robots.ts  qué indexan los buscadores
  api/health/route.ts   GET /api/health, lo usa el healthcheck de Docker
  api/revalidate/route  fuerza el refresco de la caché. Secreto + lista blanca

components/
  hero.tsx              portada (servidor)
  que-es.tsx            "Qué es Hack with DSC" (servidor)
  sponsors/             las secciones de /sponsors (todas de servidor)
                        piezas.tsx = Seccion, EncabezadoSeccion, Parrafos, HaloDeFondo
  eventos/              la agenda (servidor). agenda.tsx = lista agrupada por mes; un
                        evento SE DESPLIEGA EN MÓVIL (`<details>` nativo, cero JS) y NO
                        se despliega en escritorio, con las mismas piezas de contenido
                        definidas una sola vez. personas.tsx = ponentes/mentores/jurados;
                        la forma se decide POR ROL, no por el total, y todos conservan su
                        enlace a LinkedIn
  site-header.tsx       barra superior (cliente: cambia al hacer scroll)
  site-footer.tsx       pie
  pointer-parallax.tsx  cliente: publica la posición del cursor en variables CSS
  scroll-reveal.tsx     cliente: pone data-visible al entrar en pantalla
  brand/icons.tsx       chevron del logo + iconos macizos de los 3 formatos
  brand/redes.tsx       logotipos de las redes de DSC PUCP, en SVG. Están dibujados a
                        mano porque lucide-react YA NO trae iconos de marca: importar
                        `Instagram` de lucide no falla al compilar, da `undefined`
  ui/button.tsx         shadcn. Casi no se usa: los CTA usan la utilidad `btn-brand`

lib/
  site-config.ts        TODO el contenido, enlaces y metadatos del repo
  site-url.ts           urlDelSitio + assetPublico(). Único sitio que sabe el dominio
  sheets/               cliente de Google Sheets, helpers de filas y traducción de
                        enlaces de Drive a imágenes servibles. COMPARTIDO
  sponsors/             tipos, esquemas Zod, lector, caché y contenido de reserva
  eventos/              lo mismo para la agenda, MENOS contenido de reserva (a propósito).
                        fechas.ts es el parseo de las celdas de fecha: léelo antes de
                        tocarlo, tiene más trampas de las que parece
  iniciales.ts          iniciales de un nombre, para los avatares sin foto
  utils.ts              cn()

scripts/
  prepare-assets.mjs    `pnpm assets`: genera public/brand/, og.jpg y og-sponsors.jpg
  probar-sponsors.mjs   `pnpm probar:sponsors`: prueba el lector sin tocar la interfaz
  probar-eventos.mjs    `pnpm probar:eventos`: comprueba el parseo de fechas y dice qué
                        eventos se publicarían hoy y cuáles se descartaron y por qué

deploy/
  nginx/                configuración del proxy inverso
  actualizar.sh         script de despliegue en la MV

docs/                   ver §6
identidad-visual/       originales de diseño (PNG grandes). No se sirven
referencias/            piezas gráficas publicadas: la referencia de estilo
internals/              hoja de planificación. INTERNO, fuera de git
```

### Componentes de servidor vs. de cliente

Solo hay **tres** componentes de cliente: `site-header`, `pointer-parallax` y
`scroll-reveal`. Todo el resto es de servidor.

El patrón que lo permite: los dos últimos no renderizan nada. Publican estado
(posición del cursor en variables CSS; atributo `data-visible`) y el CSS decide qué se
mueve. Así una sección de servidor consigue animación con solo poner `data-reveal`.

**Mantén ese patrón.** Antes de añadir `'use client'` a una sección, pregúntate si el
efecto se puede lograr con una variable CSS o un atributo puesto desde fuera.

### Añadir una página nueva

Los tres van montados en `app/layout.tsx`, junto con el header y el pie. Así que **una
página nueva es solo su `<main>`** — hereda armazón y movimiento sin hacer nada:

```tsx
// app/lo-que-sea/page.tsx
export default function Page() {
  return <main>{/* secciones */}</main>
}
```

Dos cosas que sí tienes que atender:

- **Lo que se ve al abrir la página usa la utilidad `enter`, no `data-reveal`.**
  `data-reveal` espera un `IntersectionObserver`; lo de arriba del pliegue no puede
  depender de eso. Está explicado en `globals.css`.
- **Si va en el menú**, agrégala a `navegacion` en `lib/site-config.ts`. Las anclas se
  escriben sin barra (`'#que-es'`) y las rutas con barra (`'/sponsors'`): el header
  resuelve la diferencia solo.

---

## 4. Comandos

```bash
pnpm install        # instalar dependencias
pnpm dev            # desarrollo en http://localhost:3000
pnpm build          # build de producción (falla si hay errores de tipos: es a propósito)
pnpm typecheck      # solo tipos, más rápido que el build
pnpm assets         # regenerar public/brand/ y las dos imágenes de Open Graph
pnpm probar:sponsors             # lee la hoja de patrocinio e imprime qué entró y qué no
pnpm probar:sponsors volcado.json  # lo mismo, contra un volcado, sin credenciales
```

No hay ESLint configurado ni suite de tests. El control de calidad hoy es
`pnpm typecheck` + `pnpm build` + revisar en el navegador. No añadas herramientas de
tooling sin que te lo pidan.

**Antes de decir que terminaste**: `pnpm build` tiene que pasar.

---

## 5. Identidad visual, en corto

Detalle completo en [`docs/identidad-visual.md`](docs/identidad-visual.md).

- **Colores**: tinta `#0F0D1C` · claro `#F1F1F4` · morado `#813DF5` · azul `#3D90F5` ·
  rojo `#F53D5C` · verde `#64DA2C`. Muestreados de la lámina oficial.
- **Chevrons** `❰ ❱`: el elemento gráfico más reconocible. Rojo el que abre, morado el
  que cierra. Úsalos.
- **Bugle**: la mascota, un ave cyberpunk con capucha. Es el protagonista de la
  portada. Hay una segunda pose sin usar (`bugle-hacker.webp`) reservada para la futura
  sección de eventos.
- **El logotipo se sirve como imagen**, no como texto, porque las tipografías de marca
  (Agrandir Grand, CY Grotesk STD) son comerciales y no están en el repo. Sustitutos
  libres en uso: Outfit (títulos), Space Grotesk (subtítulos), Poppins (contenido, es
  la de marca).
- **Tono de los textos**: directo, técnico, sin corporativismo y sin exagerar. "Del
  localhost al link", no "sinergias disruptivas". Español de Perú.

---

## 6. Documentación

| Archivo                     | Para quién                                                  |
| --------------------------- | ----------------------------------------------------------- |
| `docs/esencia.md`           | el propósito del programa. Fuente de verdad de los textos    |
| `docs/desarrollo.md`        | el equipo dev (principiantes en web/Next.js)                 |
| `docs/despliegue.md`        | quien administra la MV Ubuntu                                |
| `docs/arquitectura.md`      | decisiones técnicas + cómo se leen las dos hojas de Sheets   |
| `docs/identidad-visual.md`  | colores, tipografías, uso de la marca                        |

Si cambias algo que una de estas describe, actualízala en el mismo cambio.

---

## 7. Estado y siguiente paso

**Hecho**: portada, sección "Qué es", identidad visual aplicada, Docker, nginx, docs, la
página `/sponsors` con su lectura desde Google Sheets, y la **agenda de eventos** leída de
su propia hoja.

Las dos lecturas comparten la **capa de Sheets** (`lib/sheets/`, validación con Zod, caché
con `unstable_cache` y `/api/revalidate` con lista blanca de etiquetas), descrita en
`docs/arquitectura.md` §3.0. **Hay que reusarla, no duplicarla.**

Dos diferencias deliberadas entre ambas, y las dos están razonadas en el código:

- eventos **no tiene contenido de reserva** (`lib/eventos/contenido.ts`);
- eventos lee un rango **ancho** (`A1:Z200`) y elige columnas por nombre, mientras que
  sponsors pide columnas exactas (`lib/eventos/sheets.ts`). El equipo tiene que poder
  reordenar columnas sin romper la web. La condición para que eso sea seguro es que
  `lib/eventos/esquemas.ts` siga construyendo los objetos campo por campo: **nunca metas
  un `...fila` ahí**, o las columnas internas de la hoja acabarían en el navegador.

**Pendiente**: llenar la pestaña `Info Personas (Web)` (hoy está vacía, así que las
tarjetas salen sin ponentes), la hoja de estilos `@media print` de `/sponsors` (§3.0.2 de
`docs/arquitectura.md`) y las fotos de la galería.

---

## 8. Convenciones de código

- **Comentarios en español**, y explican *por qué*, no *qué*. Si un comentario repite
  lo que el código ya dice, sobra.
- **Nombres de dominio en español** (`formatos`, `pilares`, `cintaPalabras`,
  `mostrableEnWeb`), porque el equipo y la hoja de cálculo están en español. Las API de
  React/Next se quedan en inglés, obviamente.
- Comillas simples, sin punto y coma. Es el estilo del archivo que ya estés editando:
  respétalo.
- Escribe código que se parezca al de al lado. Este repo lo van a leer estudiantes que
  están aprendiendo Next.js: prioriza lo legible sobre lo ingenioso.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
