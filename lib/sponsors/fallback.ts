/**
 * CONTENIDO DE RESERVA de la página de patrocinio.
 *
 * Se usa cuando la hoja de cálculo no responde, devuelve error, o simplemente no hay
 * credenciales configuradas — que es el estado normal en desarrollo local. También se
 * usa clave por clave: si `Textos` no trae `cta.titulo`, se toma el de acá y el resto
 * sigue viniendo de la hoja.
 *
 * ── Por qué está separado de `lib/site-config.ts` ────────────────────────────────────
 * No son la misma cosa. `site-config.ts` es la copia FIJA del sitio, la que solo cambia
 * con un despliegue. Esto es el RESPALDO de un contenido que vive fuera del repo y que
 * el equipo edita sin pedirle nada a nadie. Mezclarlos haría creer que editando acá se
 * cambia la web publicada, y no es así: en producción manda la hoja.
 *
 * ── Dos reglas al editar este archivo ────────────────────────────────────────────────
 *
 *  1. **Métricas, aliados y testimonios van VACÍOS.** Nunca datos de relleno. Una
 *     sección sin datos desaparece entera, que es el comportamiento correcto; una
 *     métrica inventada que se escape a producción es una mentira a un patrocinador.
 *  2. **Nada de montos ni de datos de participantes.** Los niveles se describen por lo
 *     que entregan. Ver `internals/sponsors-page-spec.md` §0.
 */

import type { ContenidoSponsors } from './types.ts'

/**
 * Las claves que la página busca en la pestaña `Textos`.
 *
 * Esta lista ES la documentación del contrato: lo que esté acá se puede sobreescribir
 * desde la hoja, y lo que no esté acá la hoja no lo pinta en ninguna parte.
 *
 * `intro.cuerpo`, `cta.cuerpo` y `letrachica.cuerpo` admiten varios párrafos: dos saltos
 * de línea seguidos abren uno nuevo. No se interpreta Markdown ni HTML — el texto se
 * escapa siempre, porque cualquiera con permiso de edición en la hoja podría inyectarlo.
 */
const textos = {
  'hero.eyebrow': 'Patrocinio',
  'hero.titulo': 'Tu marca, donde los estudiantes ya están construyendo software',
  'hero.subtitulo':
    'Hack with DSC es el programa de talleres, ponencias y hackathons del Developer ' +
    'Student Club PUCP. Acompañarlo pone a tu empresa en el lugar donde estos ' +
    'estudiantes aprenden, compiten y deciden con qué tecnologías quieren trabajar.',
  'hero.cta_label': 'Quiero ser aliado',

  'intro.titulo': 'Qué es Hack with DSC',
  'intro.cuerpo':
    'Hack with DSC es el programa de eventos del Developer Student Club PUCP: talleres, ' +
    'ponencias y hackathons para estudiantes de carreras de tecnología y para quienes ' +
    'quieren entrar al desarrollo de software y a la inteligencia artificial.\n\n' +
    'El programa se aleja de la clase teórica. Los participantes construyen proyectos que ' +
    'se despliegan y funcionan, y tienen que sustentar cada decisión técnica. Esa ' +
    'exigencia es lo que hace que valga la pena estar acá: no es un público que asiste, ' +
    'es un público que produce.\n\n' +
    'Lo organiza el equipo estudiantil del Developer Student Club PUCP.',

  'activos.titulo': 'Qué ofrecemos',
  'activos.intro':
    'La alianza se arma con tres piezas. Se pueden tomar juntas o por separado, según lo ' +
    'que tu empresa esté buscando este año.',

  'niveles.titulo': 'Niveles de alianza',
  'niveles.intro':
    'Cada nivel se describe por lo que entrega. Si ninguno encaja con lo que necesitas, ' +
    'se arma uno a medida: conversarlo es parte del trato.',
  'niveles.nota_aporte':
    'Los aportes pueden ser en efectivo o en especie: premios, licencias, equipos, ' +
    'servicios en la nube o cupos de capacitación.',

  'aliados.titulo': 'Empresas que ya nos acompañaron',
  'testimonios.titulo': 'Lo que dicen los participantes',

  'cta.titulo': 'Conversemos',
  'cta.cuerpo':
    'Escríbenos y te respondemos con los formatos disponibles, el calendario de la ' +
    'edición en curso y una propuesta ajustada a lo que tu empresa quiere lograr.',
  'cta.label': 'Quiero ser aliado',
  /*
   * El formulario de Google al que van los dos botones de la página.
   *
   * Está acá como RESPALDO. Lo normal es que gane el valor de la hoja (`cta.url` en la
   * pestaña `Textos`), para poder cambiar el formulario sin desplegar. Si algún día se
   * borra de la hoja, la página sigue teniendo a dónde mandar a la gente.
   */
  'cta.url': 'https://forms.gle/Yk31B9tKiXQcGDhn7',

  'letrachica.titulo': 'Letra chica',
  'letrachica.cuerpo':
    'Las fechas, sedes y formatos de cada edición se confirman con el equipo antes de ' +
    'cerrar la alianza.\n\n' +
    'El stand presencial solo es posible en las actividades que se realizan dentro del ' +
    'campus PUCP. DSC HACK, el hackathon principal, se realiza en una sede externa: ahí la ' +
    'presencia de marca se resuelve con otros formatos.\n\n' +
    'Hack with DSC no comparte datos personales de los participantes con las empresas ' +
    'aliadas: ni currículos, ni perfiles, ni reportes de desempeño.\n\n' +
    'Esta página es informativa y no constituye una oferta comercial cerrada.',

  /*
   * La segunda vía de contacto: se muestra debajo del botón, y además es a donde cae el
   * botón si algún día `cta.url` se queda sin valor. La página nunca se queda sin forma
   * de que alguien escriba.
   */
  'contacto.email': 'dsc.pucp@gmail.com',
} satisfies Record<string, string>

