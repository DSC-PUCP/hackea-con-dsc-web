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
    title: 'Hack with DSC, menos diapositivas, más código que corre',
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
  /**
   * El grupo de la comunidad. Es de **Hack with DSC**: es a donde apuntan todos los CTA
   * del sitio y donde se anuncian los eventos antes que en ninguna parte.
   */
  whatsapp: 'https://chat.whatsapp.com/LTtmzZ6LkEpFYX6w6OFhrJ?s=cl&p=a&mlu=4&ilr=4',
  instagram: 'https://www.instagram.com/dsc.pucp/',  
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
 * permite que quepa en un teléfono sin desplegable. Cuando mezclaba anclas y rutas estaba
 * oculto por debajo de 640 px, y `/sponsors` era inalcanzable desde un móvil.
 *
 * ── El presupuesto de ancho, que ya está gastado ────────────────────────────────────
 * Hoy son DOS entradas, y a 390 px la barra va justa: logotipo + Agenda + Patrocinio + el
 * botón de WhatsApp en modo icono suman algo más de lo que hay. Es una decisión tomada,
 * no un descuido: **se prefiere que el logotipo se recorte** —tiene `min-w-0 truncate`
 * justo para eso, ver components/site-header.tsx— antes que esconder un destino y volver
 * a dejar una página sin camino desde el móvil. El recorte es cosmético; un destino
 * inalcanzable no.
 *
 * Una TERCERA entrada ya no entra, y no se arregla apretando espacios: toca desplegable,
 * con todo lo que eso trae (primer componente de cliente con estado, foco, Escape).
 *
 * Aun así admite los dos tipos de destino, por si algún día hace falta:
 *
 *   · anclas de la portada — `'#que-es'`, SIEMPRE sin la barra inicial. El header le pone
 *     el `/` delante solo cuando hace falta (o sea, cuando no estás en la portada);
 *   · rutas del sitio — `'/sponsors'`, tal cual.
 *
 * La lógica está en `resolverDestino`, dentro de components/site-header.tsx.
 */
export const navegacion = [
  // Primero la agenda: es lo que viene a buscar un estudiante, que es casi todo el
  // tráfico. Patrocinio lo busca una empresa, y una empresa llega por un enlace directo
  // que le mandó alguien del equipo, no explorando el menú.
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
  { href: '/agenda', label: 'Agenda' },
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
     * Cierre de la sección: va en el bloque morado, en letra de póster. `destacado` se
     * marca con el rotulador verde. Reescribe la frase de la pieza 2 ("Una comunidad que
     * crece contigo") para que desemboque en el grupo, que es a donde lleva el botón.
     */
    cierre: {
      antes: 'Un programa.',
      destacado: 'Muchos eventos.',
      despues: 'Un solo grupo.',
    },
    /** Texto alternativo de Bugle asomándose junto a los formatos. */
    bugleAsomadoAlt: 'Bugle, la mascota, asomándose por el borde con cara de travesura.',
    /** Texto alternativo de Bugle señalando el botón del bloque morado. */
    bugleSenalandoAlt: 'Bugle, la mascota, señalando hacia el botón del grupo de WhatsApp.',
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
    verEnLuma: 'Ver en Luma',
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
      titulo: 'La agenda se está cocinando',
      descripcion:
        'Todavía no hay eventos publicados. Los anunciamos primero en el grupo de la ' +
        'comunidad, así que entra ahí y te enteras apenas se confirmen.',
    },
  },

  cta: {
    titulo: 'Las fechas caen primero en el grupo.',
    descripcion:
      'Cada taller, ponencia y hackathon se anuncia en el WhatsApp de la comunidad antes que ' +
      'en cualquier otro lado, incluida esta web. Entra para enterarte primero.',
    boton: 'Entrar al grupo de WhatsApp',
    nota: 'Abierto a toda la comunidad universitaria',
  },

  footer: {
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
    'Los talleres, ponencias y hackathons se anuncian primero en el grupo:',
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
    galeriaAria: 'Fotos de ediciones anteriores',
    /**
     * Llamada secundaria de la portada. Hay dos porque la sección a la que baja depende
     * de lo que la hoja tenga publicado: si los niveles todavía están en `mostrable=NO`,
     * esa sección no existe en el documento y el enlace no llevaría a ninguna parte.
     */
    verNiveles: 'Ver los niveles de alianza',
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
  title: 'Patrocina Hack with DSC — DSC PUCP',
  description:
    'Programa de talleres, ponencias y hackathons del Developer Student Club PUCP. ' +
    'Formatos de alianza para empresas que quieren estar donde los estudiantes de ' +
    'tecnología construyen software de verdad.',
  ogAlt: 'Hack with DSC — información de patrocinio para empresas',
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
