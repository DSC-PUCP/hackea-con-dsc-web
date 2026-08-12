<div align="center">

# ❰ Hack with DSC ❱

**Web pública del programa de eventos del Developer Student Club PUCP.**

Talleres, ponencias y hackathons para estudiantes que quieren dejar de acumular teoría
y empezar a construir software de verdad.

</div>

---

## Arrancar en 30 segundos

```bash
pnpm install
pnpm dev          # → http://localhost:3000
```

Node 22 y pnpm 10. Si no tienes pnpm: `corepack enable`.

**Nunca trabajado con Next.js?** Empieza por [`docs/desarrollo.md`](docs/desarrollo.md),
que está escrito exactamente para eso.

---

## Documentación

| Documento | Para quién / para qué |
| --- | --- |
| [`docs/desarrollo.md`](docs/desarrollo.md) | **Empieza aquí si vas a programar.** Guía desde cero, sin asumir experiencia en web. |
| [`docs/despliegue.md`](docs/despliegue.md) | Poner y mantener la web en la MV Ubuntu: Docker, nginx, HTTPS, resolución de problemas. |
| [`docs/identidad-visual.md`](docs/identidad-visual.md) | Colores, tipografías, Bugle, el chevron, tono de los textos. |
| [`docs/arquitectura.md`](docs/arquitectura.md) | Por qué está hecho así, y el plan de la Fase 2 (eventos desde Google Sheets). |
| [`docs/esencia.md`](docs/esencia.md) | El propósito del programa. Fuente de verdad de cualquier texto. |
| [`AGENTS.md`](AGENTS.md) | Contexto para agentes de IA que trabajen en el repo. |

---

## Comandos

```bash
pnpm dev          # desarrollo con recarga automática
pnpm build        # build de producción (falla si hay errores de tipos: es a propósito)
pnpm typecheck    # solo tipos, más rápido
pnpm start        # sirve el build ya hecho
pnpm assets       # regenera public/brand/ desde identidad-visual/
```

En el servidor:

```bash
docker compose up -d --build     # construir y levantar
./deploy/actualizar.sh           # actualizar a la última versión de main
```

---

## Las dos reglas del repo

**1. Una sola fuente de verdad.** Cada cosa se define en un solo lugar:

| Qué | Dónde |
| --- | --- |
| Colores y efectos | `app/globals.css` → bloque `:root` (6 tokens de marca) |
| Textos y enlaces | `lib/site-config.ts` |

Cero colores literales fuera de `globals.css`. Cero textos escritos dentro de un
componente. Cambiar el morado de la marca tiene que seguir siendo una edición de una
línea.

**2. No se muestra nada de eventos todavía.** La portada tiene dos secciones — la portada
y "Qué es Hack with DSC" — y así se queda hasta que la lectura de la agenda desde Google
Sheets esté implementada. Ver [`docs/arquitectura.md`](docs/arquitectura.md) §3.

La otra página del sitio es **`/sponsors`**, la de patrocinio para empresas. Su contenido
sí se edita desde una hoja de cálculo, sin desplegar; sin credenciales configuradas se
dibuja con el contenido de reserva del repo y todo sigue funcionando.

---

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · TypeScript · pnpm
· Docker + nginx sobre Ubuntu Server

---

<div align="center">
<sub>Developer Student Club PUCP · Hecho por y para estudiantes.</sub>
</div>
