# Arquitectura y decisiones técnicas

Por qué el proyecto está hecho así. Si vas a tocar cualquiera de las dos lecturas de
Google Sheets —`/sponsors` o `/agenda`—, la §3 es tu documento.

---

## 1. Estado actual

**Dos páginas**, las dos pre-generadas:

| Ruta | Qué es | De dónde sale su contenido |
| --- | --- | --- |
| `/` | La portada: `Hero` + "Qué es Hack with DSC" | del repo (`lib/site-config.ts`) |
| `/sponsors` | La página de patrocinio, que sustituye al deck de ventas | de Google Sheets, con respaldo en el repo |

```
Navegador
    │
    ├── HTML pre-generado (se construye al hacer el build, no por visita)
    ├── CSS de Tailwind v4
    ├── ~3 KB de JS propio (parallax + aparición al scroll + header)
    └── imágenes WebP de public/brand/
```

No hay base de datos, ni sesiones, ni estado en el servidor. `/sponsors` se regenera cada
hora con lo que diga la hoja (§3), pero se sirve igual de pre-generada: nadie espera
nunca a Google.

### 1.0 Las imágenes de `public/` y el subdirectorio

Detalle contraintuitivo, comprobado sobre el HTML compilado: **Next aplica el `basePath`
a sus propios assets (`/_next/...`) y a `next/link`, pero NO a los archivos de
`public/`.** Con `images.unoptimized: true`, `next/image` deja el `src` tal como se
escribió.

Consecuencia con `NEXT_PUBLIC_SITE_URL=https://dsc.inf.pucp.edu.pe/hack-with-dsc`: el CSS
salía como `/hack-with-dsc/_next/...` pero el logotipo como `/brand/logo…webp`, o sea
pidiéndoselo a la raíz del dominio compartido, donde nginx ni siquiera enruta a esta app.
La web se vería con estilos y sin imágenes.

Por eso existe `assetPublico()` en `lib/site-url.ts`. **Toda ruta de imagen del repo pasa
por ahí**, incluida la textura de grano, que se le entrega al CSS como la variable
`--url-grano` desde `app/layout.tsx`. Las URL absolutas (los logos de aliados que vengan
de la hoja) se devuelven intactas.

### 1.1 Dos destinos de despliegue

El proyecto se despliega en **dos sitios distintos**, y conviene tenerlo claro porque
condiciona un par de decisiones de configuración:

| Rama | Destino | Estado | Para qué |
| --- | --- | --- | --- |
| `main` | **Vercel** | activo hoy | Despliegue automático a cada push. Es el que ve la gente mientras no haya dominio propio, y da previsualizaciones por Pull Request. |
| `prod` | **MV Ubuntu** (Docker + nginx) | planificado | El dominio definitivo de la universidad, lanzado con una GitHub Action. Toda la guía está en `docs/despliegue.md`. |

Consecuencia práctica en el código: **`output: 'standalone'` NO está activo por defecto.**
Docker lo necesita (empaqueta la app sin `node_modules`), pero Vercel no lo usa y lo
ignora. Así que se activa solo cuando se pide de forma explícita, con
`NEXT_OUTPUT=standalone`, y el único que lo pide es el Dockerfile. De ese modo ningún
destino arrastra configuración del otro.

Al crear la rama `prod` y su Action, lo único que hace falta es construir con esa variable
puesta — el `Dockerfile` ya la trae.

### 1.2 El sitio tiene que poder vivir en un subdirectorio

Hoy está en la raíz de un dominio (`https://hack-with-dsc.vercel.app/`). El plan a futuro es
moverlo a un **subdirectorio** del dominio oficial de DSC:
`https://dsc.inf.pucp.edu.pe/hack-with-dsc`.

Eso está preparado, y con **una sola variable**: si `NEXT_PUBLIC_SITE_URL` incluye una ruta,
`next.config.mjs` deduce el `basePath` de Next a partir de ella.

