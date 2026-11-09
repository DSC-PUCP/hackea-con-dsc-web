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
 * La agenda se lee desde Google Sheets. El recap histórico de DSC HACK es la
 * excepción aprobada: sus campos públicos curados se conservan acá.
 */

import type { FotoRecap, ProyectoRecap } from './dsc-hack/types.ts'

/** Reseñas históricas públicas por ID. La pertenencia y las identidades las decide Sheets. */
export const aportesOrganizacion: Record<string, { aporte: string; reconocimiento?: string }> = {
  GIANO: { aporte: 'Coordinación del programa', reconocimiento: 'Por impulsar el programa y acompañar al equipo de principio a fin.' },
  PAMELA: { aporte: 'Organización y diseño', reconocimiento: 'Por unir organización y diseño para darle forma al programa.' },
  FABI: { aporte: 'Organización y comunicación', reconocimiento: 'Por su iniciativa para organizar encuentros y conectar con la comunidad.' },
  LEO: { aporte: 'Organización y apoyo al equipo', reconocimiento: 'Por estar presente y sumar al equipo a lo largo del programa.' },
  SAMIR: { aporte: 'Organización y difusión', reconocimiento: 'Por sacar adelante encuentros y ayudar a que llegaran a más personas.' },
  FABIOLA: { aporte: 'Organización, diseño y difusión', reconocimiento: 'Por sumar desde la organización, la creatividad y el trabajo en equipo.' },
  ANGIE: { aporte: 'Organización y comunicación', reconocimiento: 'Por su dedicación a la organización y a mantener conectada a la comunidad.' },
  PIERO: { aporte: 'Organización y comunicación', reconocimiento: 'Por su compromiso y buena chamba en los encuentros y su comunicación.' },
  MATIAS_RIOS: { aporte: 'Fotografía' },
  KEYLA_BRAVO: { aporte: 'Apoyo logístico' },
  LEANDRO: { aporte: 'Apoyo en los encuentros' },
  FERNANDO: { aporte: 'Desarrollo web y apoyo en los encuentros' },
  BRYCE_HUAQUI: { aporte: 'Apoyo y difusión' },
  FREDJUN: { aporte: 'Organización y logística' },
  CARLOS_ESTRADA: { aporte: 'Diseño y difusión' },
  ARIADNA_FLOREZ: { aporte: 'Contenido audiovisual' },
  BREIGZON_TURCO: { aporte: 'Apoyo en alianzas' },
  FREDY: { aporte: 'Apoyo en alianzas' },
  ANTHONY_LOPEZ: { aporte: 'Apoyo y difusión' },
  ALVARO_VARGAS: { aporte: 'Apoyo logístico' },
  RENZO_AREVALO: { aporte: 'Apoyo en los encuentros' },
  REBECA_HINOJOSA: { aporte: 'Apoyo y diseño' },
  VICTOR_CCOSI: { aporte: 'Apoyo al equipo' },
}

export const seoOrganizacion = {
  title: 'Organización — Hack with DSC 2026',
  description: 'Conoce al equipo de voluntarios de DSC PUCP que hizo posible Hack with DSC 2026 y los aportes que sumaron al programa.',
  ogImagen: '/og-organizacion.jpg',
  ogAlt: 'El equipo detrás de Hack with DSC 2026.',
  ogTitulo: 'EL EQUIPO',
  ogResumen: 'La chamba tiene nombres.',
} as const

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
    title: 'Hack with DSC 2026 — del apunte al deploy',
    description:
      'La edición 2026 de Hack with DSC cerró con 15 actividades. Conoce el programa ' +
      'del Developer Student Club PUCP y los diez proyectos del cierre DSC HACK.',
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
 * `whatsapp` lleva a la comunidad general de DSC PUCP: nuevas iniciativas y
 * conversaciones de tecnología, también después del cierre de Hack with DSC.
 *
 * Los que están en `null` se ocultan solos en la interfaz — no hay que borrar código
 * para esconderlos. Cuando exista la cuenta, se pone la URL acá y aparece.
 */
export const links = {
  /**
   * El grupo pertenece a DSC PUCP; no es un canal exclusivo de este programa.
   */
  whatsapp: 'https://chat.whatsapp.com/LwF4C37MnBkIpm9J0QIjar?s=cl&p=a&iam=2',
  instagram: 'https://www.instagram.com/dsc.pucp/',  
  albumDscHack: 'https://drive.google.com/drive/folders/1XI__YFq7X1q7BP6rehrd776fevibuvg1',
  anuncioNttData: 'https://www.linkedin.com/feed/update/urn:li:activity:7521394275788591104',
} as const

/**
 * Las redes de **DSC PUCP**, no de Hack with DSC.
 *
 * La distinción importa y por eso están en su propia constante: Hack with DSC es un
 * programa, y quien lo organiza es el Developer Student Club PUCP, que existe antes y
 * después del programa y publica muchas más cosas. En el pie se rotulan como suyas, para
 * que nadie siga una cuenta esperando encontrar solo esta agenda.
 *
 * `null` significa «esa cuenta todavía no existe» y el pie la salta sin dejar hueco. Para
 * publicar una, basta escribir su URL acá: no hay que tocar ningún componente.
 */
export const redesDsc = {
  instagram: 'https://www.instagram.com/dsc.pucp/',
  linkedin: 'https://www.linkedin.com/company/developer-student-club-pucp',
  github: 'https://github.com/DSC-PUCP',
  youtube: 'https://www.youtube.com/@dsc_pucp/',
  tiktok: 'https://www.tiktok.com/@dsc.pucp',
} as const

/** Los otros dos caminos a DSC PUCP, que no son redes sociales y se leen como texto. */
export const contactoDsc = {
  web: 'https://dsc.inf.pucp.edu.pe',
  correo: 'dsc.pucp@gmail.com',
} as const

// ═════════════════════════════════════════════════════════════════════════════════
// Navegación
// ═════════════════════════════════════════════════════════════════════════════════

