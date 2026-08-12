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

La portada tiene exactamente **dos secciones**: `Hero` y **"Qué es Hack with DSC"**
(`QueEs`). Eso es todo, por decisión de producto. (La otra página del sitio es
`/sponsors`, que va dirigida a empresas y no muestra agenda tampoco.)

Nada de agenda, fechas, ponentes, lugares, links de inscripción ni contadores hasta que
la lectura desde Google Sheets con caché esté implementada y probada
([`docs/arquitectura.md`](docs/arquitectura.md) → Fase 2).

Motivo: publicar fechas que después cambian quema credibilidad, y el programa se
planifica en una hoja de cálculo que se mueve todas las semanas.

`internals/` contiene la hoja de planificación real. **Es material interno**: sirve
para entender la forma de los datos, no para copiar contenido a la web. Está en
`.gitignore` y en `.dockerignore`.

Si te piden "añade la agenda", la respuesta correcta es implementar la Fase 2 completa,
no cablear datos a mano.

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
  site-header.tsx       barra superior (cliente: cambia al hacer scroll)
  site-footer.tsx       pie
  pointer-parallax.tsx  cliente: publica la posición del cursor en variables CSS
  scroll-reveal.tsx     cliente: pone data-visible al entrar en pantalla
  brand/icons.tsx       chevron del logo + iconos macizos de los 3 formatos
  ui/button.tsx         shadcn. Casi no se usa: los CTA usan la utilidad `btn-brand`

lib/
  site-config.ts        TODO el contenido, enlaces y metadatos del repo
  site-url.ts           urlDelSitio + assetPublico(). Único sitio que sabe el dominio
  sheets/               cliente de Google Sheets y helpers de filas. COMPARTIDO
  sponsors/             tipos, esquemas Zod, lector, caché y contenido de reserva
  eventos/types.ts      contrato de datos para la Fase 2. Todavía sin usar
  utils.ts              cn()

scripts/
  prepare-assets.mjs    `pnpm assets`: genera public/brand/, og.jpg y og-sponsors.jpg
  probar-sponsors.mjs   `pnpm probar:sponsors`: prueba el lector sin tocar la interfaz

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
| `docs/arquitectura.md`      | decisiones técnicas + plan de la Fase 2 (Google Sheets)      |
| `docs/identidad-visual.md`  | colores, tipografías, uso de la marca                        |

Si cambias algo que una de estas describe, actualízala en el mismo cambio.

---

## 7. Estado y siguiente paso

**Hecho**: portada, sección "Qué es", identidad visual aplicada, Docker, nginx, docs, y
la página `/sponsors` con su lectura desde Google Sheets.

Con `/sponsors` llegó la **capa compartida de Sheets** (`lib/sheets/`, validación con Zod,
caché con `unstable_cache` y `/api/revalidate` con lista blanca de etiquetas). Está
descrita en `docs/arquitectura.md` §3.0 y **hay que reusarla, no duplicarla**.

**Siguiente (Fase 2)**: leer los eventos desde Google Sheets con caché y recién entonces
mostrar la agenda. El contrato de datos está en `lib/eventos/types.ts`; lo que falta es
solo su capa propia (rangos, esquemas y envoltorio de caché). Ver `docs/arquitectura.md`
§3.5.

**Pendiente menor de `/sponsors`**: la hoja de estilos `@media print` (§3.0.1 de
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