Por qué derivarlo en vez de tener su propia variable: si hubiera un `BASE_PATH` aparte,
serían dos fuentes para el mismo dato, y desincronizarlas produce un fallo desagradable de
diagnosticar — metadatos apuntando a un sitio y assets a otro, con la web cargando sin
estilos. Con una sola no hay nada que sincronizar. Es el mismo principio de una sola fuente
de verdad que rige los colores y los textos.

Consecuencia para quien escriba código: **nunca escribas el dominio a mano.** Usa
`urlDelSitio` de `lib/site-url.ts` para cualquier URL absoluta (canonical, Open Graph,
sitemap). Un dominio literal sobrevive hasta la mudanza y no más.

Los pasos de nginx y la advertencia sobre `robots.txt` en subdirectorios están en
`docs/despliegue.md` §4 y en la cabecera de `deploy/nginx/hackwithdsc.conf`.

### Decisiones y por qué

**Next.js 16 con App Router.** Es lo que ya usaba el proyecto. Para una landing es más de
lo necesario, pero da render en servidor (bueno para SEO y para compartir el link),
optimización automática, y —lo que de verdad pesa— la lectura de Google Sheets con caché
es algo que Next resuelve de forma nativa, sin traer ni una pieza de infraestructura más.

**Tailwind CSS v4, con los tokens en CSS.** En la v4 el sistema de diseño se declara en
CSS (`@theme`, `@utility`) en vez de en un archivo de configuración de JavaScript. Eso
encaja con el requisito central del proyecto: **los colores existen en un solo lugar**, el
bloque `:root` de `globals.css`, y todo lo demás se deriva con `color-mix()`. Cambiar los
6 tokens de marca repinta el sitio entero.

**Solo tres componentes de cliente.** `site-header`, `pointer-parallax` y `scroll-reveal`.
Los dos últimos no renderizan nada: publican estado (posición del cursor en variables CSS;
un atributo `data-visible`) y el CSS decide qué se mueve. Así toda la portada, con sus
animaciones, sigue siendo un componente de servidor. Es el patrón que hay que mantener.

**Imágenes pre-optimizadas en vez del optimizador de Next.**
`scripts/prepare-assets.mjs` (`pnpm assets`) genera los WebP y la imagen de Open Graph una
vez, y el resultado se comitea. Ventaja concreta: el contenedor de producción no necesita
`sharp`, que es una dependencia nativa y una de las que más problemas dan al desplegar.
Menos piezas que se puedan romper en la MV.

**El logotipo se sirve como imagen, no como texto.** Las tipografías de marca (Agrandir
Grand, CY Grotesk STD) son comerciales y no están en el repo. Servir el logotipo como
imagen garantiza que el wordmark salga exacto sin depender de la licencia. El texto real
va en un `<span class="sr-only">` para lectores de pantalla y para el SEO.

**Docker con `output: standalone`.** Next empaqueta la app con solo las dependencias que
de verdad usa. La imagen baja de ~1 GB a ~314 MB, y el servidor no necesita tener Node ni
pnpm instalados: solo Docker.

**Dark-only.** No es pereza: la identidad visual son neones sobre fondo tinta y el arte de
Bugle está iluminado para oscuro. En un tema claro habría que recalibrar toda la paleta
para un resultado peor. Un solo set de tokens, sin `prefers-color-scheme`.

### Por qué los eventos no se escriben en el repo

Decisión de producto, no limitación técnica. El programa se planifica en una hoja de
cálculo que se mueve cada semana: fechas tentativas, lugares por confirmar, ponentes sin
cerrar. Publicar eso y luego cambiarlo quema credibilidad, y mantenerlo a mano en el
código garantiza que se desincronice.

Así que la web solo dice de eventos lo que puede decir leyendo la hoja. Nada de fechas
cableadas, y **nada de contenido de reserva** para la agenda: si la hoja no se puede leer,
la lista no se pinta. Una fecha vieja es peor que ninguna fecha, y el canal de anuncios de
respaldo sigue siendo el grupo de WhatsApp, que es a donde apuntan todos los CTA.

