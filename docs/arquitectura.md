# Arquitectura y decisiones técnicas

Por qué el proyecto está hecho así, y el plan de lo que falta. Si vas a implementar la
Fase 2, la §3 es tu documento.

---

## 1. Estado actual (Fase 1)

Un sitio de **una sola página, completamente estático**, con dos secciones: la portada y
"Qué es Hack with DSC".

```
Navegador
    │
    ├── HTML pre-generado (se construye al hacer el build, no por visita)
    ├── CSS de Tailwind v4
    ├── ~3 KB de JS propio (parallax + aparición al scroll + header)
    └── imágenes WebP de public/brand/
```

No hay base de datos, ni API externa, ni sesiones, ni estado en el servidor. La página se
genera una vez al construir y se sirve idéntica a todos. Es la razón de que sea rápida y
de que operarla sea casi gratis.

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

### Decisiones y por qué

**Next.js 16 con App Router.** Es lo que ya usaba el proyecto. Para una landing es más de
lo necesario, pero da render en servidor (bueno para SEO y para compartir el link),
optimización automática, y —lo que de verdad pesa— permite que la Fase 2 se añada sin
cambiar de tecnología: la lectura de Google Sheets con caché es algo que Next resuelve de
forma nativa.

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

### Por qué no se muestran los eventos

Decisión de producto, no limitación técnica. El programa se planifica en una hoja de
cálculo que se mueve cada semana: fechas tentativas, lugares por confirmar, ponentes sin
cerrar. Publicar eso y luego cambiarlo quema credibilidad, y mantenerlo a mano en el
código garantiza que se desincronice.

Así que la web no dice nada de eventos hasta que pueda decirlo leyendo la hoja. Mientras
tanto, el canal de anuncios es el grupo de WhatsApp, que es a donde apuntan todos los CTA.

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

## 3. Fase 2: eventos desde Google Sheets

**Nada de esto está implementado.** Es el diseño acordado, para que quien lo tome no tenga
que decidir de cero. El contrato de datos ya está escrito en
[`lib/eventos/types.ts`](../lib/eventos/types.ts).

### 3.1 El problema

El equipo planifica en una hoja de cálculo (`internals/Eventos | Hack with DSC.xlsx`, con
su equivalente en Google Sheets). Quieren editar ahí y que la web se actualice, sin pedirle
un despliegue a nadie.

Restricciones:

- La hoja tiene columnas internas que **no** se publican (`Observaciones`, correos,
  responsables, links a docs internos).
- Tiene eventos a medio planificar que no deben salir: de ahí la columna
  **`Mostrable en web`**, que es el interruptor editorial.
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

Pasos de configuración (a documentar al implementarlo):

1. En Google Cloud Console: crear proyecto, habilitar **Google Sheets API**.
2. Crear una cuenta de servicio, generar una clave JSON.
3. **Compartir la hoja con el correo de la cuenta de servicio, en modo Lector.** Este es
   el paso que todo el mundo olvida, y el error que da es confuso.
4. Poner `GOOGLE_SHEETS_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL` y `GOOGLE_PRIVATE_KEY` en
   `.env` (ya están documentadas en `.env.example`).

Permiso de **lectura solamente**. La app nunca escribe en la hoja.

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

Para no esperar los 10 minutos, una ruta de revalidación:

```
POST /api/revalidate?secret=<REVALIDATE_SECRET>
  └─▶ revalidateTag('eventos')
```

Se puede llamar desde un botón interno, o desde un Apps Script en la propia hoja que se
dispare al editar. El secreto es obligatorio: sin él, cualquiera puede forzar llamadas a
la API.

### 3.4 Validación en la frontera

La hoja la editan personas. Va a haber fechas mal escritas, celdas vacías y tipos con
faltas de ortografía. Eso **no** puede llegar a tumbar la web.

Reglas:

1. Cada fila se valida y se transforma **una sola vez**, al leerla. A partir de ahí, el
   resto del código trabaja con `Evento` bien formado.
2. Una fila inválida **se descarta y se registra en el log**; no rompe la página. Es
   preferible una web con 9 eventos que una web caída por el décimo.
3. Se descarta todo lo que tenga `Mostrable en web` en falso, **antes** de cualquier otra
   cosa.
4. Nunca se leen las columnas internas. La forma más segura es leer un rango explícito de
   columnas, no la hoja entera.

Conviene una librería de validación de esquemas (Zod o similar) en vez de comprobaciones a
mano: hace que las reglas sean legibles y el mensaje de error, útil.

### 3.5 Orden de implementación sugerido

1. Lector de la hoja detrás de una función, con los tipos de `lib/eventos/types.ts`.
   Probarlo con un script en `scripts/`, sin tocar la interfaz todavía.
2. Validación y transformación fila → `Evento`, con su descarte y su log.
3. La caché (`unstable_cache` + `revalidate` + `tags`).
4. La ruta de revalidación, con su secreto.
5. **Solo entonces**, la interfaz: sección de agenda, tarjetas de evento, estados vacíos.
6. Los estados vacíos importan tanto como el caso feliz: sin eventos, con fecha tentativa
   en vez de fecha, sin lugar confirmado, sin link de inscripción. La hoja va a estar en
   ese estado la mayor parte del tiempo.

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
