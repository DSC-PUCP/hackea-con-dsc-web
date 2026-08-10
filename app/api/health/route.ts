/**
 * Endpoint de salud: GET /api/health
 *
 * Sirve para tres cosas en el servidor:
 *   1. el `healthcheck` de docker-compose, que reinicia el contenedor si deja de
 *      responder;
 *   2. comprobar a mano que la app está viva sin depender de cómo se vea la web
 *      (`curl localhost:3000/api/health`);
 *   3. monitoreo externo, si algún día se agrega.
 *
 * Devuelve 200 y JSON. No expone nada sensible.
 */

/** Nunca se cachea: una respuesta cacheada no dice nada sobre el estado actual. */
export const dynamic = 'force-dynamic'

export function GET() {
  return Response.json({
    status: 'ok',
    /** Sirve para saber si el contenedor se reinició hace poco. */
    uptime: Math.round(process.uptime()),
    timestamp: new Date().toISOString(),
  })
}