Ojo con la diferencia entre sección y página, porque cambia lo que hay que construir: una
sección que se queda sin datos devuelve `null` y desaparece, y con eso basta. **Una ruta
no puede desaparecer** — `/agenda` sigue en el menú y en el sitemap aunque no haya ni un
evento, así que necesita estado vacío propio, y ese estado tiene que ofrecer una salida en
vez de dejar a quien llegó en una página muerta.

Lo que sí es incierto y **no se publica** es el lugar: la hoja lo guarda como referencia
interna («Pabellón V o A o donde sea») porque eso se decide tarde y se actualiza mejor en
la propia página de Luma del evento. La web da nombre, tipo, cuándo, de qué va, quién
participa y el botón para inscribirse.

---

## 2. Estructura de archivos

Ver [`AGENTS.md`](../AGENTS.md) §3 para el mapa completo. En corto:

| Carpeta       | Qué contiene                                              |
| ------------- | --------------------------------------------------------- |
| `app/`        | rutas, CSS global, metadatos                              |
| `components/` | lo visual                                                 |
| `lib/`        | contenido y datos, nada visual                            |
| `scripts/`    | utilidades que se corren a mano                           |
| `deploy/`     | configuración del servidor                                |

---

## 3. Contenido desde Google Sheets

### 3.0 La capa compartida (hay que reusarla, no duplicarla)

La página de patrocinio trajo la primera integración con Sheets, y se diseñó **para ser
compartida**. La agenda de eventos la reusa entera: en `lib/sheets/` no hay una sola línea
específica de ninguna de las dos.

| Archivo | Qué hace | ¿Compartido? |
| --- | --- | --- |
| `lib/sheets/cliente.ts` | Autenticación con la cuenta de servicio y `batchGet` a la API REST | **Sí** |
| `lib/sheets/filas.ts` | Matriz cruda → filas con nombre; `mostrable`, `orden`, tildes | **Sí** |
| `app/api/revalidate/route.ts` | Refresco a demanda con secreto y lista blanca `['eventos','sponsors']` | **Sí** |
| `lib/sheets/imagenes.ts` | Enlaces de Drive → imágenes servibles (logos y fotos) | **Sí** |
| `lib/sponsors/*` | Rangos, esquemas, caché y reserva de `/sponsors` | solo sponsors |
| `lib/eventos/*` | Lo mismo para la agenda, más `fechas.ts` | solo eventos |
| `scripts/probar-*.mjs` | Prueban cada lector sin tocar la interfaz | uno por hoja |

Cada hoja escribe solo su capa propia: sus rangos, sus esquemas y su envoltorio de caché
con su etiqueta (`sponsors` o `eventos`, las dos en la lista blanca de la ruta de
revalidación). Si aparece una tercera hoja, va por el mismo camino.

**Dos hojas, no una.** Patrocinio usa `GOOGLE_SHEETS_SPONSORS_ID` y eventos usa
`GOOGLE_SHEETS_EVENTS_ID`. Están separadas para poder dar permiso de edición del material
de sponsors a gente que no debe tocar la agenda. Comparten las credenciales, pero **el
permiso de lectura no se hereda**: hay que invitar al correo de la cuenta de servicio en
cada hoja por separado. Es el paso que más se olvida, y da un 403.

**Cómo se comporta sin credenciales.** `obtenerContenidoSponsors()` comprueba las
credenciales *antes* de entrar en la caché, así que en local no se intenta hablar con
Google, no se cachea un fallo y no se imprime nada. La página se dibuja con
`lib/sponsors/fallback.ts` y la consola queda limpia. Es el estado normal en desarrollo,
no una excepción.

**Lo que decide quién gana.** Las claves de `Textos` se mezclan (hoja sobre repo, clave
por clave); las listas no se mezclan. Si la hoja responde y una pestaña está vacía, esa
sección de la página desaparece entera — es el interruptor editorial funcionando.

