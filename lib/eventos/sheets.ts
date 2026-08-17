import { unstable_cache } from 'next/cache'

import { leerRangos, hayCredencialesDeGoogle } from '@/lib/sheets/cliente'
import { aFilas, esMostrable, oNulo } from '@/lib/sheets/filas'
import type { Evento, ResultadoEventos, TipoEvento } from '@/lib/eventos/types'


const ID_HOJA = process.env.GOOGLE_SHEETS_ID?.trim() ?? ''


const RANGO_EVENTOS = 'Eventos | Hack with DSC!A:R'

/**
 * Convierte:
 * "20/08/2026"
 * en:
 * "2026-08-20"
 */
function fechaISO(valor: string | undefined): string | null {
  const fecha = valor?.trim()

  if (!fecha) return null

  const partes = fecha.split('/')

  if (partes.length !== 3) return null

  const [dia, mes, anio] = partes

  if (!dia || !mes || !anio) return null

  return `${anio.padStart(4, '0')}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`
}

/**
 * Convierte valores como:
 * Sí, Si, SI, TRUE, X, 1
 * en true.
 *
 * Todo lo demás se considera false.
 */
function esSi(valor: string | undefined): boolean {
  const normalizado = valor
    ?.trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

  return ['si', 'sí', 'true', 'x', '1', 'yes', 'verdadero'].includes(
    normalizado ?? '',
  )
}

/**
 * Convierte "No", "Sí", etc. a boolean.
 */
function permiteExternos(valor: string | undefined): boolean {
  return esSi(valor)
}

/**
 * Comprueba que el tipo venga dentro de los tipos permitidos
 * por Evento.
 *
 * Si alguien escribe algo inesperado en Google Sheets,
 * usamos "Networking" como valor seguro.
 */
function tipoEvento(valor: string | undefined): TipoEvento {
  const tipos: TipoEvento[] = [
    'Taller',
    'Ponencia',
    'Hackathon',
    'Networking',
    'Panel',
  ]

  const encontrado = tipos.find(
    (tipo) => tipo.toLowerCase() === valor?.trim().toLowerCase(),
  )

  return encontrado ?? 'Networking'
}

/**
 * Convierte una fila de Google Sheets en un Evento.
 *
 * Las cabeceras ya vienen normalizadas por aFilas():
 *
 * "Nombre de evento"              -> nombre_de_evento
 * "Mostrable en web"              -> mostrable_en_web
 * "Permite externos a PUCP"       -> permite_externos_a_pucp
 * "Link de inscripción (luma)"    -> link_de_inscripcion_luma
 * "EVENT_ID"                      -> event_id
 */
function filaAEvento(fila: Record<string, string>): Evento {
  return {
    id: fila.event_id || fila.id,

    titulo: fila.nombre_de_evento,

    tipo: tipoEvento(fila.tipo),

    // Tu Sheet actual no tiene esta columna.
    tematica: '',

    infoWeb: oNulo(fila.info_web),

    fecha: fechaISO(fila.fecha),

    // Tu Sheet actual no tiene esta columna.
    fechaTentativa: null,

    hora: oNulo(fila.hora),

    // Tu Sheet actual no tiene esta columna.
    duracion: null,

    lugar: oNulo(fila.lugar),

    permiteExternos: permiteExternos(
      fila.permite_externos_a_pucp,
    ),

    inscripcion: oNulo(
      fila.link_de_inscripcion_luma,
    ),

    // Por ahora tu Sheet de eventos no tiene una tabla
    // de personas que podamos relacionar con estos IDs.
    ponentes: [],
    mentores: [],
    jurados: [],

    mostrableEnWeb: esMostrable(fila),
  }
}

/**
 * Lee los eventos directamente desde Google Sheets.
 */
async function leerEventosDesdeSheets(): Promise<Evento[]> {
  if (!ID_HOJA) {
    throw new Error(
      'GOOGLE_SHEETS_ID no está configurado.',
    )
  }

  if (!hayCredencialesDeGoogle()) {
    throw new Error(
      'Las credenciales de Google no están configuradas.',
    )
  }

  const [valores] = await leerRangos(
    ID_HOJA,
    [RANGO_EVENTOS],
  )

  const pestana = aFilas(valores)

  return pestana.filas
    .filter(esMostrable)
    .map(filaAEvento)
}

/**
 * Obtiene los eventos.
 *
 * Se cachea durante 5 minutos.
 *
 * La etiqueta "eventos" coincide con la que YA tienes
 * preparada en /api/revalidate.
 */
const obtenerEventosCacheados = unstable_cache(
  async (): Promise<Evento[]> => {
    return leerEventosDesdeSheets()
  },
  ['eventos'],
  {
    revalidate: 300,
    tags: ['eventos'],
  },
)

/**
 * Función pública que utilizará la página.
 */
export async function obtenerEventos(): Promise<ResultadoEventos> {
  try {
    const eventos = await obtenerEventosCacheados()

    return {
      eventos,
      obtenidoEn: new Date().toISOString(),
      origen: 'sheets',
    }
  } catch (error) {
    console.error('Error leyendo eventos:', error)

    return {
      eventos: [],
      obtenidoEn: new Date().toISOString(),
      origen: 'cache',
    }
  }
}