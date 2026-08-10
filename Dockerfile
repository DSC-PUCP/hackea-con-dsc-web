# ═══════════════════════════════════════════════════════════════════════════════════
# Imagen de producción de hackwithdsc.
#
# Son tres etapas. Cada una parte de la anterior y al final solo se queda la última,
# así que las herramientas de compilación (pnpm, el código fuente, node_modules
# completo) NO viajan al servidor. La imagen final pesa ~200 MB en vez de ~1 GB.
#
# Construir y correr:
#   docker compose up -d --build
#
# Guía completa para el servidor: docs/despliegue.md
# ═══════════════════════════════════════════════════════════════════════════════════

# La versión de Node se fija acá y en package.json (engines no, a propósito: una sola
# fuente). Si se sube, hay que subirla en las tres etapas.
ARG NODE_VERSION=22-alpine


# ── Etapa 1: dependencias ──────────────────────────────────────────────────────────
# Se separa del build para aprovechar la caché de Docker: si no cambió el lockfile,
# esta etapa no se vuelve a ejecutar y el build tarda segundos en vez de minutos.
FROM node:${NODE_VERSION} AS deps
WORKDIR /app

# corepack es el gestor de gestores que trae Node: lee "packageManager" de package.json
# e instala esa versión exacta de pnpm. Así todos usan la misma, local y en el servidor.
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# --frozen-lockfile: si package.json y el lockfile no coinciden, falla en vez de
# resolver versiones por su cuenta. Es lo que garantiza builds reproducibles.
RUN pnpm install --frozen-lockfile


# ── Etapa 2: compilación ───────────────────────────────────────────────────────────
FROM node:${NODE_VERSION} AS builder
WORKDIR /app

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Telemetría de Next apagada: no manda datos de uso desde el servidor.
ENV NEXT_TELEMETRY_DISABLED=1

# Pide el empaquetado autocontenido (.next/standalone). Lo lee next.config.mjs.
# Solo se activa acá: en Vercel, o en un `pnpm build` local, no hace falta.
ENV NEXT_OUTPUT=standalone

# El dominio público se incrusta en el bundle en tiempo de compilación (las variables
# NEXT_PUBLIC_* se resuelven al compilar, no al arrancar). Por eso viene como ARG y no
# solo como variable de entorno del contenedor.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Produce .next/standalone: la app con solo las dependencias que de verdad usa.
RUN pnpm build


# ── Etapa 3: ejecución ─────────────────────────────────────────────────────────────
# Imagen final. Solo Node y lo estrictamente necesario para servir la web.
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# 0.0.0.0 para que el proceso acepte conexiones desde fuera del contenedor.
# Quien limita el acceso desde internet es nginx, no esto. Ver docs/despliegue.md.
ENV HOSTNAME=0.0.0.0

# Correr como root dentro del contenedor es un riesgo innecesario: si alguien
# encontrara un fallo en la app, tendría permisos totales sobre el contenedor.
RUN addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 --ingroup nodejs nextjs

# Los archivos estáticos: todo lo de public/ (logotipo, Bugle, favicon, og.jpg).
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# El servidor autocontenido + los assets con hash que genera Next.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Comprueba la salud desde dentro del contenedor. Se usa `node -e` con fetch (nativo
# desde Node 18) para no tener que instalar curl ni wget en la imagen.
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

# server.js lo genera Next con output: 'standalone'. No es un archivo del repo.
CMD ["node", "server.js"]