### 3.0.1 Las imágenes de la hoja: Drive, un CDN o el repo

Las columnas de imagen (`logo` en `Aliados`, `foto` en `Testimonios`) aceptan tres cosas,
y el lector resuelve las tres:

| Lo que pegas en la celda | Qué hace el lector |
| --- | --- |
| Un enlace de **Google Drive** | Lo traduce a la versión servible (ver abajo) |
| Cualquier otra **URL `https://`** | La usa tal cual, sin tocarla |
| Un **nombre de archivo** (`cgs.svg`) | Lo busca en `public/sponsors/aliados/` |

**Lo de Drive tiene truco, y es la parte que sorprende.** El enlace que Drive da al pulsar
"Compartir" **no es la imagen**: es una página web con visor y botones. Medido sobre el
mismo archivo:

```
https://drive.google.com/file/d/1fq1Jm…/view?usp=drive_link   →  text/html, 74 KB
https://drive.google.com/uc?export=view&id=1fq1Jm…           →  image/png, 39 KB
https://drive.google.com/thumbnail?id=1fq1Jm…&sz=w600        →  image/png, 15 KB
```

Puesto en un `<img>`, el primero no pinta nada. Por eso `lib/sheets/imagenes.ts` extrae el
identificador del archivo y reescribe el enlace a `thumbnail`, que además devuelve la
imagen ya redimensionada. **Se pega el enlace tal como lo da Drive y ya está.**

Dos condiciones y un aviso:

- **El archivo tiene que estar compartido como "cualquier persona con el enlace"**, en
  modo Lector. Si no, no carga.
- **Los endpoints de Drive no están documentados por Google.** Funcionan y llevan años
  funcionando, pero si algún día cambian, la web no se rompe: cada imagen lleva el nombre
  de la empresa como texto alternativo y se degrada a texto.
- **Drive no es un CDN.** Para un puñado de logos va sobrado. Para una galería entera,
  el repo.

**El formato del archivo importa más que dónde esté.** Los logos se pintan directamente
sobre el fondo tinta, sin recuadro claro detrás, así que:

- PNG o SVG **con transparencia** → se ve bien;
- JPEG, o PNG con **fondo blanco sólido** → se ve un rectángulo blanco;
- un logo en tinta oscura → no se lee. Hay que pedir la versión para fondos oscuros.

Eso no se arregla en el CSS: se arregla pidiéndole a la empresa el archivo bueno. Y no
uses miniaturas de resultados de Google Imágenes (`encrypted-tbn0.gstatic.com`): traen
fondo blanco, son de baja resolución y ese enlace puede desaparecer cualquier día.

### 3.0.2 Pendiente de `/sponsors`

- **La versión imprimible (`@media print`)** del §8 del encargo: quedó fuera de la
  primera tanda a propósito. La idea sigue siendo una hoja de estilos, no generar PDF en
  el servidor: ocultar header, pie y CTAs, forzar fondo claro, `break-inside: avoid` en
  las tarjetas de nivel y mostrar el correo de contacto en el pie impreso. Cero
  JavaScript.
- **Fotos de ediciones anteriores**: la galería existe y está vacía. Se llena agregando
  archivos a `public/sponsors/` y entradas a `galeriaSponsors` en `lib/site-config.ts`.

### 3.1 El problema (eventos)

El equipo planifica en una hoja de cálculo (`internals/Eventos | Hack with DSC.xlsx`, con
su equivalente en Google Sheets). Quieren editar ahí y que la web se actualice, sin pedirle
un despliegue a nadie.

Restricciones:

- La hoja tiene columnas internas que **no** se publican (`Observaciones`, correos,
  responsables, links a docs internos).
- Tiene eventos a medio planificar que no deben salir: de ahí la columna **`Mostrable`**,
  que es el interruptor editorial. Se llama exactamente así en las dos hojas, porque
  `lib/sheets/filas.ts` la usa además para localizar la fila de cabecera.