/**
 * Solo Agenda y Patrocinio en el header para conservar una fila también en móvil.
 * El recap se descubre desde el hero y el pie. Las anclas siguen admitiéndose.
 */
export const navegacion = [
  { href: '/agenda', label: 'Agenda' },
  { href: '/sponsors', label: 'Patrocinio' },
] as const

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
  { href: '/dsc-hack', label: 'DSC HACK' },
  { href: '/agenda', label: 'Agenda' },
  { href: '/sponsors', label: 'Patrocinio' },
  { href: '/organizacion', label: 'Organización' },
] as const

// ═════════════════════════════════════════════════════════════════════════════════
// Textos
// ═════════════════════════════════════════════════════════════════════════════════

export const copy = {
  organizacion: {
    eyebrow: 'Organización · Hack with DSC 2026',
    titulo: 'La chamba tiene nombres.',
    intro: 'Detrás de cada encuentro hubo un equipo de voluntarios de DSC PUCP. ' +
      'Estas son las personas que hicieron posible Hack with DSC.',
    fotoPie: 'Parte del equipo organizador en el cierre DSC HACK.',
    destacadosTitulo: 'Una mención especial.',
    destacadosIntro: 'Por la dedicación, la iniciativa y la buena chamba a lo largo del programa. Gracias por dar ese extra.',
    equipoTitulo: 'Cada aporte cuenta.',
    equipoIntro: 'Organización, diseño, difusión y apoyo en los encuentros. El programa se hizo en equipo.',
    aporteGeneral: 'Equipo organizador',
    linkedin: 'LinkedIn',
    github: 'GitHub',
    perfilAria: (red: string, nombre: string) => `${red} de ${nombre}`,
    vacio: 'Estamos preparando las fichas del equipo. Mientras tanto, seguimos en la comunidad de DSC PUCP.',
    portada: {
      etiqueta: 'El equipo detrás',
      titulo: 'Esto se hizo en comunidad.',
      descripcion: 'Conoce a quienes pusieron tiempo, ideas y chamba para hacer posible Hack with DSC.',
      boton: 'Conoce al equipo',
    },
  },
  header: {
    /**
     * Etiqueta accesible del botón de WhatsApp cuando se queda sin texto.
     *
     * Por debajo de 640 px el botón se pinta solo con el icono: a 390 px el ancho útil
     * son 350, y el logotipo más el enlace del menú más el botón con texto no caben. Sin
     * esta etiqueta, un lector de pantalla anunciaría «enlace» y nada más.
     */
    comunidadAria: 'Únete a la comunidad de DSC PUCP en WhatsApp',
    comunidadLabel: 'Comunidad',
    navegacionAria: 'Páginas del sitio',
    inicioAria: 'ir al inicio',
  },

  hero: {
    eyebrow: 'Edición 2026 · Cerramos construyendo',
    /** El título se parte en dos: la segunda mitad se pinta con el degradado de marca. */
    titulo: { normal: 'La edición cerró.', destacado: 'Los proyectos siguen' },
    descripcion:
      'De los talleres al reto final. Así fue Hack with DSC 2026, el programa del ' +
      'Developer Student Club PUCP. En DSC HACK, diez equipos entregaron sus proyectos. ' +
      'Conoce lo que construyeron y a quienes lo hicieron posible.',
    ctaPrimario: 'Ver DSC HACK',
    ctaSecundario: 'Conoce el programa',
    scrollCue: 'Conoce el programa',
    /** Texto alternativo de la mascota, para lectores de pantalla. */
    bugleAlt:
      'Bugle, la mascota de DSC PUCP: un ave con capucha y equipo cyberpunk, corriendo hacia adelante.',
    resultadosAria: 'Resultados del programa Hack with DSC 2026',
    resultadosNota: 'Edición 2026 · Registros de Luma en 14 actividades.',
  },

  dscHack: {
    eyebrow: 'Hack with DSC · El gran cierre',
    titulo: 'DSC HACK',
    edicion: '2026',
    lema: 'Lo que construimos juntos.',
    intro: 'Cerramos el programa con una hackathon: ideas que se convirtieron en proyectos, decisiones que hubo que defender y una comunidad que las hizo posibles.',
    fecha: 'Final presencial · 31 de octubre de 2026',
    lugar: 'NTT DATA',
    ctaProyectos: 'Explorar los proyectos',
    ctaFotos: 'Así se vivió',
    fotoPie: 'Código, presentaciones y comunidad para cerrar la edición.',
    cifrasAria: 'Resultados de DSC HACK 2026',
    cifrasNota: 'Integrantes de los equipos con entrega.',
    proyectosTitulo: 'Del reto al proyecto.',
    proyectosIntro: 'Diez equipos entregaron. Acá están sus propuestas, las personas detrás y los recursos que compartieron.',
    catalogoEtiqueta: 'Proyectos · DSC HACK 2026',
    equipo: 'Equipo',
    integrantes: 'Quienes lo construyeron',
    linkedinAria: 'en LinkedIn',
    premios: {
      primero: { etiqueta: 'Primer lugar', detalle: 'El primer puesto de DSC HACK 2026.' },
      segundo: { etiqueta: 'Segundo lugar', detalle: 'El segundo puesto de DSC HACK 2026.' },
      'chaotic-good': { etiqueta: 'Chaotic Good', detalle: 'Un reconocimiento con nombre propio.' },
    },
    enlaces: { demo: 'Ver demo', repositorio: 'Código', presentacion: 'Presentación', video: 'Ver video' },
    enlaceAria: (recurso: string, proyecto: string, equipo: string) => `${recurso}: ${proyecto}, equipo ${equipo}`,
    galeriaTitulo: 'Fuera del localhost.',
    galeriaIntro: 'Presentar, responder preguntas, celebrar. Algunos momentos de la final presencial.',
    album: 'Ver el álbum completo',
    ampliarFoto: 'Abrir foto en tamaño completo en una nueva pestaña',
    galeriaAria: 'Fotos de la final de DSC HACK',
    aliadoEtiqueta: 'Sponsor oficial y sede de la final',
    aliadoNombre: 'NTT DATA',
    aliadoTitulo: 'Un espacio para hacerlo real.',
    aliadoDescripcion: 'Gracias a NTT DATA por acompañar DSC HACK como sponsor oficial y recibir la final presencial en sus instalaciones.',
    aliadoEnlace: 'Conoce la colaboración',
    cierreTitulo: 'La edición terminó. La comunidad sigue.',
    cierreIntro: 'Nos seguimos encontrando en la comunidad de DSC PUCP. Entérate de nuevas iniciativas, comparte lo que construyes y conversa sobre los temas tech que te interesan.',
    cierreCta: 'Únete a DSC PUCP',
    bugleAlt: 'Bugle, la mascota de DSC PUCP, señalando hacia el enlace de su comunidad.',
    subtitulos: 'Español',
  },

  /*
   * ── La voz de la web ─────────────────────────────────────────────────────────────
   * Habla "nosotros", el equipo. Cercana, con jerga peruana suave ("chamba", "de una")
   * y humor de programador en dosis de guiño: uno por sección, no un chiste por frase.
   * Los HECHOS no se inventan: todo lo que se afirma sale de docs/esencia.md. La voz
   * cambia cómo se dice, no qué se promete.
   *
   * Los títulos son frases cortas con punto y no rótulos ("Las reglas de la casa.", no
   * "Nuestros pilares"). Es la diferencia entre una página que habla y una que enumera.
   */
  queEs: {
    /** Rótulo accesible de la sección: ya no hay "eyebrow" visible que la nombre. */
    aria: 'Qué es Hack with DSC',
    /** Va en letra de póster, en mayúsculas. Es la frase que abre la portada después del hero. */
    titulo: 'Menos diapositivas. Más código que corre.',
    intro:
      'Hack with DSC es el programa de eventos del Developer Student Club PUCP: talleres, ' +
      'ponencias y hackathons para quienes estudian tecnología o quieren meterse al ' +
      'desarrollo de software y a la IA. La idea es simple: que lo que aprendes en clase ' +
      'termine siendo algo que funciona, que está en línea y que puedes defender.',
    /** El lema que va enmarcado entre los dos chevrons gigantes: ❰ … ❱ */
    marco: 'Del apunte al deploy',
    formatosTitulo: 'Tres formas de entrar',
    pilaresTitulo: 'Las reglas de la casa.',
    pilaresIntro: 'Cuatro ideas que sostienen todo el programa. Las vas a escuchar seguido.',
    /**
     * La frase de la pieza 2 desemboca ahora en la comunidad general de DSC PUCP,
     * que continúa después del cierre del programa.
     */
    cierre: {
      antes: 'Un programa.',
      destacado: 'Muchos eventos.',
      despues: 'Una comunidad.',
    },
    /** Texto alternativo de Bugle asomándose junto a los formatos. */
    bugleAsomadoAlt: 'Bugle, la mascota, asomándose por el borde con cara de travesura.',
    /** Texto alternativo de Bugle señalando el botón del bloque morado. */
    bugleSenalandoAlt: 'Bugle, la mascota, señalando hacia el grupo comunitario de DSC PUCP.',
  },

  /**
   * MICRO-COPIA de la sección de agenda. El contenido de cada evento (nombre, fecha,
   * descripción, quién participa) NO está acá: se edita en Google Sheets. La frontera es
   * la misma que en `sponsors`: si es una palabra de la interfaz, va acá; si es algo que
   * el equipo querría cambiar sin pedir un despliegue, va en la hoja.
   */
  agenda: {
    /** Cabecera de la página `/agenda`. */
    eyebrow: 'Agenda',
    /**
     * ── Por qué el título de la página NO habla del futuro ─────────────────────────
     * Decía «Todo lo que se viene», y debajo la primera lista se llamaba «Lo que viene»:
     * dos encabezados seguidos diciendo lo mismo, y el de abajo sin ganarse su sitio.
     *
     * El reparto que lo arregla es que cada uno haga un trabajo distinto: **el H1 nombra
     * la página entera** —que incluye lo que ya pasó— y **cada H2 nombra su lista**. Por
     * eso este título habla de «el programa» y no de «lo que viene».
     *
     * Tiene un segundo efecto que importa más de lo que parece: el día que termine el
     * último evento del ciclo, la página va a quedarse solo con eventos pasados. Con el
     * título viejo se habría titulado «Todo lo que se viene» encima de una lista de cosas
     * que ya ocurrieron. Con este, sigue siendo cierto sin que nadie toque nada.
     */
    titulo: 'Todo el programa, fecha por fecha',
    intro:
      'Talleres, ponencias y hackathons del programa. Cada uno se inscribe por separado y ' +
      'los cupos vuelan: abre el que te sirva y agéndalo de una.',
    /** Texto alternativo de Bugle de espaldas con su pantalla holográfica, en la cabecera. */
    bugleAlt: 'Bugle, la mascota, de espaldas revisando una pantalla holográfica con código.',

    /*
     * Los dos rótulos de lista. Dicen QUÉ SUBCONJUNTO es cada una, no de qué va la
     * página: eso ya lo dijo el título de arriba. Son una pareja y hay que leerlos
     * juntos — «Próximos eventos» / «Ya fueron».
     */
    tituloProximos: 'Próximos eventos',
    tituloPasados: 'Ya fueron',
    introPasados:
      'Lo que ya pasó este ciclo. Las inscripciones cerraron, pero la página de cada uno ' +
      'sigue abierta por si quieres chismear de qué fue.',
    /** Sello tipo sticker que va sobre cada evento pasado. */
    selloPasado: 'Ya fue',

    /** Cuando la hoja todavía no tiene fecha. Ver lib/eventos/fechas.ts. */
    sinFecha: 'Fecha por confirmar',
    /** Rótulo del grupo que junta a todos los eventos sin fecha, al final de la lista. */
    sinFechaGrupo: 'Todavía sin fecha',

    inscribirme: 'Inscribirme',
    /** Cuando el evento está confirmado pero el enlace de Luma todavía no existe. */
    proximamente: 'Inscripción próximamente',
    /** En los eventos ya pasados, donde «Inscribirme» sería mentira. */
    verEnLuma: 'Ver evento',
    /** `aria-label` del botón de compartir: va seguido de «: <nombre del evento>». */
    compartir: 'Compartir evento',
    /*
     * Cortos a propósito: van en la misma línea que el tipo de evento, arriba de la
     * ficha, y ahí compiten por el ancho con el título. «Solo para la comunidad PUCP»
     * ocupaba media línea para decir lo mismo.
     */
    abiertoExternos: 'Abierto a externos',
    soloPucp: 'Solo PUCP',

    /**
     * Rótulos de quién participa, por rol. En formas que no marcan género: la hoja dice
     * «ponentes/mentores/jurados» porque son nombres de columna, pero en la web se lee a
     * personas concretas, y los colectivos («Mentoría», «Jurado») dicen lo mismo sin
     * obligar a elegir. Ver components/eventos/personas.tsx.
     */
    roles: {
      ponentes: 'A cargo de',
      mentores: 'Mentoría',
      jurados: 'Jurado',
    },
    /** `aria-label` del enlace de cada persona: va después de su nombre. */
    enLinkedin: 'en LinkedIn',

    /**
     * Estado vacío de la página.
     *
     * A diferencia de una sección, una PÁGINA no se puede esconder: si la hoja no se
     * puede leer o no hay ningún evento publicado, `/agenda` sigue existiendo y alguien
     * va a llegar. Así que tiene que decir algo útil y ofrecer una salida, que es el
     * grupo de WhatsApp.
     */
    vacio: {
      titulo: 'No hay eventos publicados.',
      descripcion:
        'Mientras tanto, conoce las nuevas iniciativas de DSC PUCP y conversa sobre ' +
        'tecnología en su grupo comunitario.',
    },
  },

  cta: {
    titulo: 'Sigue conectado con DSC PUCP.',
    descripcion:
      'Cerramos la edición 2026 y seguimos en la comunidad general de DSC PUCP. ' +
      'Entérate de nuevas iniciativas y conversa sobre cualquier tema tech que te interese.',
    boton: 'Únete a DSC PUCP',
    nota: 'El grupo comunitario de DSC PUCP en WhatsApp',
  },

  footer: {
    whatsapp: 'WhatsApp de DSC PUCP',
    tagline: 'Del apunte al deploy Talleres, ponencias y hackathons del DSC PUCP',
    credito: 'Hecho con ⚡ por y para estudiantes',
    /** Rótulos de las dos columnas de enlaces. Sin ellos se leen como una sola lista. */
    tituloSitio: 'El sitio',
    tituloRedes: 'Comunidad',
    /**
     * Rótulo de la fila de iconos. Dice de QUIÉN son las cuentas, y esa es toda su razón
     * de existir: sin él, cinco logotipos debajo del nombre «Hack with DSC» se leen como
     * las redes del programa, que no son. Ver `redesDsc` en este mismo archivo.
     */
    tituloRedesDsc: 'Síguenos como DSC PUCP',
    /** Textos accesibles de la fila de iconos: se leen «Instagram de DSC PUCP». */
    redAria: (red: string) => `${red} de DSC PUCP`,
    web: 'Web de DSC PUCP',
    correo: 'Escríbenos',
  },

  /** La página 404 (`app/not-found.tsx`). Bugle perdido junto a una pantalla roja vacía. */
  noEncontrado: {
    /** El "404" no está dibujado en la imagen: los generadores de imagen deforman el texto. */
    codigo: '404',
    titulo: 'Bugle buscó esta página por todos lados.',
    descripcion:
      'Ni `git log` la encuentra. Puede que el enlace esté mal escrito o que la página se ' +
      'haya mudado.',
    volver: 'Volver al inicio',
    agenda: 'Ver la agenda',
    bugleAlt: 'Bugle, la mascota, rascándose la cabeza junto a una pantalla roja vacía.',
  },

  /**
   * El mensaje para quien abre las herramientas de desarrollo. Es para la gente que más
   * nos interesa: la que mira cómo está hecho algo. Cada elemento es una línea; después
   * de la última va el enlace al grupo.
   */
  consola: [
    '❰ Hack with DSC ❱',
    '¿Inspeccionando el código? Ya eres de los nuestros.',
    'Nuevas iniciativas y conversaciones tech en la comunidad de DSC PUCP:',
  ],

  /** El código Konami (↑↑↓↓←→←→BA): Bugle cruza corriendo la pantalla. */
  konami: {
    mensaje: 'Modo hacker activado. Ya te sabías el código, ¿no?',
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
    galeriaAria: 'Fotos de DSC HACK 2026',
    /**
     * Llamada secundaria de la portada. Hay dos porque la sección a la que baja depende
     * de lo que la hoja tenga publicado: si los niveles todavía están en `mostrable=NO`,
     * esa sección no existe en el documento y el enlace no llevaría a ninguna parte.
     */
    verNiveles: 'Ver formas de colaborar',
    verOferta: 'Ver qué ofrecemos',
    /**
     * Destino preferente del botón secundario: la presentación de Canva con el detalle
     * de niveles y beneficios. Gana a las dos anclas de arriba cuando la hoja trae
     * `canva.url`, porque lleva a la versión completa de lo mismo.
     *
     * La etiqueta no dice «Canva» ni «presentación» a propósito: si mañana la pieza pasa
     * a ser un PDF, el texto sigue siendo cierto y no hay que desplegar para corregirlo.
     */
    verPropuesta: 'Ver la propuesta completa',
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
    /** Texto alternativo de Bugle en el bloque morado del cierre de `/sponsors`. */
    bugleAlt: 'Bugle, la mascota, señalando hacia el botón para escribirnos.',
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
  title: 'Colabora con Hack with DSC — DSC PUCP',
  description:
    'Conoce los resultados de Hack with DSC 2026 y conversemos sobre patrocinio, sede, ' +
    'mentoría o actividades conjuntas con la comunidad tecnológica estudiantil de DSC PUCP.',
  ogAlt: 'Hack with DSC — resultados de 2026 y formas de colaborar',
} as const

/**
 * Metadatos de `/agenda`. Estáticos por el mismo motivo que los de `/sponsors`, y acá
 * pesa todavía más: el contenido de esta página cambia cada semana desde Google Sheets, y
 * unas previsualizaciones que fueran con él dejarían circulando por WhatsApp enlaces que
 * anuncian un taller que ya pasó.
 *
 * La descripción NO nombra eventos concretos por la misma razón.
 */
export const seoAgenda = {
  title: 'Agenda — Hack with DSC',
  description:
    'Todos los talleres, ponencias y hackathons de Hack with DSC, el programa del ' +
    'Developer Student Club PUCP. Fechas, de qué va cada uno y dónde inscribirte.',
  ogAlt: 'Hack with DSC — agenda de talleres, ponencias y hackathons',
} as const

// ═════════════════════════════════════════════════════════════════════════════════
// Datos de la sección "Qué es Hack with DSC"
// ═════════════════════════════════════════════════════════════════════════════════

/**
 * Los tres formatos del programa. Salen de la pieza gráfica oficial (la 2 de
 * referencias/public_1/): de ahí vienen el título y el `lema`. La `descripcion` es la
 * versión de la web, reescrita con la voz del sitio.
 *
 * `icon` es el nombre de un icono de components/brand/icons.tsx.
 * `color` es un token de marca; el mapa de clases está en el componente que lo usa.
 */
export const formatos = [
  {
    id: 'talleres',
    icon: 'chevrons',
    titulo: 'Talleres',
    /** La frase corta de la pieza 2. Va como antetítulo. */
    lema: 'Aprende haciendo',
    descripcion: 'Laptop abierta desde el minuto uno, con alguien al lado cuando algo se rompe.',
    color: 'blue',
  },
  {
    id: 'ponencias',
    icon: 'star',
    titulo: 'Ponencias',
    lema: 'Conecta con expertos',
    descripcion: 'Gente que ya lo hizo en la industria, contando lo que no viene en el sílabo.',
    color: 'purple',
  },
  {
    id: 'hackathons',
    icon: 'bolt',
    titulo: 'Hackathons',
    lema: 'Compite en equipo',
    descripcion:
      'Un problema, un equipo y el reloj en contra. Al final se presenta algo que corre, ' +
      'no un PPT.',
    color: 'red',
  },
] as const

/**
 * Los pilares estratégicos del programa, como "reglas de la casa". Salen de
 * docs/esencia.md: `nombre` es el nombre oficial del pilar (va chico, como etiqueta) y
 * `titulo` es cómo lo diría alguien del equipo en el grupo. El fondo no cambia.
 *
 * `color` es la variante de sticker (`sticker-<color>` en globals.css). El mapa de
 * clases está en el componente, por lo mismo que en `formatos`.
 */
export const pilares = [
  {
    nombre: 'Aplicabilidad real',
    titulo: 'Si solo corre en tu máquina, no cuenta.',
    descripcion:
      'Lo que construyes acá se despliega y tiene un link que puedes mandar. Del localhost ' +
      'al link, que es justo lo que te van a pedir cuando busques chamba.',
    color: 'claro',
  },
  {
    nombre: 'Adopción técnica y uso de IA',
    titulo: 'Usa IA. Entiende lo que aceptas.',
    descripcion:
      'Usamos IA generativa para avanzar más rápido, en serio y sin miedo. Lo que no se ' +
      'negocia son los fundamentos: tienes que poder explicar cada línea que le aceptaste.',
    color: 'verde',
  },
  {
    nombre: 'Comunidad y networking',
    titulo: 'Llegas por el taller, te quedas por la gente.',
    descripcion:
      'Estudiantes, mentores, docentes y aliados de la industria en el mismo sitio. Acá ' +
      'conoces a tu próximo equipo de hackathon y a gente que ya está donde quieres llegar.',
    color: 'morado',
  },
  {
    nombre: 'Excelencia y pensamiento crítico',
    titulo: '“Funciona” no basta.',
    descripcion:
      'Cada decisión técnica tiene que tener un porqué que puedas defender frente a un ' +
      'jurado, un mentor o tu yo de dentro de seis meses.',
    color: 'azul',
  },
] as const

/** Palabras de la cinta que se desplaza al pie de la portada. */
export const cintaPalabras = [
  'Talleres',
  'Ponencias',
  'Hackathons',
  'Inteligencia Artificial',
  'Arquitectura de software',
  'Del localhost al link',
  'Comunidad',
  'Mentoría',
] as const

export type Formato = (typeof formatos)[number]
export type Pilar = (typeof pilares)[number]
export type BrandColor = Formato['color']
export type ColorDeSticker = Pilar['color']


// Resultados y medios públicos del cierre 2026. Las fuentes privadas no se importan.
export const resultadosPrograma = [
  { valor: '15', etiqueta: 'actividades en 2026' },
  { valor: '579', etiqueta: 'personas con inscripción aprobada' },
  { valor: '803', etiqueta: 'inscripciones aprobadas' },
] as const

export const seoDscHack = {
  title: 'DSC HACK 2026 — proyectos y comunidad | Hack with DSC',
  description: 'Diez equipos entregaron sus proyectos en el cierre de Hack with DSC 2026. Conoce las propuestas, sus integrantes, los reconocimientos y las fotos de la final en NTT DATA.',
  ogAlt: 'DSC HACK 2026: proyectos, reconocimientos y comunidad en el cierre de Hack with DSC',
  ogTitulo: 'DSC HACK',
  ogEdicion: '2026',
  ogResumen: '10 equipos. Código y comunidad.',
  ogImagen: '/og-dsc-hack-2026.jpg',
} as const

const fotosDscHack: FotoRecap[] = [
  {
    tipo: 'foto',
    src: '/dsc-hack/cierre-comunidad.webp',
    alt: 'Foto de grupo del cierre de DSC HACK, con la bandera de DSC PUCP y el reconocimiento al primer puesto.',
    width: 1800,
    height: 1350,
    encuadre: '50% 65%',
  },
  {
    tipo: 'foto',
    src: '/dsc-hack/sala-final.webp',
    alt: 'Participantes con sus laptops frente a la pantalla de Hack with DSC en la sede de NTT DATA.',
    width: 1400,
    height: 1050,
    encuadre: '50% 58%',
  },
  {
    tipo: 'foto',
    src: '/dsc-hack/presentacion-prototipo.webp',
    alt: 'Presentación de un prototipo educativo ante el jurado durante la final.',
    width: 1400,
    height: 1050,
    encuadre: '50% 55%',
  },
  {
    tipo: 'foto',
    src: '/dsc-hack/jurado.webp',
    alt: 'Jurado siguiendo las presentaciones con sus laptops durante DSC HACK.',
    width: 1050,
    height: 1400,
    encuadre: '50% 60%',
  },
  {
    tipo: 'foto',
    src: '/dsc-hack/premiacion.webp',
    alt: 'Entrega del reconocimiento al primer puesto de DSC HACK.',
    width: 1400,
    height: 1050,
    encuadre: '50% 50%',
  },
  {
    tipo: 'foto',
    src: '/dsc-hack/bandera-comunidad.webp',
    alt: 'Tres personas sostienen la bandera de DSC PUCP al cierre del evento.',
    width: 1400,
    height: 1050,
    encuadre: '50% 50%',
  },
  {
    tipo: 'foto',
    src: '/dsc-hack/equipo-organizador.webp',
    alt: 'Integrantes del staff de DSC HACK muestran sus credenciales al terminar la jornada.',
    width: 1400,
    height: 1050,
    encuadre: '50% 45%',
  },
  {
    tipo: 'foto',
    src: '/dsc-hack/defensa-proyecto.webp',
    alt: 'Un equipo responde preguntas junto a la presentación de su proyecto durante la final.',
    width: 1050,
    height: 1400,
    encuadre: '50% 65%',
  },
  {
    tipo: 'foto',
    src: '/dsc-hack/stickers.webp',
    alt: 'Stickers de programación y tecnología sobre una laptop durante DSC HACK.',
    width: 1050,
    height: 788,
    encuadre: '50% 50%',
  },
]

export const organizacion = {
  ruta: '/organizacion',
  foto: fotosDscHack[6],
} as const

export const recapDscHack: {
  fotoPortada: FotoRecap
  fotos: FotoRecap[]
  proyectos: ProyectoRecap[]
  cifras: { valor: string; etiqueta: string }[]
} = {
  fotoPortada: fotosDscHack[0],
  fotos: fotosDscHack.slice(1),
  cifras: [
    { valor: '10', etiqueta: 'equipos entregaron' },
    { valor: '39', etiqueta: 'integrantes en esos equipos' },
    { valor: '3', etiqueta: 'reconocimientos' },
  ],
  proyectos: [
    {
      id: 'cuyriosos',
      nombre: 'Cuyriosos',
      equipo: 'Javalimos',
      descripcion: 'Convierte materiales de clase en minijuegos para practicar lo aprendido. Los docentes pueden cargar sus contenidos y los estudiantes recorrer retos por curso. Una propuesta para llevar el juego al aula universitaria.',
      premio: 'primero',
      integrantes: [
        {
          nombre: 'Juan Diego Padilla Vigo',
          linkedin: 'https://www.linkedin.com/in/jdpadillavigo/',
        },
        {
          nombre: 'Luis Angelo Arce Cabanillas',
          linkedin: 'https://www.linkedin.com/in/luis-arce-cabanillas-998885296/',
        },
        {
          nombre: 'Sebastian Rodrigo Huerta Felipa',
          linkedin: 'https://www.linkedin.com/in/sebastian-rodrigo-huerta-felipa-9950942b4/',
        },
        {
          nombre: 'William He Wang',
          linkedin: 'https://www.linkedin.com/in/william-he-wang-4684b42b3/',
        },
      ],
      enlaces: [
        {
          tipo: 'demo',
          url: 'https://dsc-hack-beige.vercel.app/demo',
        },
        {
          tipo: 'presentacion',
          url: 'https://docs.google.com/presentation/d/1cHmJb483jH8XuNgnGjkCABSkhjPfJAsJ/edit',
        },
      ],
    },
    {
      id: 'skillproof',
      nombre: 'SkillProof',
      equipo: 'Assemblers',
      descripcion: 'Propone demostrar habilidades con desafíos técnicos, entregables y criterios de evaluación. Las evidencias se reúnen en un pasaporte compartible para que estudiantes que buscan su primera oportunidad puedan mostrar lo que saben hacer.',
      premio: 'segundo',
      integrantes: [
        {
          nombre: 'Mayerli Fátima Lozano Mendoza',
          linkedin: 'https://www.linkedin.com/in/mayerly-fatima-l-8a6750302/',
        },
        {
          nombre: 'Patrick Alexander Limaylla Torraka',
          linkedin: 'https://www.linkedin.com/in/patrick-l-b51470406/',
        },
        {
          nombre: 'Sebastian Jhoe Noa Castro',
          linkedin: 'https://www.linkedin.com/in/jhoe-noa-castro-8b4584335/',
        },
        {
          nombre: 'Nicole Beatriz Alessandra Chang Gonzales',
          linkedin: 'https://www.linkedin.com/in/nicolechangg/',
        },
      ],
      enlaces: [
        {
          tipo: 'demo',
          url: 'https://skillproof-beta.vercel.app/',
        },
        {
          tipo: 'repositorio',
          url: 'https://github.com/jnoa-dev/skillproof',
        },
      ],
    },
    {
      id: 'cognicheck',
      nombre: 'CogniCheck',
      equipo: 'Menu Criollo',
      descripcion: 'Combina un tutor socrático con evaluaciones antes y después de la práctica. El estudiante recibe preguntas y pistas; luego resuelve sin IA para contrastar qué logró comprender y qué necesita reforzar.',
      premio: 'chaotic-good',
      integrantes: [
        {
          nombre: 'Amira Paola Rodriguez Almora',
          linkedin: 'https://www.linkedin.com/in/amirarodriguez/',
        },
        {
          nombre: 'Fernando Jaime Ramírez La Torre',
          linkedin: 'https://www.linkedin.com/in/fernandoramcsec/',
        },
        {
          nombre: 'Frank Daniel Chuctaya Quispe',
          linkedin: 'https://www.linkedin.com/in/frank-chuctaya/',
        },
        {
          nombre: 'Lincoln Haziel Chagua Bustos',
          linkedin: 'https://www.linkedin.com/in/lincoln-haziel-chagua-bustos-87b851302/',
        },
      ],
      enlaces: [
        {
          tipo: 'repositorio',
          url: 'https://github.com/linkold/confidence-to-curiosity',
        },
        {
          tipo: 'presentacion',
          url: 'https://www.canva.com/design/DAHZm9RSTD4/q8ClCugspE_HXi7HyYwg8A/view',
        },
      ],
    },
    {
      id: 'aula-evidente',
      nombre: 'Aula Evidente',
      equipo: 'npm-devs',
      descripcion: 'Propone convertir la grabación de una clase en evidencias que el docente pueda revisar: citas con minuto, preguntas e interacciones organizadas según rúbricas de observación. Su motor Espejo combina video y audio para apoyar la reflexión sobre la práctica docente.',
      premio: null,
      integrantes: [
        {
          nombre: 'Carlos Vasquez Morales',
          linkedin: 'https://www.linkedin.com/in/carlos-vasquez-morales-bab701315/',
        },
        {
          nombre: 'Kevin Eduardo Pinto Acevedo',
          linkedin: 'https://www.linkedin.com/in/kevin-eduardo-pinto-acevedo-19301a306/',
        },
        {
          nombre: 'Liz Elena Estefania Pineda Feijoo',
          linkedin: 'https://www.linkedin.com/in/liz-pineda-334a28329/',
        },
        {
          nombre: 'Lizbeth Santiago Ayala',
          linkedin: 'https://www.linkedin.com/in/lizbeth-santiago-ayala-7922643a6/',
        },
      ],
      enlaces: [
        {
          tipo: 'demo',
          url: 'https://aula-evidente.vercel.app/',
        },
        {
          tipo: 'repositorio',
          url: 'https://github.com/CaVassM/espejo',
        },
        {
          tipo: 'presentacion',
          url: 'https://www.canva.com/design/DAHZmObsato/3PqFYnl0mS482g-mnxIucQ/view',
        },
      ],
    },
    {
      id: 'calibra',
      nombre: 'CALIBRA',
      equipo: 'Los testigos de Claude',
      descripcion: 'Acompaña la preparación para el examen de admisión de San Marcos con práctica y un tutor conversacional. Busca que el estudiante explique su razonamiento, revise errores y compruebe su comprensión al resolver nuevas preguntas.',
      premio: null,
      integrantes: [
        {
          nombre: 'Axel Smith Mestanza Cabrera',
          linkedin: 'https://www.linkedin.com/in/axelmestanza/',
        },
        {
          nombre: 'Franco Shigueo Mendoza Higa',
          linkedin: null,
        },
        {
          nombre: 'Jairo Jhosimar Huaman Choque',
          linkedin: 'https://www.linkedin.com/in/jairo-jhosimar-huaman-choque-5b2650385/',
        },
        {
          nombre: 'Matias Javier Del Castillo Mendoza',
          linkedin: 'https://www.linkedin.com/in/bktmatjv/',
        },
      ],
      enlaces: [
        {
          tipo: 'demo',
          url: 'https://calibra-admission-nine.vercel.app/aprender',
        },
        {
          tipo: 'repositorio',
          url: 'https://github.com/bktmatjv/Calibra-Admision',
        },
      ],
    },
    {
      id: 'chaski',
      nombre: 'Chaski',
      equipo: 'G - LLM',
      descripcion: 'Invierte los roles: el estudiante le enseña matemática a un mensajero de IA. Chaski resuelve según lo que entendió y puede equivocarse; quien aprende debe detectar el error y corregirlo. El prototipo incluye una vista para docentes.',
      premio: null,
      integrantes: [
        {
          nombre: 'Geraldin Nuñez Vasquez',
          linkedin: 'https://www.linkedin.com/in/geraldin-nunez-vasquez/',
        },
        {
          nombre: 'Luis Alberto Leiva Grajales',
          linkedin: 'https://www.linkedin.com/in/leivadev/',
        },
        {
          nombre: 'Luis Angel Santiago Ayala',
          linkedin: 'https://www.linkedin.com/in/luis-santiago-10a02g07m/',
        },
        {
          nombre: 'Miguel Angel Luyo Daga',
          linkedin: 'https://www.linkedin.com/in/miguelluyodaga/',
        },
      ],
      enlaces: [
        {
          tipo: 'demo',
          url: 'https://chaski.pages.dev/',
        },
        {
          tipo: 'repositorio',
          url: 'https://github.com/Mian-droid/chaski',
        },
        {
          tipo: 'presentacion',
          url: 'https://drive.google.com/file/d/1N4xkRRW-_DKVKseXTgJeVaY8V2V9yhlP/view',
        },
      ],
    },
    {
      id: 'defiendelo-digpro',
      nombre: 'Defiéndelo',
      equipo: 'Digpro',
      descripcion: 'El estudiante le enseña su propio trabajo a Carlos, un compañero de IA que plantea dudas y comete errores a propósito. La conversación busca que explique sus decisiones con sus palabras y entrega al docente un mapa visual de lo que pudo sustentar.',
      premio: null,
      integrantes: [
        {
          nombre: 'Andre Jeremie Céspedes Cubas',
          linkedin: 'https://www.linkedin.com/in/andré-céspedes-1033692b6/',
        },
        {
          nombre: 'Javier Armando Bonilla Flores',
          linkedin: 'https://www.linkedin.com/in/bonijaviere/',
        },
        {
          nombre: 'William Roberto Nuñez Huamani',
          linkedin: 'https://www.linkedin.com/in/williamrnunez/',
        },
        {
          nombre: 'Yoe Sebastian Castro Gomez',
          linkedin: 'https://www.linkedin.com/in/yoe-sebastian-castro-gomez-9540423a6/',
        },
      ],
      enlaces: [
        {
          tipo: 'demo',
          url: 'https://defiendelo-six.vercel.app/',
        },
        {
          tipo: 'repositorio',
          url: 'https://github.com/YoeCastroGomez/Defiendelo',
        },
        {
          tipo: 'presentacion',
          url: 'https://www.canva.com/design/DAHZm0H8U4o/P9Fts9JvnacfMhl8BTOwBg/view',
        },
      ],
    },
    {
      id: 'defiendelo-phi',
      nombre: 'Defiéndelo',
      equipo: 'Phi',
      descripcion: 'Ayuda al docente a rediseñar tareas para un contexto en el que los alumnos pueden usar IA. La entrega se acompaña de preguntas sobre las decisiones del estudiante, una defensa y evidencias para que el docente decida la evaluación.',
      premio: null,
      integrantes: [
        {
          nombre: 'Divano Estefano Perez Nina',
          linkedin: 'https://www.linkedin.com/in/divano-estefano-perez-nina/',
        },
        {
          nombre: 'Jack Johann Mendoza Muñoz',
          linkedin: 'https://www.linkedin.com/in/jack-mendoza-mu%C3%B1oz-813035243/',
        },
        {
          nombre: 'Jhamil Brijan Peña Cardenas',
          linkedin: 'https://www.linkedin.com/in/jhamilpcardenas/',
        },
        {
          nombre: 'Shirley Franshesca Huaringa Alvan',
          linkedin: 'https://www.linkedin.com/in/shirley-h-4316a532b/',
        },
      ],
      enlaces: [
        {
          tipo: 'demo',
          url: 'https://defiendelo.vercel.app/',
        },
        {
          tipo: 'repositorio',
          url: 'https://github.com/Jaed69/defiendelo',
        },
        {
          tipo: 'presentacion',
          url: 'https://docs.google.com/presentation/d/1DgL5T4Dwu2TDAz6p-e07r0oFC3XJYtrJ/edit',
        },
      ],
    },
    {
      id: 'escalon-cero',
      nombre: 'Escalón Cero',
      equipo: 'Anomalía04',
      descripcion: 'Un espacio para practicar con casos de trabajo junior antes del primer empleo. El estudiante sigue una ruta, desarrolla un proyecto y recibe retroalimentación sobre su entrega; las evidencias conectan la práctica con oportunidades de postulación.',
      premio: null,
      integrantes: [
        {
          nombre: 'Emyr Ioseff Vasquez Riofrio',
          linkedin: 'https://www.linkedin.com/in/emyr-vasquez-riofrio-37861835a/',
        },
        {
          nombre: 'Gustavo Marcelo Monge Tovar',
          linkedin: 'https://www.linkedin.com/in/marcelo-monge-tovar/',
        },
        {
          nombre: 'Jhon Mejia Quispe',
          linkedin: 'https://www.linkedin.com/in/jhon-mejia-39a080311/',
        },
      ],
      enlaces: [
        {
          tipo: 'demo',
          url: 'https://escalon-cero-seven.vercel.app/',
        },
        {
          tipo: 'repositorio',
          url: 'https://github.com/EmyrVasquez/escalon-cero',
        },
      ],
    },
    {
      id: 'teachforge',
      nombre: 'TeachForge',
      equipo: 'Team MagIA',
      descripcion: 'Recoge experiencias de docentes con trayectoria y las convierte en casos que ellos mismos revisan y validan. Quienes se están formando pueden practicar con alumnos simulados y recibir retroalimentación sobre sus decisiones pedagógicas.',
      premio: null,
      integrantes: [
        {
          nombre: 'Jorge Adriano Navarro Guevara',
          linkedin: 'https://www.linkedin.com/in/jorge-adriano-navarro-guevara/',
        },
        {
          nombre: 'Nick Sebastián Bazán Camavilca',
          linkedin: 'https://www.linkedin.com/in/nick-bazán-camavilca-13a954412/',
        },
        {
          nombre: 'Santiago Alfredo Chumpitaz Torres',
          linkedin: 'https://www.linkedin.com/in/santiagochumpitaz/',
        },
        {
          nombre: 'Yamile Del Aguila Valera',
          linkedin: 'https://www.linkedin.com/in/yamile-del-aguila-valera-aa57a9402/',
        },
      ],
      enlaces: [
        {
          tipo: 'demo',
          url: 'https://teachforge-silk.vercel.app/',
        },
        {
          tipo: 'presentacion',
          url: 'https://www.canva.com/design/DAHZnc8LDus/SvTNvj6Jh5r2zZKTIl0haw/view',
        },
      ],
    },
  ],
}

/** Patrocinio comparte las mismas fotos curadas; no hay una segunda lista editorial. */
export const galeriaSponsors = [fotosDscHack[1], fotosDscHack[2], fotosDscHack[0]]
