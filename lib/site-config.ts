/**
 * ÚNICA FUENTE DE VERDAD DEL CONTENIDO DEL SITIO.
 *
 * Todos los textos, enlaces y metadatos fijos viven acá. Los componentes solo los
 * consumen: para cambiar una frase, un link o el nombre del programa se edita este
 * archivo y ningún otro. No hay copy escrito a mano dentro de los componentes.
 *
 * El equivalente para COLOR y tipografía es el bloque `:root` de `app/globals.css`
 * (6 tokens de marca). Ver docs/identidad-visual.md.
 *
 * Lo que NO va acá: la información de los eventos (fechas, ponentes, lugares). Eso
 * se leerá desde Google Sheets. Ver docs/arquitectura.md y lib/eventos/types.ts.
 */

// ═════════════════════════════════════════════════════════════════════════════════
// Identidad del sitio
// ═════════════════════════════════════════════════════════════════════════════════

export const site = {
  name: 'Hack with DSC',
  /** Quién organiza. Aparece en el "eyebrow" de la portada y en el pie. */
  organizer: 'DSC PUCP',
  organizerFull: 'Developer Student Club PUCP',

  /**
   * El dominio público NO está acá: se resuelve en `lib/site-url.ts`.
   *
   * Motivo: leerlo bien tiene matices (variables vacías, sin esquema, las que pone
   * Vercel sola) que ya tumbaron un despliegue una vez. Ese archivo lo explica y es el
   * único sitio donde se decide. Se configura con NEXT_PUBLIC_SITE_URL.
   */

  seo: {
    title: 'Hack with DSC — Del código al siguiente nivel',
    description:
      'El programa de talleres, ponencias y hackathons del Developer Student Club PUCP. ' +
      'Aprende haciendo, construye software con estándares profesionales y crece con una ' +
      'comunidad de estudiantes que codean.',
    keywords: [
      'Hack with DSC',
      'DSC PUCP',
      'Developer Student Club',
      'hackathon PUCP',
      'talleres de programación',
      'inteligencia artificial',
      'comunidad de desarrolladores',
      'PUCP',
    ],
  },
} as const

/**
 * Color de fondo para la barra del navegador (`theme-color`).
 *
 * Es el ÚNICO color literal fuera de `app/globals.css`, y está acá solo porque los
 * metadatos de Next necesitan un string y no pueden leer una variable CSS.
 * Si cambia `--brand-ink` en globals.css, hay que cambiar este valor también.
 */
export const themeColor = '#0f0d1c'

/**
 * Enlaces externos.
 *
 * `whatsapp` es el canal principal: es donde se anuncian los eventos, así que es el
 * destino de todas las llamadas a la acción mientras la web todavía no muestre la
 * agenda.
 *
 * Los que están en `null` se ocultan solos en la interfaz — no hay que borrar código
 * para esconderlos. Cuando exista la cuenta, se pone la URL acá y aparece.
 */
export const links = {
  whatsapp: 'https://chat.whatsapp.com/JLlbloJJKu8L8O7vLLGFHn?s=cl&p=a&mlu=0&ilr=0',
  instagram: null as string | null,
  linkedin: null as string | null,
  github: null as string | null,
} as const

// ═════════════════════════════════════════════════════════════════════════════════
// Navegación
// ═════════════════════════════════════════════════════════════════════════════════

/**
 * Enlaces del menú. Todavía no hay ninguna entrada de eventos a propósito: la web no
 * muestra agenda hasta que la lectura desde Google Sheets esté lista.
 *
 * ── Por qué el menú son SOLO páginas ────────────────────────────────────────────────
 * Antes había también un `#que-es`, y se quitó por dos razones. La primera: no aportaba.
 * La portada tiene exactamente dos secciones, y el hero ya ofrece ese mismo destino dos
 * veces (el botón secundario y la señal de scroll); un enlace de menú a la segunda
 * sección de una página de dos secciones es decoración. La segunda: desde `/sponsors` te
 * navegaba y te soltaba a media portada, saltándose el hero.
 *
 * Que el menú signifique una sola cosa —«sitios a los que puedes ir»— es además lo que
 * permite que quepa en un teléfono sin desplegable. Con dos entradas no cabía, y estaba
 * oculto por debajo de 640 px: `/sponsors` era inalcanzable desde un móvil.
 *
 * Aun así admite los dos tipos de destino, por si algún día hace falta:
 *
 *   · anclas de la portada — `'#que-es'`, SIEMPRE sin la barra inicial. El header le pone
 *     el `/` delante solo cuando hace falta (o sea, cuando no estás en la portada);
 *   · rutas del sitio — `'/sponsors'`, tal cual.
 *
 * La lógica está en `resolverDestino`, dentro de components/site-header.tsx.
 */
export const navegacion = [{ href: '/sponsors', label: 'Patrocinio' }] as const