- La web no puede llamar a la API de Google en cada visita: sería lento, frágil, y
  chocaría con las cuotas.

### 3.2 Autenticación: cuenta de servicio, no OAuth de usuario

Aunque el pedido original dijo "OAuth", para este caso lo correcto es una **cuenta de
servicio**:

| | Cuenta de servicio | OAuth de usuario |
| --- | --- | --- |
| Requiere que alguien inicie sesión | No | Sí |
| El token caduca y hay que renovarlo a mano | No | Sí (refresh tokens que expiran) |
| Sobrevive a que la persona deje el club | Sí | **No** |
| Complejidad de implementación | Baja | Alta |

OAuth de usuario tiene sentido cuando la app actúa *en nombre* de quien la visita. Acá la
app lee **una** hoja que es del club: no hay nada que delegar. Con una cuenta de servicio
la web sigue funcionando aunque quien la configuró se gradúe — que en un grupo estudiantil
pasa cada año.

Permiso de **lectura solamente**. La app nunca escribe en la hoja.

#### Cómo se crea, paso a paso

Se hace **una sola vez** y sirve para las dos hojas (patrocinio y eventos). Hazlo con la
cuenta de Google que ya es dueña de las hojas, o con una cuenta del club: el proyecto de
Google Cloud debería sobrevivir a que quien lo creó se gradúe.

**1. Proyecto en Google Cloud**

- Entra a <https://console.cloud.google.com/> con esa cuenta.
- Arriba a la izquierda, en el selector de proyectos → **Nuevo proyecto**.
- Nombre: `hack-with-dsc`. Sin organización está bien si la cuenta es personal.

**2. Habilitar la API de Sheets**

- Menú ☰ → **APIs y servicios** → **Biblioteca**.
- Busca **Google Sheets API** → **Habilitar**.
- No hace falta habilitar Google Drive API: se leen valores de celdas, no archivos.

**3. Crear la cuenta de servicio**

- Menú ☰ → **IAM y administración** → **Cuentas de servicio** → **Crear cuenta de
  servicio**.
- Nombre: `lector-hojas`. El correo se genera solo y queda como
  `lector-hojas@hack-with-dsc-XXXX.iam.gserviceaccount.com`. **Cópialo: es el dato que
  hace falta en el paso 5.**
- En "Otorgar acceso a este proyecto": **déjalo en blanco y continúa**. Los roles de IAM
  gobiernan recursos de Google Cloud, y una hoja de cálculo no lo es — el permiso sobre la
  hoja se da compartiéndola, en el paso 5. Es la confusión más común de este trámite.

**4. Generar la clave**

- Entra a la cuenta de servicio recién creada → pestaña **Claves** → **Agregar clave** →
  **Crear clave nueva** → **JSON** → Crear.
- Se descarga un `.json`. **Es una credencial: no va al repo, no va a WhatsApp, no va a
  Drive compartido.** Si se filtra, se borra la clave desde esa misma pantalla y se crea
  otra.

**5. Compartir CADA hoja con ese correo**

Este es el paso que todo el mundo olvida, y el error que da (`403`) no lo dice.

- Abre la hoja de patrocinio → **Compartir** → pega el correo de la cuenta de servicio →
  rol **Lector** → desmarca "Notificar" → **Enviar**.
- Repite en la hoja de eventos cuando exista. **El permiso no se hereda entre hojas.**

**6. Poner las variables**

Del JSON descargado salen dos campos: `client_email` y `private_key`.

