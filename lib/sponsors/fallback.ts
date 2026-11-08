/**
 * Respaldo de /sponsors cuando Sheets no responde, y por clave para sus textos.
 *
 * Refleja el cierre de 2026 y modalidades abiertas: una caída de la hoja no debe
 * reactivar una convocatoria pasada ni compromisos de una edición ya terminada.
 * Las pestañas conservan su contrato técnico; Niveles ahora describe modalidades.
 * Métricas, aliados y testimonios siguen vacíos: sus listas no se mezclan con la hoja.
 * Los aportes y acciones se coordinan; no se publican montos ni datos de participantes.
 */

import type { ContenidoSponsors } from './types'

/**
 * Las claves de Textos son el contrato editorial. Los cuerpos admiten párrafos con
 * dos saltos de línea; nunca HTML ni Markdown de la hoja.
 * `canva.url` no tiene respaldo: no reactivar una presentación antigua si Google falla.
 * La vía de contacto sí conserva respaldo para que la página tenga una salida.
 */
export const contenidoDeReserva: ContenidoSponsors = {
  textos: {
    'hero.eyebrow': 'DSC PUCP · Alianzas',
    'hero.titulo': 'Construyamos lo que sigue.',
    'hero.subtitulo':
      'La edición 2026 de Hack with DSC cerró con 15 actividades de formación y ' +
      'competencia. Hoy abrimos la conversación con empresas que quieran impulsar ' +
      'nuevas oportunidades para la comunidad tecnológica estudiantil.',
    'hero.cta_label': 'Conversemos',
    'intro.titulo': 'Una edición que deja proyectos.',
    'intro.cuerpo':
      'Entre agosto y octubre de 2026, Hack with DSC conectó talleres prácticos, ' +
      'ponencias y competencias del Developer Student Club PUCP. El programa llevó el' +
      ' interés por el software y la inteligencia artificial a retos de construcción,' +
      ' trabajo en equipo y defensa de decisiones técnicas.\n\nLa edición cerró con DSC' +
      ' HACK: diez equipos entregaron proyectos y NTT DATA fue sponsor oficial y sede' +
      ' de la final presencial.\n\nQueremos conversar con aliados que compartan ese ' +
      'propósito. Las próximas colaboraciones se definen con el equipo, según sus ' +
      'objetivos, recursos y disponibilidad.',
    'activos.titulo': 'Lo que podemos construir juntos.',
    'activos.intro':
      'Tres puntos de partida para conversar. El alcance de cada colaboración se ' +
      'acuerda antes de anunciar actividades o compromisos.',
    'niveles.titulo': 'Formas de colaborar.',
    'niveles.intro':
      'Patrocinio, sede, mentoría o actividades conjuntas. Podemos combinar ' +
      'modalidades y definir una colaboración según los objetivos y recursos de ambas' +
      ' partes.',
    'niveles.nota_aporte':
      'Cada colaboración está sujeta a coordinación. Los aportes pueden ser ' +
      'económicos o en especie; el alcance, la disponibilidad y las condiciones se ' +
      'acuerdan con el equipo.',
    'aliados.titulo': 'Nos acompañaron.',
    'testimonios.titulo': 'Lo que cuentan quienes participaron.',
    'cta.titulo': 'Construyamos lo que sigue.',
    'cta.cuerpo':
      'Cuéntanos qué le gustaría aportar a tu equipo: recursos, un espacio, ' +
      'experiencia técnica o una actividad conjunta. Conversemos sobre una ' +
      'colaboración que tenga sentido para ambos.',
    'cta.label': 'Conversemos',
    'cta.url': 'https://api.whatsapp.com/send/?phone=51966477972&text=Hola%2C+quiero+conversar+sobre+colaborar+con+Hack+with+DSC&type=phone_number&app_absent=0',
    'letrachica.titulo': 'Cada alianza se coordina.',
    'letrachica.cuerpo':
      'Las fechas, sedes, actividades y acciones de marca de futuras colaboraciones ' +
      'se acuerdan con el equipo antes de comunicarse. Esta página no constituye una ' +
      'oferta comercial cerrada.',
    'contacto.email': 'dsc.pucp@gmail.com',
  },
  activos: [
    {
      id: 'visibilidad',
      titulo: 'Reconocimiento público',
      descripcion:
        'Podemos acordar acciones de marca y comunicación vinculadas a la ' +
        'colaboración, con canales y alcance definidos para cada caso.',
      icono: 'visibilidad',
      orden: 10,
    },
    {
      id: 'comunidad',
      titulo: 'Conocimiento compartido',
      descripcion:
        'Podemos diseñar talleres, ponencias o encuentros con tu equipo técnico para ' +
        'compartir experiencia con la comunidad estudiantil.',
      icono: 'comunidad',
      orden: 20,
    },
    {
      id: 'premio',
      titulo: 'Recursos para construir',
      descripcion:
        'Premios, herramientas, licencias o infraestructura pueden apoyar nuevos ' +
        'retos. Definimos juntos qué se necesita y cómo se entrega.',
      icono: 'premio',
      orden: 30,
    },
  ],
  niveles: [
    {
      id: 'patrocinio',
      nombre: 'Patrocinio',
      resumen:
        'Recursos para hacer posibles retos y experiencias de aprendizaje. Definimos ' +
        'juntos el aporte y su reconocimiento.',
      aporteTexto: null,
      destacado: false,
      orden: 10,
      beneficios: [
        {
          beneficio: 'Aportes económicos o en especie',
          detalle: 'Premios, licencias, equipos o recursos, según las necesidades acordadas.',
          orden: 10,
        },
        {
          beneficio: 'Reconocimiento de la colaboración',
          detalle: 'Canales, piezas y acciones de marca definidos para cada acuerdo.',
          orden: 20,
        },
      ],
    },
    {
      id: 'sede',
      nombre: 'Sede',
      resumen: 'Un espacio para que la comunidad se encuentre, construya y presente sus proyectos.',
      aporteTexto: null,
      destacado: false,
      orden: 20,
      beneficios: [
        {
          beneficio: 'Espacios e infraestructura',
          detalle: 'Capacidad, equipamiento y condiciones coordinados con anticipación.',
          orden: 10,
        },
        {
          beneficio: 'Encuentros presenciales',
          detalle: 'Formato, logística y participación sujetos a disponibilidad y acuerdo.',
          orden: 20,
        },
      ],
    },
    {
      id: 'mentoria',
      nombre: 'Mentoría',
      resumen: 'Experiencia técnica para acompañar a los equipos y conversar sobre sus decisiones.',
      aporteTexto: null,
      destacado: false,
      orden: 30,
      beneficios: [
        {
          beneficio: 'Acompañamiento técnico',
          detalle: 'Especialidades, dinámica y dedicación acordadas con cada mentor.',
          orden: 10,
        },
        {
          beneficio: 'Conversaciones sobre proyectos',
          detalle: 'Orientación y retroalimentación para los retos que se definan.',
          orden: 20,
        },
      ],
    },
    {
      id: 'actividades',
      nombre: 'Actividades conjuntas',
      resumen: 'Talleres, ponencias o encuentros diseñados con tu equipo para compartir conocimiento.',
      aporteTexto: null,
      destacado: false,
      orden: 40,
      beneficios: [
        {
          beneficio: 'Contenido diseñado en conjunto',
          detalle: 'Tema, público y formato definidos con ambos equipos.',
          orden: 10,
        },
        {
          beneficio: 'Difusión y coordinación compartidas',
          detalle: 'Responsabilidades y canales acordados antes de anunciar cada actividad.',
          orden: 20,
        },
      ],
    },
  ],
  metricas: [],
  aliados: [],
  testimonios: [],
}