/**
 * Enlaces de sitio del pie. Es la red de seguridad de la navegación: funciona en
 * cualquier ancho, no depende de que el menú de arriba tenga espacio, y es donde una
 * empresa busca «patrocinio» por pura convención.
 *
 * Acá los destinos van SIEMPRE absolutos (`/#que-es`, no `#que-es`) porque el pie es un
 * componente de servidor y no sabe en qué ruta está. Desde la portada eso recarga en vez
 * de hacer scroll suave, y es un precio aceptable: quien pulsa un enlace del pie ya
 * terminó con la página.
 */
export const navegacionPie = [
  { href: '/', label: 'Inicio' },
  { href: '/#que-es', label: 'Qué es' },
  { href: '/sponsors', label: 'Patrocinio' },
] as const

// ═════════════════════════════════════════════════════════════════════════════════
// Textos
// ═════════════════════════════════════════════════════════════════════════════════

export const copy = {
  header: {
    /**
     * Etiqueta accesible del botón de WhatsApp cuando se queda sin texto.
     *
     * Por debajo de 640 px el botón se pinta solo con el icono: a 390 px el ancho útil
     * son 350, y el logotipo más el enlace del menú más el botón con texto no caben. Sin
     * esta etiqueta, un lector de pantalla anunciaría «enlace» y nada más.
     */
    comunidadAria: 'Únete a la comunidad en WhatsApp',
  },

  hero: {
    eyebrow: 'DSC PUCP presenta',
    /** El título se parte en dos: la segunda mitad se pinta con el degradado de marca. */
    titulo: { normal: 'Del código al', destacado: 'siguiente nivel' },
    descripcion:
      'Talleres, ponencias y hackathons para que dejes de acumular teoría y empieces a ' +
      'construir software de verdad: desplegado, defendible y hecho en equipo.',
    ctaPrimario: 'Únete a la comunidad',
    ctaSecundario: 'Qué es Hack with DSC',
    scrollCue: 'Conoce el programa',
    /** Texto alternativo de la mascota, para lectores de pantalla. */
    bugleAlt:
      'Bugle, la mascota de DSC PUCP: un ave con capucha y equipo cyberpunk, corriendo hacia adelante.',
  },

  queEs: {
    eyebrow: 'Qué es Hack with DSC',
    titulo: 'Un programa hecho para llevarte al siguiente nivel',
    intro:
      'Hack with DSC es el programa de eventos del Developer Student Club PUCP para impulsar ' +
      'la competitividad y las habilidades técnicas de quienes estudian tecnología o quieren ' +
      'entrar al desarrollo de software y a la inteligencia artificial. En vez de más clases ' +
      'teóricas, un ecosistema de aprendizaje y competición enfocado en la práctica intensiva.',
    cita:
      'Transformar el interés académico en capacidades técnicas aplicables, llevando a los ' +
      'estudiantes desde el conocimiento teórico hasta la construcción de software con ' +
      'estándares profesionales.',
    formatosTitulo: 'Tres formatos, un mismo objetivo',
    pilaresEyebrow: 'Sobre qué se construye',
    pilaresTitulo: 'Cuatro pilares que sostienen todo el programa',
    /** Cierre de la sección. `destacado` va en verde, igual que en la pieza gráfica. */
    cierre: {
      antes: 'Un programa.',
      destacado: 'Muchos eventos.',
      despues: 'Una comunidad que crece contigo.',
    },
  },

  cta: {
    titulo: 'La agenda se está cocinando',
    descripcion:
      'Los talleres, ponencias y hackathons del programa se anuncian primero en el grupo de ' +
      'la comunidad. Entra ahí y te enteras antes que nadie — pronto también los verás acá.',
    boton: 'Entrar al grupo de WhatsApp',
    nota: 'Abierto a toda la comunidad PUCP.',
  },

  footer: {
    tagline: 'Un programa. Muchos eventos. Una comunidad que crece contigo.',
    credito: 'Hecho con ⚡ por y para estudiantes.',
    /** Rótulos de las dos columnas de enlaces. Sin ellos se leen como una sola lista. */
    tituloSitio: 'El sitio',
    tituloRedes: 'Comunidad',
  },

  /**
   * MICRO-COPIA de la página `/sponsors`: etiquetas de botones, rótulos y textos
   * accesibles. Es lo único de esa página que vive en el repo.
   *
   * El contenido editorial (títulos, párrafos, niveles, beneficios) NO está acá: se
   * edita en Google Sheets y su respaldo está en `lib/sponsors/fallback.ts`. La frontera
   * es fácil de recordar: si es una palabra de la interfaz, va acá; si es algo que el
   * equipo querría cambiar sin pedir un despliegue, va en la hoja.
   */
  sponsors: {
    /** Etiquetas accesibles de las secciones que no traen título desde la hoja. */
    metricasAria: 'El programa en números',
    galeriaAria: 'Fotos de ediciones anteriores',
    /**
     * Llamada secundaria de la portada. Hay dos porque la sección a la que baja depende
     * de lo que la hoja tenga publicado: si los niveles todavía están en `mostrable=NO`,
     * esa sección no existe en el documento y el enlace no llevaría a ninguna parte.
     */
    verNiveles: 'Ver los niveles de alianza',
    verOferta: 'Ver qué ofrecemos',
    /** Distintivo del nivel marcado como `destacado` en la hoja. */
    nivelDestacado: 'Destacado',
    /** Recorte de los testimonios largos. Es un `<details>`: cero JavaScript. */
    verMas: 'Ver testimonio completo',
    verMenos: 'Ver menos',
    verPublicacion: 'Ver publicación',
    /**
     * Antecede al `contacto.email` de la hoja. Si no hay correo, no se muestra nada.
     * Se evita empezar con una «O» suelta: en la tipografía del sitio se lee como un cero.
     */
    escribenos: 'También puedes escribirnos a',
  },
} as const