En local, en `.env` (que está en `.gitignore`):

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=lector-hojas@hack-with-dsc-XXXX.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_SPONSORS_ID=1AbC...        # el tramo entre /d/ y /edit de la URL
REVALIDATE_SECRET=                        # openssl rand -hex 32
```

La clave privada va **entre comillas dobles y en una sola línea**, con los `\n` tal como
vienen en el JSON. Esa es la forma canónica y la que Vercel necesita. Si la pegas en
varias líneas el código también lo aguanta (ver §3.5.1, trampa 2), pero no todas las
herramientas que leen un `.env` lo hacen igual: en la duda, una sola línea.

- En **Vercel**: panel del proyecto → Settings → Environment Variables, una por una, y
  redesplegar. Al pegar la clave, que quede en una sola línea con los `\n` literales.
- En la **MV**: en el `.env` del servidor, con permisos `600`.

**7. Comprobar que funciona, antes de mirar la web**

```bash
pnpm probar:sponsors
```

Lee la hoja de verdad e imprime qué filas entraron, cuáles se descartaron y por qué. Si
falla, el mensaje distingue los dos problemas que se confunden siempre: credenciales mal
puestas (falla la autenticación) frente a hoja no compartida (responde `403`, y el
mensaje te recuerda el paso 5).

Sin credenciales, el mismo script acepta un volcado de la hoja en JSON:

```bash
pnpm probar:sponsors internals/volcado.json
```

**8. Si el script funciona pero la web sigue con el contenido de reserva**, no es un
misterio: es la caché, que guardó el intento fallido anterior. `rm -rf .next/cache` y
reconstruir. Ver §3.5.1, trampa 3.

### 3.3 Caché

La estrategia: **regeneración incremental con revalidación por tiempo, más un webhook para
forzarla**.

```
Visita ──▶ ¿hay HTML cacheado y con menos de 10 min?
              │
              ├── sí ──▶ se sirve al instante (0 llamadas a Google)
              │
              └── no ──▶ se sirve el cacheado igual, y en paralelo se
                          regenera con datos frescos para la próxima visita
