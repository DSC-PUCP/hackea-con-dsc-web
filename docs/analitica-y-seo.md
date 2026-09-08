# Analítica y buscadores

Cómo dejar la web **medida** (Google Analytics) y **encontrable** (Google Search Console),
paso a paso y desde cero.

**No hace falta saber nada de Google Cloud.** De hecho, no vas a entrar ahí ni una vez:
Analytics y Search Console son productos aparte, gratuitos, sin proyecto que crear, sin
tarjeta que registrar y sin factura posible. Si en algún momento una pantalla te pide una
tarjeta, te equivocaste de producto — vuelve atrás.

Todo se hace con la cuenta **dsc.pucp@gmail.com**. Empieza por abrir el navegador con esa
sesión, o hazlo en una ventana de incógnito, para no crear las cosas sin querer en tu
cuenta personal. Esto importa más de lo que parece: **quien crea la propiedad es su
dueño**, y sacarla de una cuenta personal después es un trámite.

| Herramienta | Para qué | Dónde |
| --- | --- | --- |
| Google Analytics 4 | Cuánta gente entra, a qué páginas, desde dónde | [analytics.google.com](https://analytics.google.com) |
| Google Search Console | Salir en Google, y ver por qué búsquedas te encuentran | [search.google.com/search-console](https://search.google.com/search-console) |

Lo que hay que hacer en el repo **ya está hecho**. Lo único que falta son dos valores que
te van a dar esas dos webs, y que se pegan en Vercel como variables de entorno:

| Variable | Te la da | Aspecto |
| --- | --- | --- |
| `NEXT_PUBLIC_GA_ID` | Google Analytics | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Search Console | una cadena larga sin espacios |

> Ninguna de las dos es un secreto: las dos acaban impresas en el HTML público del sitio,
> a la vista de cualquiera. No pasa nada si se ven. Están en variables de entorno solo
> porque cambian según dónde esté desplegado el sitio.

---

## Antes de empezar: la regla que te va a morder

Las dos variables empiezan por `NEXT_PUBLIC_`, y eso en Next.js significa una cosa muy
concreta:

> **Se incrustan cuando el sitio se COMPILA, no cuando arranca.**

Traducción práctica: **guardar la variable en Vercel no hace nada.** Hay que volver a
desplegar para que exista. Si te saltas ese paso, vas a ver la pantalla de Google
diciendo "no encontramos la etiqueta" y vas a pensar que te equivocaste al copiar. No: es
que todavía no está publicada.

Cómo volver a desplegar en Vercel, sin tocar código:

1. Entra al proyecto en [vercel.com](https://vercel.com).
2. Pestaña **Deployments**.
3. En el despliegue de arriba del todo (el de producción), pulsa el menú **⋯** →
   **Redeploy** → **Redeploy**.
4. Espera a que ponga **Ready**. Tarda un par de minutos.

> Si te ofrece la casilla *"Use existing Build Cache"*, **desmárcala**. Con la caché
> puesta puede reutilizar el build viejo, que es justo el que no tiene la variable.

---

## Parte 1 — Google Analytics

### 1.1 Crear la cuenta y la propiedad

1. Entra a [analytics.google.com](https://analytics.google.com) con **dsc.pucp@gmail.com**.
2. Si es la primera vez, te lleva solo al asistente. Si no, ve abajo a la izquierda a
   **Administrar** (el engranaje) → **Crear** → **Propiedad**.
3. Te va a pedir, en este orden:

   - **Nombre de la cuenta**: `DSC PUCP`.
     La *cuenta* es el paraguas de la organización; dentro caben varias webs. Ponle el
     nombre del club y no el de esta web, porque mañana va a colgar de aquí también la
     web principal de DSC.
   - **Nombre de la propiedad**: `Hack with DSC`.
     La *propiedad* sí es esta web concreta.
   - **Zona horaria**: `(GMT-05:00) Lima`. Cámbialo, no lo dejes en el que venga.
     Determina dónde corta cada "día" en los informes; con la zona equivocada, un evento
     de las 7 p.m. aparece contado al día siguiente.
   - **Moneda**: soles. Da igual, no se vende nada, pero no se puede dejar vacío.
   - Sector y tamaño: elige lo que se parezca (educación). No afecta a nada medible.

### 1.2 Crear el flujo de datos y copiar el ID

1. Al terminar el asistente te pregunta la plataforma: elige **Web**.
   Si ya lo cerraste: **Administrar** → **Recopilación y modificación de datos** →
   **Flujos de datos** → **Crear flujo** → **Web**.
2. **URL del sitio web**: `hack-with-dsc.vercel.app`
   **Nombre del flujo**: `Web pública`
3. Deja activada la **Medición mejorada**. Es la que hace que se cuenten solas las
   páginas vistas al navegar dentro del sitio, y este sitio la necesita: Next.js cambia
   de página sin recargar el navegador, así que sin eso solo se contaría la primera.
4. Pulsa **Crear flujo**. En la pantalla que sale, arriba a la derecha, está el
   **ID de medición**: `G-` y diez caracteres.

   **Cópialo.** Eso es todo lo que necesitas de aquí. Ignora el bloque de código que te
   ofrece a continuación ("instala la etiqueta de Google"): ese trabajo ya está hecho en
   el repo, y pegarlo otra vez a mano duplicaría cada visita.

### 1.3 Ponerlo en Vercel

1. Proyecto en Vercel → **Settings** → **Environment Variables**.
2. **Key**: `NEXT_PUBLIC_GA_ID` · **Value**: el `G-XXXXXXXXXX` que copiaste.
3. Entornos: marca **Production** y **nada más**.

   > Deja *Preview* sin marcar a propósito. Los despliegues de prueba de cada rama
   > mandarían visitas del equipo a la misma propiedad, y los números dejarían de
   > significar "gente que vino a ver la web".

4. **Save**, y ahora sí: **redespliega** (arriba, «la regla que te va a morder»).

### 1.4 Comprobar que mide

1. Abre <https://hack-with-dsc.vercel.app> en una ventana normal y navega un poco:
   entra a *Agenda*, entra a *Patrocinio*.
2. En Analytics: **Informes** → **Tiempo real**.
3. En menos de un minuto tienes que verte a ti mismo como 1 usuario activo, y las
   páginas que visitaste en la lista de abajo.

Si no aparece nada, salta a [Problemas frecuentes](#problemas-frecuentes).

> **Los informes normales tardan.** *Tiempo real* es inmediato, pero el resto de informes
> (Adquisición, Interacción…) procesan los datos cada varias horas y el primer día pueden
> salir vacíos. No está roto: es así.

---

## Parte 2 — Google Search Console

Esta es la parte que hace que la web **salga en Google**. Analytics no hace eso: mide a
quien ya llegó. Son dos cosas independientes y hay que montar las dos.

### 2.1 Crear la propiedad

1. Entra a [search.google.com/search-console](https://search.google.com/search-console)
   con **dsc.pucp@gmail.com**.
2. Te ofrece dos tipos de propiedad, en dos columnas. Elige la de la derecha:
   **Prefijo de la URL**.

   > **Por qué esa y no "Dominio".** La opción *Dominio* se verifica poniendo un registro
   > DNS, y para eso tienes que ser dueño del dominio. `hack-with-dsc.vercel.app` es un
   > subdominio de Vercel: el DNS no es tuyo, así que esa opción no puede funcionar. Con
   > el dominio de la PUCP tampoco la vas a poder usar tú solo — habría que pedírselo a
   > quien administre el DNS de la universidad.

3. Escribe la URL **completa y exacta**, con `https://` y sin barra al final:

   ```
   https://hack-with-dsc.vercel.app
   ```

   Que sea exacta importa: para Search Console, `http://` y `https://` son sitios
   distintos, y también lo son con y sin `www`.

### 2.2 Copiar el código de verificación

Sale una ventana con varios métodos. Despliega **Etiqueta HTML**. Te muestra algo así:

```html
<meta name="google-site-verification" content="AbC123_xYz...unaCadenaLarga" />
```

**Copia solo lo de dentro de `content`**, sin comillas y sin la etiqueta:

```
AbC123_xYz...unaCadenaLarga
```

> Pegar la etiqueta entera es el error más común aquí. El repo la construye solo; lo que
> le falta es únicamente la cadena.

**No cierres esa ventana ni pulses «Verificar» todavía.** Deja la pestaña abierta.

### 2.3 Ponerlo en Vercel y desplegar

1. Vercel → **Settings** → **Environment Variables**.
2. **Key**: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` · **Value**: la cadena.
3. Entornos: **Production**.
4. **Save** → **redespliega** y espera a que ponga **Ready**.

Comprueba que la etiqueta ya está publicada antes de seguir. Abre la web, click derecho →
**Ver código fuente de la página**, y busca con `Ctrl+F`:

```
google-site-verification
```

Si no aparece, el despliegue todavía no terminó o se usó la caché de build. No sigas
hasta que aparezca: si pulsas «Verificar» ahora, Google falla y hay que empezar de nuevo.

### 2.4 Verificar

Vuelve a la pestaña de Search Console y pulsa **Verificar**. Debería decir
*"Se ha verificado la propiedad"*.

> **La etiqueta no se quita nunca.** No es un paso de instalación que se pueda limpiar
> después: Google la vuelve a comprobar cada cierto tiempo, y si desaparece te revoca la
> verificación y dejas de recibir datos. Por eso vive en una variable de entorno y no en
> un post-it.

### 2.5 Mandar el sitemap

El sitemap es la lista de páginas del sitio, en un formato que Google entiende. **Ya
existe** — lo genera el propio sitio en `/sitemap.xml` y se actualiza solo en cada
despliegue. Solo hay que decirle a Google dónde está, y esto se hace **una sola vez**.

1. En Search Console, menú izquierdo → **Sitemaps**.
2. En "Añadir un sitemap nuevo" escribe únicamente:

   ```
   sitemap.xml
   ```

   (el dominio ya lo pone él delante).
3. **Enviar**. En unos segundos debe decir **Correcto** y "3 páginas descubiertas".

Si dice *No se ha podido obtener*, espera unos minutos y dale a actualizar: a veces
tarda en ir a buscarlo. Compruébalo tú mismo abriendo
<https://hack-with-dsc.vercel.app/sitemap.xml> — si en tu navegador se ve el XML con las
tres páginas, está bien y es cuestión de esperar.

### 2.6 Pedir que indexe ya

Enviar el sitemap es una invitación, no una orden: Google pasa cuando quiere. Para las
páginas que te importan puedes pedir turno a mano.

Para cada una de estas tres:

- `https://hack-with-dsc.vercel.app`
- `https://hack-with-dsc.vercel.app/agenda`
- `https://hack-with-dsc.vercel.app/sponsors`

haz esto:

1. Pega la URL en la **barra de búsqueda de arriba** de Search Console (la que dice
   "Inspeccionar cualquier URL...") y pulsa Enter.
2. Espera al análisis y pulsa **Solicitar indexación**.
3. Espera el minuto que tarda la comprobación. Repite con la siguiente.

> Hay un límite diario de solicitudes, pero con tres páginas no lo vas a rozar. Y
> **pedirlo dos veces no acelera nada**: no vuelvas a solicitarlo cada día.

### 2.7 Qué esperar, y cuándo

Esta es la parte que frustra: **no es inmediato, y no hay forma de que lo sea.**

| Cuándo | Qué deberías ver |
| --- | --- |
| El mismo día | El sitemap en "Correcto" |
| 1 a 7 días | La portada indexada. Búscala con `site:hack-with-dsc.vercel.app` en Google |
| 1 a 4 semanas | Las tres páginas indexadas y datos en el informe **Rendimiento** |

Que salgas al buscar `site:...` significa **indexado**. Salir al buscar *"hack with dsc"*
es otra cosa y depende de la competencia por esas palabras; para un nombre tan propio
suele llegar solo en unas semanas.

---

## Parte 3 — Enlazar los dos (opcional, 2 minutos)

Con esto, los datos de búsqueda de Search Console aparecen **dentro** del panel de
Analytics, y dejas de tener que abrir dos webs para entender de dónde viene la gente.

1. Analytics → **Administrar** → **Vinculaciones de productos** → **Enlaces de Search
   Console**.
2. **Vincular** → **Elegir cuentas** → marca la propiedad de Search Console →
   **Confirmar** → **Siguiente**.
3. Elige el flujo de datos **Web pública** → **Siguiente** → **Enviar**.

Y ahora el paso que todo el mundo se salta, porque no lo dice ninguna pantalla:

4. Analytics → menú izquierdo → **Biblioteca** (abajo del todo) → busca la colección
   **Search Console** → menú **⋯** → **Publicar**.

Sin ese último paso el enlace está hecho pero los informes siguen invisibles, y parece
que no funcionó.

---

## Parte 4 — Que no dependa de una sola persona

`dsc.pucp@gmail.com` es una cuenta compartida, así que esto ya está medio resuelto. Aun
así, conviene dar acceso nominal a quien lleve difusión, para que no tenga que entrar con
la cuenta del club:

- **Analytics**: Administrar → **Gestión de accesos a la propiedad** → **+** → correo →
  rol **Analista** (puede ver y hacer informes, no puede romper la configuración).
- **Search Console**: Configuración → **Usuarios y permisos** → **Añadir usuario** →
  permiso **Completo** o **Restringido**.

> Nunca borres ni cambies la contraseña de `dsc.pucp@gmail.com` sin haber añadido antes
> otro propietario en las dos herramientas. Es la cuenta dueña: si se pierde, se pierde
> el histórico de datos, que no se puede recuperar ni exportar después.

---

## Lo que el repo ya hace por SEO

Para que no vayas a pagar por un plugin que reimplemente algo que ya está. Todo esto sale
solo en cada despliegue y **no hay que mantenerlo**:

| Qué | Dónde vive | Qué resuelve |
| --- | --- | --- |
| `<title>` y descripción por página | `lib/site-config.ts` | Lo que se lee en el resultado de Google |
| `sitemap.xml` | `app/sitemap.ts` | La lista de páginas, siempre al día |
| `robots.txt` | `app/robots.ts` | Deja entrar a los buscadores; bloquea `/api/` |
| `<link rel="canonical">` | `app/layout.tsx` y cada `page.tsx` | Evita que la misma página cuente como dos |
| Open Graph (previsualización) | `app/layout.tsx` y cada `page.tsx` | La tarjeta con imagen al compartir por WhatsApp |
| Idioma `es` y `locale es_PE` | `app/layout.tsx` | Que Google sepa a quién enseñársela |
| HTML semántico y jerarquía de títulos | los componentes | Un solo `<h1>` por página, `<h2>` por sección |

Y dos cosas que **no** hay que hacer:

- **No hace falta bloquear los despliegues de prueba.** Vercel manda solo una cabecera
  `noindex` en los *preview*, así que las ramas no compiten con producción.
- **No hay datos estructurados de eventos (`schema.org/Event`)**, y es a propósito. Ese
  formato exige el **lugar** de cada evento, y en este proyecto el lugar no se publica
  nunca. Un `Event` sin `location` Google lo descarta igual, así que el trabajo no
  compraría nada. Si algún día se publica el lugar, esto merece revisarse.

---

## Cuando la web se mude al dominio de la PUCP

El plan es `https://dsc.inf.pucp.edu.pe/hack-with-dsc` (ver `docs/despliegue.md`). Para
Google eso **es otro sitio**, aunque el contenido sea el mismo. Qué hacer:

1. **Analytics**: nada obligatorio. Es la misma propiedad y el histórico se conserva.
   Actualiza la URL del flujo de datos por prolijidad.
2. **Search Console**: crea una **propiedad nueva** con el prefijo de la URL nueva y
   repite la Parte 2 entera. La cadena de verificación es distinta: cámbiala en
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.

   No borres la propiedad vieja durante unos meses: es donde vas a ver si el tráfico se
   traspasó de verdad.
3. **Que la vieja redirija a la nueva.** Este es el paso que no se puede saltar: si las
   dos siguen vivas con el mismo contenido, Google ve contenido duplicado, elige una por
   su cuenta y puede quedarse con la de Vercel. Una redirección 301 desde la de Vercel le
   traspasa a la nueva el prestigio ya ganado.

---

## Aviso sobre cookies

Google Analytics deja cookies en el navegador de quien visita. En Perú aplica la Ley
29733 de protección de datos personales, y la práctica habitual en webs institucionales
es avisarlo.

Este sitio **no lleva aviso de cookies hoy**, y ponerlo era mucho más que lo que se pidió
aquí. Queda anotado como decisión pendiente del equipo: si se decide que hace falta, lo
mínimo razonable es una línea en el pie enlazando a una página de privacidad. Nótese que
la analítica de Vercel que ya estaba puesta **no** usa cookies; la de Google sí.

---

## Problemas frecuentes

### Analytics no ve nada en «Tiempo real»

En este orden:

1. **¿Está la etiqueta publicada?** Abre la web → ver código fuente → `Ctrl+F` →
   `googletagmanager`. Si no aparece: falta el redespliegue, o la variable se guardó solo
   para *Preview*, o se usó la caché de build.
2. **¿Estás mirando en `localhost`?** En desarrollo la analítica está desactivada a
   propósito, para que tus recargas no ensucien los datos. Solo mide el sitio publicado.
3. **¿Tienes un bloqueador de anuncios?** uBlock, Brave, AdGuard y el modo estricto de
   Firefox bloquean `googletagmanager.com` — y tú eres justo el perfil de persona que lo
   tiene puesto. Prueba en incógnito con las extensiones desactivadas, o desde el móvil
   con datos.
4. **¿Copiaste el ID correcto?** Tiene que empezar por `G-`. Si empieza por `UA-` es de
   la versión antigua de Analytics, ya apagada. Si empieza por `GTM-` es de Tag Manager,
   que es otro producto y no vale acá.

### Search Console dice que no encuentra la etiqueta

Casi siempre una de estas tres:

- No se redesplegó después de guardar la variable.
- Se pegó la etiqueta `<meta ...>` entera en vez de solo el contenido de `content`.
- Se guardó con espacios o un salto de línea al final al copiar.

Compruébalo siempre mirando el código fuente de la web publicada, no la variable en
Vercel: lo que cuenta es lo que llegó al HTML.

### «Detectada, pero no indexada actualmente»

Es normal las primeras semanas y **no es un error**. Significa que Google la conoce y
todavía no ha decidido pasar. Un sitio nuevo, con pocos enlaces apuntándole desde fuera,
tiene poca prioridad.

Lo que sí ayuda de verdad, y más que cualquier ajuste técnico: que la web esté enlazada
desde sitios que Google ya visita. En este caso, las cuentas de DSC PUCP (Instagram,
LinkedIn, GitHub) y, sobre todo, cualquier página del dominio de la universidad.

### Salgo en Google pero con un título o una imagen viejos

Google guarda su propia copia y tarda en refrescarla. Fuerza el repaso con **Inspeccionar
URL** → **Solicitar indexación**.

Si lo que sale mal es la previsualización al compartir por **WhatsApp**, eso es otro
caché distinto y no tiene nada que ver con Google: está explicado en
`docs/despliegue.md` §9.