/**
 * Metadatos de `/sponsors`. Son estáticos a propósito: WhatsApp y LinkedIn cachean la
 * vista previa de forma agresiva, así que no pueden depender de la hoja de cálculo.
 *
 * Los lee un jefe de marketing, no un estudiante: dicen qué es y para quién, y no son un
 * eslogan.
 */
export const seoSponsors = {
  title: 'Patrocina Hack with DSC — DSC PUCP',
  description:
    'Programa de talleres, ponencias y hackathons del Developer Student Club PUCP. ' +
    'Formatos de alianza para empresas que quieren estar donde los estudiantes de ' +
    'tecnología construyen software de verdad.',
  ogAlt: 'Hack with DSC — información de patrocinio para empresas',
} as const

/**
 * Fotos de ediciones anteriores para la galería de `/sponsors`.
 *
 * Viven en el repo (`public/sponsors/`) y no en la hoja porque son assets, no contenido
 * editable. La lista es explícita —y no un listado del directorio— porque cada foto
 * necesita su texto alternativo, y eso no se deduce de un nombre de archivo.
 *
 * Vacía = la sección no aparece. Es el estado correcto mientras no haya fotos propias:
 * una galería con imágenes de archivo le miente al que la lee.
 */
export const galeriaSponsors = [] as ReadonlyArray<{
  /** Ruta dentro de `public/`. Ej.: `/sponsors/vibecoding-2026-01.webp` */
  src: string
  alt: string
  width: number
  height: number
}>

// ═════════════════════════════════════════════════════════════════════════════════
// Datos de la sección "Qué es Hack with DSC"
// ═════════════════════════════════════════════════════════════════════════════════

/**
 * Los tres formatos del programa. Salen de la pieza gráfica oficial.
 *
 * `icon` es el nombre de un icono de components/brand/icons.tsx.
 * `color` es un token de marca; el mapa de clases está en el componente que lo usa.
 */
export const formatos = [
  {
    id: 'talleres',
    icon: 'chevrons',
    titulo: 'Talleres',
    descripcion: 'Aprende haciendo, con práctica real y mentoría cercana.',
    color: 'blue',
  },
  {
    id: 'ponencias',
    icon: 'star',
    titulo: 'Ponencias',
    descripcion: 'Conecta con expertos y perspectivas que amplían tu visión.',
    color: 'purple',
  },
  {
    id: 'hackathons',
    icon: 'bolt',
    titulo: 'Hackathons',
    descripcion: 'Compite, construye y demuestra todo tu talento en equipo.',
    color: 'red',
  },
] as const

/** Los pilares estratégicos del programa. Salen de docs/esencia.md. */
export const pilares = [
  {
    titulo: 'Adopción técnica y uso de IA',
    descripcion:
      'Uso responsable, técnico y avanzado de IA generativa para acelerar el desarrollo, sin ' +
      'perder de vista los fundamentos de la ingeniería y una arquitectura sólida.',
  },
  {
    titulo: 'Aplicabilidad real',
    descripcion:
      'Los proyectos no se quedan en localhost: se despliegan, escalan y funcionan. ' +
      'Exactamente las capacidades que el mercado laboral pide.',
  },
  {
    titulo: 'Comunidad y networking',
    descripcion:
      'Una red sólida entre estudiantes, mentores, docentes y aliados del sector ' +
      'tecnológico y corporativo. Trabajo en equipo y vinculación profesional.',
  },
  {
    titulo: 'Excelencia y pensamiento crítico',
    descripcion:
      'No basta con que el código funcione: cada decisión técnica tiene que venir con un ' +
      'respaldo lógico y estructurado que puedas defender.',
  },
] as const

/** Palabras de la cinta que se desplaza al pie de la portada. */
export const cintaPalabras = [
  'Talleres',
  'Ponencias',
  'Hackathons',
  'Inteligencia Artificial',
  'Arquitectura de software',
  'Del localhost a producción',
  'Comunidad',
  'Mentoría',
] as const

export type Formato = (typeof formatos)[number]
export type Pilar = (typeof pilares)[number]
export type BrandColor = Formato['color']