```

En código:

```ts
// El lector se envuelve en la caché de datos de Next.
const obtenerEventos = unstable_cache(
  leerDesdeSheets,
  ['eventos'],
  { revalidate: 600, tags: ['eventos'] },  // 600 s = 10 min
)
```

Propiedades que importan:

- **Nadie espera nunca a Google.** Si la caché está vencida se sirve la copia vieja y se
  regenera detrás. Una visita nunca se queda colgada por la API.
- **Si Google falla, la web sigue en pie** con los últimos datos buenos. Esto es
  obligatorio: la web no puede caerse porque la API de Sheets tenga un mal día.
- **Cuota**: como máximo 6 llamadas por hora, no una por visita.

Patrocinio usa la misma estrategia con **una hora** (`revalidate: 3600`, etiqueta
`sponsors`), que es lo que pidió el equipo.

#### La ruta de revalidación (ya construida, y compartida)

Para no esperar a que venza:

```
POST /api/revalidate?secret=<REVALIDATE_SECRET>&tag=sponsors
GET  /api/revalidate?secret=<REVALIDATE_SECRET>&tag=sponsors
```

- `tag` se valida contra la lista blanca `['eventos', 'sponsors']`. Otra cosa → **400**.
- Sin `tag`, revalida `eventos` (el comportamiento con el que se diseñó).
- Secreto inválido o ausente → **401**. Sin `REVALIDATE_SECRET` en el servidor → **503**.
- **Responde también a GET a propósito.** La persona que edita la hoja no usa `curl`:
  cuando no vea su cambio va a querer abrir un enlace en el navegador, y un navegador solo
  hace GET. La operación es idempotente y sigue exigiendo el secreto.

Las dos formas de dispararla:

1. **El enlace que se le pasa a quien edita la hoja** (la que más se va a usar). Se arma
   una vez y se guarda en la propia hoja, en una celda:

   ```
   https://hack-with-dsc.vercel.app/api/revalidate?secret=EL_SECRETO&tag=sponsors
   ```

   Ojo con lo obvio: ese enlace **lleva el secreto**, así que solo va donde ya haya
   confianza — la misma hoja, que es privada. Si se filtra, se cambia
   `REVALIDATE_SECRET` y se rehace el enlace.

2. **Un Apps Script en la hoja**, para que sea automático. En *Extensiones → Apps Script*:

   ```js
   function onEdit() {
     // Espera un poco: al escribir se disparan muchos onEdit seguidos y no tiene sentido
     // pedir una revalidación por tecla.
     const props = PropertiesService.getScriptProperties()
     const ahora = Date.now()
     if (ahora - Number(props.getProperty('ultimo') || 0) < 60000) return
     props.setProperty('ultimo', String(ahora))

     UrlFetchApp.fetch(
       'https://hack-with-dsc.vercel.app/api/revalidate?secret=EL_SECRETO&tag=sponsors',
       { method: 'post', muteHttpExceptions: true },
     )
   }
   ```

Aunque no se dispare nada, el contenido se actualiza solo dentro de la hora.

### 3.4 Validación en la frontera

La hoja la editan personas. Va a haber fechas mal escritas, celdas vacías y tipos con
faltas de ortografía. Eso **no** puede llegar a tumbar la web.

Reglas:

1. Cada fila se valida y se transforma **una sola vez**, al leerla. A partir de ahí, el
   resto del código trabaja con `Evento` bien formado.
2. Una fila inválida **se descarta y se registra en el log**; no rompe la página. Es
   preferible una web con 9 eventos que una web caída por el décimo.
3. Se descarta todo lo que tenga `Mostrable` en falso, **antes** de cualquier otra cosa.
   Una celda vacía cuenta como «no»: una fila a medio escribir nunca se publica sola.
4. Las columnas internas nunca llegan al navegador. En `/sponsors` eso se consigue leyendo
   un rango de columnas explícito; en eventos, donde el rango es ancho a propósito (§3.5),
   lo garantiza el mapeo campo por campo de `lib/eventos/esquemas.ts`.

La validación es con **Zod** (ya es dependencia). `lib/sponsors/esquemas.ts` es el ejemplo
a copiar: un esquema por pestaña que declara solo lo imprescindible, y un `filasValidas()`
que aplica el filtro de `mostrable`, valida, avisa de lo descartado con el número de fila,
y ordena. Está factorizado justamente para que ninguna pestaña se quede sin el filtro de
`mostrable` — que es el fallo que publica contenido a medio escribir.

Y una regla que no está en la lista de arriba porque no es de datos sino de seguridad:
**cualquier celda que acabe en un `href` o un `src` se filtra**. Solo se dejan pasar
`http(s)` (y `mailto:` en los textos), y de un nombre de archivo se toma solo la última
parte. Quien edita la hoja no es necesariamente quien despliega.

### 3.5 Cómo quedó la lectura de eventos

`lib/eventos/` calca la estructura de `lib/sponsors/` (`types` → `esquemas` → `sheets` →
`contenido`) sobre la capa compartida de §3.0, con **tres diferencias deliberadas**:

1. **No hay contenido de reserva.** Ver arriba: una fecha vieja es peor que ninguna.
2. **El rango es ancho** (`A1:Z200`) y las columnas se eligen por nombre, no por posición,
   porque el equipo reordena columnas en la hoja sin avisar. Eso hace que columnas internas
   lleguen a la memoria del servidor; lo que impide que salgan al navegador es que
   `lib/eventos/esquemas.ts` construye cada objeto campo por campo. **Un `...fila` ahí
   filtraría los correos del equipo al HTML público.**
3. **Hay un módulo solo para las fechas** (`lib/eventos/fechas.ts`), porque una fecha mal
   leída es el único fallo de este proyecto que no se ve: no rompe nada, no sale en
   consola, y solo se nota cuando alguien se presenta el día equivocado. Ese módulo NO usa
   `Date` para mostrar —lo haría depender de la zona horaria del servidor— y admite cuatro
   grados de certeza, de `2026-08-20 12:00` a «solo sé que es en setiembre».

Se comprueba con `pnpm probar:eventos`, que ejecuta el mismo código que la web: primero
una tabla de casos de fechas, después la hoja real diciendo qué se publicaría hoy y qué se
descartó y por qué.

**Los estados vacíos importan tanto como el caso feliz**, y la hoja va a estar así la
mayor parte del tiempo: sin fecha, sin descripción, sin nadie asignado, sin enlace de
inscripción. Todos están cubiertos y ninguno deja hueco en la tarjeta.

### 3.5.1 Tres trampas comprobadas al conectar la hoja de verdad

Las tres se dieron el 11 de agosto de 2026, con credenciales correctas y una hoja bien
llena. Ninguna es evidente y las tres están ya resueltas en el código; quedan escritas
porque volverán a aparecer con la hoja de eventos.

**1. La cabecera no siempre está en la fila 1.** Quien mantiene la hoja escribe una nota
para el resto del equipo encima de la tabla («todo en NO hasta tener los números
confirmados»), que es justo lo que hay que hacer para que otra persona la llene bien. Si
el lector da por hecho que la fila 1 es la cabecera, ninguna columna se llama `mostrable`,
el filtro descarta la pestaña **entera y en silencio**, y la sección desaparece de la web
sin decir por qué. `aFilas()` busca la cabecera: es la primera fila que trae una celda
igual a `mostrable`.

**2. `next build` y `node --env-file` leen el `.env` distinto.** Con la clave privada
escrita en varias líneas, `node --env-file` quita las comillas y `next build` **no**: la
clave le llega empezando por `"` y OpenSSL falla con
`error:1E08010C:DECODER routines::unsupported`, que no dice nada. El síntoma es
desconcertante — `pnpm probar:sponsors` funciona y `pnpm build` no, con las mismas
credenciales. `clavePrivada()` normaliza las dos formas y, si aun así no parece un PEM,
lo dice con todas sus letras.