/**
 * Un `ContenidoSponsors` completo y coherente. La página tiene que verse bien solo con
 * esto, sin credenciales y sin hoja: ese es el criterio de terminado.
 */
export const contenidoDeReserva: ContenidoSponsors = {
  textos,

  activos: [
    {
      id: 'visibilidad',
      titulo: 'Visibilidad de marca',
      descripcion:
        'Tu logo y tu mensaje en las piezas de cada edición: convocatorias, materiales ' +
        'del evento, transmisiones y esta web.',
      icono: 'visibilidad',
      orden: 1,
    },
    {
      id: 'comunidad',
      titulo: 'Espacio con la comunidad',
      descripcion:
        'Una ponencia, un taller o una dinámica a cargo de tu equipo técnico, frente a ' +
        'estudiantes que van porque quieren aprender. El formato se define contigo.',
      icono: 'comunidad',
      orden: 2,
    },
    {
      id: 'premio',
      titulo: 'Aporte al premio',
      descripcion:
        'Tu empresa pone parte del premio del hackathon y queda asociada al reto que los ' +
        'equipos tienen que resolver.',
      icono: 'premio',
      orden: 3,
    },
  ],

  niveles: [
    {
      id: 'presencia',
      nombre: 'Marca presente',
      resumen: 'Tu marca acompaña la edición y aparece en todo lo que se publica.',
      aporteTexto: null,
      destacado: false,
      orden: 1,
      beneficios: [
        { beneficio: 'Logo en las piezas de convocatoria y de cierre', detalle: null, orden: 1 },
        { beneficio: 'Logo con enlace en esta web', detalle: null, orden: 2 },
        { beneficio: 'Mención en la apertura del evento', detalle: null, orden: 3 },
      ],
    },
    {
      id: 'comunidad',
      nombre: 'Aliado de comunidad',
      resumen: 'Todo lo anterior, más un espacio propio para hablarle a la comunidad.',
      aporteTexto: null,
      destacado: true,
      orden: 2,
      beneficios: [
        {
          beneficio: 'Ponencia o taller a cargo de tu equipo',
          detalle: 'Entre 30 y 60 minutos, dentro de la programación oficial.',
          orden: 1,
        },
        {
          beneficio: 'Stand en las actividades dentro del campus PUCP',
          detalle: 'Depende de la sede de cada actividad. Ver la letra chica.',
          orden: 2,
        },
        { beneficio: 'Publicación conjunta en los canales del programa', detalle: null, orden: 3 },
      ],
    },
    {
      id: 'principal',
      nombre: 'Aliado principal',
      resumen: 'Todo lo anterior, y tu marca en el centro del hackathon.',
      aporteTexto: null,
      destacado: false,
      orden: 3,
      beneficios: [
        { beneficio: 'El reto del hackathon lleva el nombre de tu empresa', detalle: null, orden: 1 },
        {
          beneficio: 'Un lugar en el jurado',
          detalle: 'Alguien de tu equipo evalúa los proyectos junto a los mentores.',
          orden: 2,
        },
        { beneficio: 'Presencia en la premiación y en el material de cierre', detalle: null, orden: 3 },
        { beneficio: 'Prioridad para renovar la alianza el año siguiente', detalle: null, orden: 4 },
      ],
    },
  ],

  // Los tres van vacíos a propósito. Ver la regla 1 de la cabecera de este archivo.
  metricas: [],
  aliados: [],
  testimonios: [],
}
