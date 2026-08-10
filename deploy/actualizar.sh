#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════════════════
# Actualiza la web en la MV a la última versión de la rama principal.
#
# Uso, desde la carpeta del proyecto en el servidor:
#   ./deploy/actualizar.sh
#
# Qué hace, en orden:
#   1. comprueba que exista .env (sin él el build sale con el dominio equivocado)
#   2. baja los cambios de git
#   3. reconstruye la imagen y reemplaza el contenedor
#   4. espera a que el healthcheck pase
#   5. si no pasa, muestra los logs y sale con error
#
# Detalles y resolución de problemas: docs/despliegue.md
# ═══════════════════════════════════════════════════════════════════════════════════

# -e: cortar en el primer error. -u: error si se usa una variable sin definir.
# -o pipefail: que un error en medio de una tubería no pase desapercibido.
set -euo pipefail

# Trabajar siempre desde la raíz del proyecto, sin importar desde dónde se invoque.
cd "$(dirname "$0")/.."

log() { printf '\n\033[1;35m▸ %s\033[0m\n' "$1"; }
error() { printf '\n\033[1;31m✗ %s\033[0m\n' "$1" >&2; }

if [ ! -f .env ]; then
  error "No existe .env. Cópialo de la plantilla y edítalo:  cp .env.example .env"
  exit 1
fi

log "Bajando cambios de git"
git pull --ff-only

log "Reconstruyendo y levantando el contenedor"
# --build fuerza la reconstrucción: hace falta porque NEXT_PUBLIC_SITE_URL se incrusta
# en el bundle al compilar.
docker compose up -d --build

log "Esperando a que la app responda"
# Hasta 60 segundos. Un build recién levantado tarda unos segundos en aceptar tráfico.
for intento in $(seq 1 30); do
  estado=$(docker inspect --format '{{.State.Health.Status}}' hackwithdsc-web 2>/dev/null || echo "sin-datos")

  if [ "$estado" = "healthy" ]; then
    printf '\n\033[1;32m✓ La web está arriba y saludable.\033[0m\n'
    docker compose ps
    exit 0
  fi

  if [ "$estado" = "unhealthy" ]; then
    error "El contenedor arrancó pero no responde. Últimos logs:"
    docker compose logs --tail 60 web
    exit 1
  fi

  printf '  intento %s/30 (estado: %s)\n' "$intento" "$estado"
  sleep 2
done

error "Se agotó el tiempo de espera. Últimos logs:"
docker compose logs --tail 60 web
exit 1