**3. La caché guarda también los fallos.** Si un build no pudo leer la hoja, ese "no pude"
queda cacheado en `.next/cache` durante la hora de `revalidate`, y el siguiente build
—aunque ya funcione— sigue sirviendo el contenido de reserva **sin volver a intentarlo y
sin registrar nada**. Después de arreglar credenciales hay que vaciar la caché:

```bash
rm -rf .next/cache && pnpm build     # en local
# en producción: POST /api/revalidate?secret=...&tag=sponsors
```

### 3.6 Cosas que se van a olvidar

- **Zonas horarias.** Guardar fechas en ISO y formatear en `America/Lima`. Si se usa
  `new Date()` sin zona, el servidor en UTC muestra el día anterior para eventos de noche.
- **Fecha tentativa vs. confirmada.** La hoja tiene las dos columnas y la interfaz tiene
  que distinguirlas visualmente: "Sem 3" no es "20 de agosto".
- **Fotos de ponentes.** Si vienen de Google Drive, hay que declarar el dominio en
  `images.remotePatterns` de `next.config.mjs` y quitar `unoptimized: true`. Y contemplar
  la foto que no carga.
- **`EVENT_ID` es la clave.** Nunca usar el nombre del evento como identificador: cambia.
- El `.env` con la clave privada pasa a ser material sensible: permisos `600`.

---

## 4. Ideas descartadas, y por qué

| Idea | Por qué no |
| ---- | ---------- |
| Un CMS (Sanity, Contentful) | El equipo ya trabaja en una hoja de cálculo y le funciona. Meter un CMS es añadir una herramienta que hay que aprender y pagar para resolver algo que ya está resuelto. |
| Base de datos para los eventos | Duplicaría la fuente de verdad. La hoja seguiría siendo donde se planifica, y habría que sincronizar las dos. |
| Desplegar **solo** en la MV | Se despliega en los dos sitios a la vez, ver §1.1. Vercel da previsualizaciones por Pull Request gratis, que es justo lo que ayuda a un equipo que está aprendiendo. |
| Tema claro con interruptor | Ver §1. La identidad visual no funciona en claro. |
| Cachear con Redis | No hay nada que Redis resuelva acá y que la caché de Next no resuelva ya. Sería un servicio más que operar en la MV. |
| Llamar a Sheets desde el navegador | Expondría las credenciales, y sería una llamada por visita. |
