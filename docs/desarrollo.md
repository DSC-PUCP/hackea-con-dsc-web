# Guía de desarrollo

Para el equipo de Hack with DSC. Asume que **nunca has trabajado con Next.js** y que tu
experiencia con desarrollo web es poca. Va de lo básico a lo específico, y explica el
*por qué* de cada cosa, no solo los comandos.

Si algo no te cuadra, pregunta en el grupo antes de romper algo. Nadie nació sabiendo
esto.

---

## 1. Qué vas a instalar (una sola vez)

| Herramienta | Para qué                                         | Cómo comprobar          |
| ----------- | ------------------------------------------------ | ----------------------- |
| **Node.js 22** | El motor que ejecuta JavaScript fuera del navegador | `node -v` → `v22.x` |
| **pnpm**       | Instala las librerías del proyecto              | `pnpm -v` → `10.x`  |
| **Git**        | Guarda y comparte los cambios de código         | `git --version`     |
| **VS Code**    | El editor. No es obligatorio, pero es el que usamos | —               |

Node se descarga de [nodejs.org](https://nodejs.org) (versión LTS). pnpm viene incluido
con Node: se activa con

```bash
corepack enable
```

> **¿Por qué pnpm y no npm?** Hace lo mismo, pero más rápido y ocupando mucho menos
> disco. Lo importante: **usa siempre pnpm en este proyecto**. Mezclar `npm install` con
> `pnpm install` genera dos archivos de bloqueo distintos que se pelean, y termina en
> "en mi máquina funciona".

### Extensiones de VS Code recomendadas

- **Tailwind CSS IntelliSense** — autocompleta las clases. Casi obligatoria.
- **Prettier** — formatea el código solo al guardar.

---

## 2. Arrancar el proyecto

```bash
git clone <url-del-repo>
cd hackea-con-dsc-web

pnpm install          # instala todo lo que el proyecto necesita (tarda ~1 min)
pnpm dev              # arranca el servidor de desarrollo
```

Abre <http://localhost:3000>. Edita cualquier archivo, guarda, y el navegador se
actualiza solo. Eso se llama *hot reload* y es lo que hace que desarrollar sea rápido.

Para detenerlo: `Ctrl + C` en la terminal.

No hace falta crear un `.env` para desarrollar: todo tiene valores por defecto.

---

## 3. Los comandos que vas a usar

```bash
pnpm dev          # desarrollo, con recarga automática
pnpm build        # construye la versión de producción. FALLA si hay errores de tipos
pnpm typecheck    # revisa solo los tipos. Más rápido que build
pnpm start        # sirve la versión ya construida (necesita pnpm build antes)
pnpm assets       # regenera las imágenes de marca (ver §8)
```

**Antes de subir cualquier cambio, corre `pnpm build`.** Si falla en tu máquina, falla
en el servidor. Es la única regla no negociable de este repo.

---

## 4. Cómo está organizado

```
app/                 las páginas y el CSS global
components/          los pedazos visuales reutilizables
lib/                 datos y utilidades (sin nada visual)
public/              archivos que se sirven tal cual (imágenes, favicon)
docs/                esta documentación
scripts/             utilidades que se corren a mano
deploy/              configuración del servidor
```

### Las cuatro cosas que de verdad tienes que conocer

| Archivo                | Qué es                                                        |
| ---------------------- | ------------------------------------------------------------- |
| `app/page.tsx`         | La página. Dice qué secciones se muestran y en qué orden.      |
| `app/globals.css`      | **Todos** los colores y efectos visuales del sitio.            |
| `lib/site-config.ts`   | **Todos** los textos y enlaces.                                |
| `components/`          | Cómo se ve cada sección.                                       |

---

## 5. Conceptos de Next.js, lo mínimo indispensable

### App Router: las carpetas son las URL

En Next.js moderno la estructura de carpetas de `app/` **es** el mapa de rutas:

- `app/page.tsx` → `/` (la portada)
- `app/api/health/route.ts` → `/api/health`
- si creáramos `app/eventos/page.tsx` → `/eventos`

No hay que configurar rutas en ningún lado. Se crea la carpeta y ya existe la URL.

### Componentes: funciones que devuelven pantalla

Un componente es una función de JavaScript que devuelve algo parecido a HTML (se llama
JSX). Eso es todo:

```tsx
function Saludo() {
  return <p>Hola</p>
}
```

Se usa como si fuera una etiqueta HTML: `<Saludo />`. Un componente puede contener
otros, y así se arma la página entera. Mira `app/page.tsx`: es solo una lista de
componentes.

### Servidor vs. cliente: la distinción que más confunde

Por defecto, en Next.js los componentes se ejecutan **en el servidor**. Se convierten a
HTML antes de llegar al navegador. Eso es bueno: la página carga rápido y Google la lee
sin problema.

Un componente solo necesita ejecutarse **en el navegador** si tiene que reaccionar a
algo que pasa ahí: un clic, la posición del cursor, el scroll. Esos llevan
`'use client'` en la primera línea.

En este proyecto solo hay **tres** componentes de cliente:

- `site-header.tsx` — cambia de aspecto al hacer scroll
- `pointer-parallax.tsx` — sigue el cursor
- `scroll-reveal.tsx` — detecta qué entró en pantalla

Todo lo demás es de servidor, incluida la portada completa con todas sus animaciones.

> **El truco que hace posible eso** (y que conviene entender, porque es lo más elegante
> del repo): `pointer-parallax` y `scroll-reveal` no dibujan nada. Solo *publican
> información* — la posición del cursor en variables CSS, y un atributo
> `data-visible="true"` en lo que ya se ve. El CSS es quien decide qué se mueve.
>
> Resultado: una sección de servidor consigue animarse con solo poner `data-reveal` en
> una etiqueta. Cero JavaScript propio.
>
> Si estás por escribir `'use client'` en una sección, párate a pensar si el efecto se
> puede lograr así. Casi siempre sí.

### Tailwind CSS: estilos como clases

En vez de escribir CSS aparte, se ponen clases en el HTML:

```tsx
<p className="mt-4 text-lg text-muted-foreground">Un texto</p>
```

`mt-4` = margen arriba, `text-lg` = texto grande, `text-muted-foreground` = el color de
texto secundario del proyecto. Se lee raro al principio y luego no quieres otra cosa.

Con la extensión de VS Code instalada, escribe `text-` y te sale la lista con los
colores del proyecto en un recuadrito.

---

## 6. La regla más importante del proyecto: una sola fuente de verdad

Cada cosa se define **en un solo lugar** y desde ahí se referencia. Es lo que hace que
este repo siga siendo mantenible cuando pasen por él cinco personas distintas.

### Cambiar un texto → `lib/site-config.ts`

Todos los textos visibles están ahí, dentro del objeto `copy`:

```ts
export const copy = {
  hero: {
    eyebrow: 'DSC PUCP presenta',
    titulo: { normal: 'Del código al', destacado: 'siguiente nivel' },
    // ...
  },
}
```

Cambias la frase, guardas, y se actualiza en la web. **No busques el texto dentro de los
componentes**: no está ahí, a propósito.

### Cambiar un enlace → `lib/site-config.ts`, objeto `links`

```ts
export const links = {
  whatsapp: 'https://chat.whatsapp.com/...',
  instagram: null,   // ← mientras esté en null, no aparece en la web
}
```

Cuando exista el Instagram, pones la URL y el enlace aparece solo en el pie. No hay que
tocar ningún componente.

### Cambiar un color → `app/globals.css`, bloque `:root`

Ahí arriba hay exactamente **seis** colores, los de la lámina oficial de identidad:

```css
--brand-ink: #0f0d1c;
--brand-light: #f1f1f4;
--brand-purple: #813df5;
--brand-blue: #3d90f5;
--brand-red: #f53d5c;
--brand-green: #64da2c;
```

Todo lo demás del sitio se **calcula** a partir de esos seis con `color-mix()`. Cambia
el morado y se repinta media web sola: botones, bordes, halos, superficies.

> ### ⛔ Nunca escribas un color suelto
>
> Ni en un componente ni en otra parte del CSS. Nada de `text-[#813DF5]`,
> `style={{ color: 'purple' }}` ni `background: #17142a`.
>
> **Por qué**: en el momento en que el morado aparece escrito en ocho archivos, cambiar
> la marca deja de ser una tarea de un minuto y pasa a ser una cacería en la que siempre
> queda uno suelto. Ya pasó en la versión anterior de esta web.
>
> **Qué hacer en su lugar**: usar las clases del proyecto (`text-brand-purple`,
> `bg-brand-green/10`, `border-brand-red/30`), o si de verdad falta un efecto nuevo,
> crear una utilidad en `globals.css` derivada de los seis tokens.

### Añadir un efecto visual → `@utility` en `globals.css`

Los efectos con nombre viven ahí abajo: `glow-purple`, `btn-brand`, `bugle-shadow`,
`parallax-front`, `mask-fade-x`... Cada uno lleva un comentario de por qué existe. Se
usan como cualquier clase de Tailwind:

```tsx
<div className="glow-purple animate-breathe absolute size-[40rem]" />
```

---

## 7. Tareas típicas, paso a paso

### Cambiar el título de la portada

`lib/site-config.ts` → `copy.hero.titulo`. La parte `destacado` es la que sale con el
degradado de colores.

### Añadir un cuarto formato (junto a Talleres/Ponencias/Hackathones)

1. `lib/site-config.ts` → añade una entrada al array `formatos`.
2. Si usas un `color` que no existía, añádelo al mapa `clasesPorColor` en
   `components/que-es.tsx`. Está comentado ahí por qué ese mapa es necesario (resumen:
   Tailwind necesita ver el nombre completo de la clase escrito en el código).
3. Si usas un `icon` nuevo, añádelo a `components/brand/icons.tsx`.

### Añadir una sección nueva

1. Crea `components/mi-seccion.tsx`. Copia la estructura de `que-es.tsx`: dale un `id`,
   pon los textos en `site-config.ts`, y usa `data-reveal` para que aparezca al hacer
   scroll.
2. Impórtala en `app/page.tsx` en el orden que corresponda.
3. Si va en el menú, añádela a `navegacion` en `site-config.ts`.

### Escalonar la aparición de varios elementos

Pon `data-reveal` en cada uno y dales retardos distintos:

```tsx
<div data-reveal style={{ '--reveal-delay': '120ms' } as React.CSSProperties} />
```

---

## 8. Imágenes

Las imágenes que sirve la web están en `public/brand/` y **están generadas**: no se
editan a mano. Los originales de diseño viven en `identidad-visual/`.

Si cambia un original:

```bash
pnpm assets
```

Eso corre `scripts/prepare-assets.mjs`, que recorta el área transparente, redimensiona,
convierte a WebP y compone la imagen de Open Graph (`public/og.jpg`, la que se ve cuando
alguien comparte el link por WhatsApp). El resultado **sí** se comitea.

> **Por qué así y no dejar que Next optimice las imágenes**: al pre-generarlas, el
> servidor no necesita la librería `sharp` en producción. Una pieza menos que instalar y
> que se pueda romper en la MV. El detalle está en `next.config.mjs`.

---

## 9. Git: el flujo que usamos

```bash
git checkout main
git pull                              # traer lo último

git checkout -b mi-cambio             # rama nueva para tu trabajo

# ... editas, guardas ...

pnpm build                            # ⚠️ TIENE que pasar antes de subir

git add .
git commit -m "Cambia el título de la portada"
git push -u origin mi-cambio
```

Luego abres un Pull Request en GitHub y alguien lo revisa antes de que entre a `main`.

**No se hace push directo a `main`.** Es lo que se despliega.

### Qué no se comitea nunca

- `.env` — puede tener secretos. Ya está en `.gitignore`.
- `node_modules/`, `.next/` — se generan.
- `internals/` — material interno del equipo.

---

## 10. Cuando algo se rompe

| Síntoma                                      | Qué hacer                                                              |
| -------------------------------------------- | ---------------------------------------------------------------------- |
| `pnpm dev` no arranca / errores raros de módulos | `rm -rf node_modules .next && pnpm install`                        |
| Cambié un color y no pasa nada                | ¿Lo cambiaste en el `:root` de `globals.css`? ¿Recargaste con Ctrl+F5? |
| Una clase de Tailwind no hace nada            | Suele ser una clase armada con plantilla (`` `text-${x}` ``). Tailwind no la ve: escríbela completa o usa un mapa como el de `que-es.tsx`. |
| `pnpm build` falla con errores de tipos       | Léelos: casi siempre es un nombre mal escrito. `pnpm typecheck` da lo mismo más rápido. |
| La animación de aparición no se dispara       | ¿El elemento tiene `data-reveal`? ¿`<ScrollReveal />` sigue en `page.tsx`? |
| El parallax no se mueve                       | Es normal en móvil y con "reducir movimiento" activado en el sistema: se apaga a propósito. |
| Cambié `NEXT_PUBLIC_SITE_URL` y no se aplica  | Esas variables se incrustan al compilar. Hay que reconstruir, no reiniciar. |

---

## 11. Antes de pedir revisión

- [ ] `pnpm build` pasa
- [ ] Se ve bien en móvil (F12 → icono de celular en el navegador)
- [ ] No metí ningún color suelto: cero `#hex` fuera de `globals.css`
- [ ] No metí ningún texto suelto: está en `lib/site-config.ts`
- [ ] No añadí nada de eventos (fechas, ponentes, agenda) — ver `AGENTS.md` §2.2
- [ ] Si toqué algo que la documentación describe, actualicé la documentación
