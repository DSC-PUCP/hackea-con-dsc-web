# Despliegue

El proyecto tiene **dos destinos**:

| Rama | Destino | Estado | Guía |
| --- | --- | --- | --- |
| `main` | Vercel | activo hoy | §0, más abajo — no hay nada que administrar |
| `prod` | MV Ubuntu (Docker + nginx) | planificado | el resto de este documento |

---

## 0. Vercel (rama `main`)

No requiere trabajo de infraestructura: Vercel construye y despliega a cada push. Solo
hay **cuatro cosas** que revisar en el panel del proyecto:

1. **Variable de entorno `NEXT_PUBLIC_SITE_URL`** — **opcional.** Si no se define, el
   sitio detecta solo el dominio de Vercel (`VERCEL_PROJECT_PRODUCTION_URL`), así que la
   tarjeta de previsualización de WhatsApp funciona sin configurar nada. Se define solo
   para forzar otro dominio, como el de la universidad.

   > ⚠️ **Lo que no se debe hacer: crearla y dejarla vacía.** Eso tumbó un despliegue con
   > `TypeError: Invalid URL, input: ''`, porque el operador `??` de JavaScript no
   > considera "vacío" un string vacío. Hoy `lib/site-url.ts` descarta los valores vacíos
   > o inválidos y ya no rompe, pero si la creas, ponle valor y con `https://` incluido.
   > Si la ves vacía en el panel, bórrala.

   Es `NEXT_PUBLIC_*`, así que **se incrusta al compilar**: cambiarla exige un *redeploy*,
   no basta con guardar.

2. **Optimización de imágenes**: está desactivada a propósito (`images.unoptimized` en
   `next.config.mjs`), porque los WebP ya vienen optimizados del repo. En Vercel eso
   además evita consumo de cuota de Image Optimization. No hay que tocar nada.

3. **`output: 'standalone'` no se activa en Vercel.** Es correcto y deliberado: lo pide
   solo el Dockerfile. Ver `docs/arquitectura.md` §1.1.

4. **Las variables de Google Sheets** (`GOOGLE_SERVICE_ACCOUNT_EMAIL`,
   `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEETS_SPONSORS_ID`, `REVALIDATE_SECRET`) — **opcionales
   también.** Sin ellas, `/sponsors` se dibuja con el contenido de reserva del repo y no
   pasa nada. Con ellas, el equipo edita esa página desde una hoja de cálculo.

   No son `NEXT_PUBLIC_*`, así que no se incrustan en el paquete del navegador. Cambiarlas
   sí exige un *redeploy* igualmente, porque la página se pre-genera al compilar. Cómo se
   crea la cuenta de servicio: `docs/arquitectura.md` §3.2.

   Al pegar `GOOGLE_PRIVATE_KEY`, que quede **en una sola línea**, con los `\n` literales
   tal como vienen del JSON de Google.

Lo que **no** hay que hacer en Vercel: subir el `.env`, ni configurar nginx, ni nada de
Docker. Todo eso es exclusivo de la MV.

### Cuando llegue la rama `prod`

La Action que despliegue a la MV tiene que construir con `NEXT_OUTPUT=standalone`. El
`Dockerfile` ya define esa variable, así que si la Action usa `docker compose build` no
hay nada extra que hacer.

---

## La MV

Guía para quien administra el servidor. Asume **Ubuntu Server** (20.04 o superior) con
acceso `sudo` por SSH, y experiencia normal de sysadmin Linux — no asume nada de
Node.js ni de Next.js.

**Resumen de la arquitectura**: la web corre en un contenedor Docker que escucha
únicamente en `127.0.0.1:3000`. **nginx** es el único proceso expuesto a internet: recibe
en 443, termina el TLS y hace proxy al contenedor. La app es estática (no hay base de
datos, ni sesiones, ni estado que persistir).

```
internet ──443/80──▶ nginx (host) ──▶ 127.0.0.1:3000 ──▶ contenedor Docker
                       │                                   └─ node server.js
                       └─ certificado Let's Encrypt
```

Esto importa: **si el contenedor se reinicia no se pierde nada**. No hay volúmenes ni
datos que respaldar. El "respaldo" del sitio es el repositorio de git.

---

## 1. Requisitos en el servidor

| Recurso | Mínimo | Cómodo | Nota                                                    |
| ------- | ------ | ------ | ------------------------------------------------------- |
| RAM     | 1 GB   | 2 GB   | El build de Next es lo que más consume, no el servir    |
| Disco   | 10 GB  | 20 GB  | Docker y sus capas se acumulan; ver §8 sobre limpieza    |
| CPU     | 1 vCPU | 2 vCPU | —                                                       |

> Con 1 GB de RAM el `docker build` puede morir por falta de memoria. Si pasa, mira §9:
> se resuelve con swap, o construyendo la imagen en otra máquina.

Puertos que tienen que estar abiertos hacia internet: **80** y **443**. Nada más. El
3000 **no** se abre: el contenedor solo escucha en localhost.

---

## 2. Instalar Docker (una sola vez)

Los paquetes `docker.io` de los repos de Ubuntu suelen estar viejos y no traen
`docker compose` v2. Usa el repositorio oficial:

```bash
# Dependencias para poder añadir el repositorio
sudo apt update
sudo apt install -y ca-certificates curl gnupg

# Clave GPG oficial de Docker
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Repositorio
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```

Para no tener que escribir `sudo` en cada comando de Docker:

```bash
sudo usermod -aG docker $USER
```

**Cierra la sesión SSH y vuelve a entrar** para que el grupo tome efecto. Comprueba:

```bash
docker --version          # 24 o superior
docker compose version    # v2.x  (ojo: "compose", sin guion)
```

> `docker-compose` con guion es la v1, en Python, ya descontinuada. Todos los comandos
> de esta guía usan `docker compose` (v2, plugin en Go).

---

## 3. Traer el proyecto

```bash
sudo mkdir -p /opt/hackwithdsc
sudo chown $USER:$USER /opt/hackwithdsc
git clone <url-del-repo> /opt/hackwithdsc
cd /opt/hackwithdsc
```

> `/opt` es la convención para software desplegado a mano. Evita el `$HOME` de una
> persona: si esa cuenta se borra, se va el sitio con ella.

---

## 4. Configurar el entorno

```bash
cp .env.example .env
nano .env
```

Lo único obligatorio hoy:

```ini
NEXT_PUBLIC_SITE_URL=https://el-dominio-real.pucp.edu.pe
```

### Si el sitio va en un subdirectorio

Escenario previsto: `https://dsc.inf.pucp.edu.pe/hack-with-dsc` en vez de un subdominio
propio. Se resuelve **incluyendo la ruta en esta misma variable**:

```ini
NEXT_PUBLIC_SITE_URL=https://dsc.inf.pucp.edu.pe/hack-with-dsc
```

`next.config.mjs` deduce de ahí el `basePath` de Next, y con eso la app prefija sola todos
sus assets (`/hack-with-dsc/_next/...`), los enlaces internos, el sitemap y las URL de Open
Graph. **No hay una segunda variable que poner**: se hizo así a propósito, para que no
puedan desincronizarse.

Lo que sí hay que ajustar aparte: el bloque `location` de nginx y la coordinación del
`robots.txt` raíz. Los tres pasos están detallados en la cabecera de
`deploy/nginx/hackwithdsc.conf`.

> Verificación rápida de que quedó bien: `curl -s https://EL-DOMINIO/hack-with-dsc/ | grep
> -o '/hack-with-dsc/_next[^"]*' | head -1`. Si no devuelve nada, la app se compiló sin la
> ruta y la web va a salir sin estilos.

> ⚠️ **Esto se lee al construir, no al arrancar.** En Next, las variables `NEXT_PUBLIC_*`
> se incrustan dentro del JavaScript compilado. Si cambias el dominio más adelante, hay
> que **reconstruir** (`docker compose up -d --build`); reiniciar el contenedor no basta.
>
> Si está mal, la web funciona igual, pero la tarjeta de previsualización al compartir el
> link por WhatsApp sale sin imagen.

### Las variables de Google Sheets

Son **opcionales**, y el sitio se despliega perfectamente sin ellas: `/sponsors` se dibuja
con el contenido de reserva del repo, sin errores ni huecos. Ponlas cuando el equipo
quiera editar esa página desde la hoja:

```bash
GOOGLE_SERVICE_ACCOUNT_EMAIL=...
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n"
GOOGLE_SHEETS_SPONSORS_ID=...
REVALIDATE_SECRET=...
```

Cómo se crea la cuenta de servicio: `docs/arquitectura.md` §3.2. Dos avisos operativos:

- **En cuanto existan, `.env` es material sensible.** Permisos `600` y dueño el usuario
  del despliegue. `.dockerignore` ya lo excluye de la imagen.
- **No son `NEXT_PUBLIC_*`**, así que se leen en ejecución: para cambiarlas basta
  reiniciar el contenedor, no hace falta reconstruir la imagen.

`GOOGLE_SHEETS_ID` (la agenda de eventos) sigue siendo de la Fase 2 y todavía no se usa.

---

## 5. Levantar la app

```bash
cd /opt/hackwithdsc
docker compose up -d --build
```

La primera vez tarda entre 3 y 8 minutos (descarga la imagen base de Node e instala las
dependencias). Las siguientes son mucho más rápidas gracias a la caché de capas.

Comprobar:

```bash
docker compose ps                            # debe decir "healthy"
curl http://127.0.0.1:3000/api/health         # {"status":"ok",...}
```

Si `curl` responde, la app está bien y lo que falte es cosa de nginx.

---

## 6. nginx y HTTPS

### 6.1 Instalar

```bash
sudo apt install -y nginx
```

Comprueba que exista `/etc/nginx/proxy_params` (la traen los paquetes de Debian/Ubuntu;
la configuración del repo lo incluye). Si no existe:

```bash
sudo tee /etc/nginx/proxy_params > /dev/null <<'EOF'
proxy_set_header Host $http_host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
EOF
```

### 6.2 Instalar la configuración del sitio

```bash
sudo cp /opt/hackwithdsc/deploy/nginx/hackwithdsc.conf /etc/nginx/sites-available/
sudo sed -i 's/hackwithdsc.pucp.edu.pe/EL-DOMINIO-REAL/g' \
  /etc/nginx/sites-available/hackwithdsc.conf
sudo ln -sf /etc/nginx/sites-available/hackwithdsc.conf /etc/nginx/sites-enabled/

# El sitio de bienvenida por defecto estorba: responde antes que el nuestro
sudo rm -f /etc/nginx/sites-enabled/default

# Carpeta donde certbot deja su prueba de validación
sudo mkdir -p /var/www/certbot

sudo nginx -t          # SIEMPRE antes de recargar
sudo systemctl reload nginx
```

En este punto el sitio ya debería responder por **HTTP** en el dominio. Verifícalo antes
de seguir: certbot necesita que funcione para poder validar.

### 6.3 Certificado TLS

**Antes**: el registro DNS del dominio tiene que apuntar a la IP de la MV, y haberse
propagado. Comprueba con `dig +short EL-DOMINIO-REAL`.

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d EL-DOMINIO-REAL
```

Certbot pide un correo, emite el certificado, añade el bloque `server` de 443 a la
configuración y ofrece redirigir HTTP a HTTPS — **acepta la redirección**.

La renovación automática queda instalada como temporizador de systemd. Compruébala:

```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

> El certificado dura 90 días y se renueva solo a los 60. El único modo realista de que
> falle es que alguien bloquee `/.well-known/acme-challenge/` en nginx. Está contemplado
> en la configuración del repo: no lo quites.

### 6.4 Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'      # abre 80 y 443
sudo ufw enable
sudo ufw status
```

> **Nunca** abras el 3000. Si lo abres, la web queda accesible por HTTP sin cifrar,
> saltándose el certificado.
>
> Advertencia sobre Docker y ufw: Docker escribe reglas de iptables por su cuenta y en
> algunas configuraciones **se salta ufw**. Aquí no ocurre porque `docker-compose.yml`
> publica el puerto como `127.0.0.1:3000:3000`, atado a localhost. Si alguien lo cambia a
> `3000:3000`, el puerto queda expuesto a internet aunque ufw diga lo contrario.
> Compruébalo desde fuera con `nmap -p 3000 LA-IP`.

---

## 7. Actualizar el sitio

Con el script incluido, que además espera y comprueba que quedó sano:

```bash
cd /opt/hackwithdsc
./deploy/actualizar.sh
```

O a mano:

```bash
cd /opt/hackwithdsc
git pull
docker compose up -d --build
docker compose ps
```

Hay unos segundos de corte mientras el contenedor nuevo reemplaza al viejo (el `--build`
compila antes de reemplazar, así que el corte real es de 2-5 s). Para una web informativa
es aceptable; si algún día molesta, se resuelve con dos contenedores y un cambio de
`upstream` en nginx.

### Volver atrás

No hay imágenes versionadas, así que se revierte por git:

```bash
cd /opt/hackwithdsc
git log --oneline -10                # busca el commit bueno
git checkout <hash-del-commit-bueno>
docker compose up -d --build
```

Para volver a la última versión: `git checkout main && docker compose up -d --build`.

---

## 8. Operación del día a día

```bash
# Logs de la app, en vivo
docker compose logs -f web

# Últimas 100 líneas
docker compose logs --tail 100 web

# Estado y salud
docker compose ps
docker inspect --format '{{.State.Health.Status}}' hackwithdsc-web

# Reiniciar sin reconstruir
docker compose restart web

# Apagar / levantar
docker compose down
docker compose up -d

# Logs de nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Limpieza de disco (importante)

Cada `--build` deja capas e imágenes huérfanas. Con el tiempo llenan el disco: es la
causa número uno de "el servidor dejó de funcionar" en despliegues así.

```bash
docker system df                 # cuánto ocupa Docker
docker image prune -f            # imágenes sin etiqueta
docker builder prune -f          # caché de construcción (la más pesada)
```

Automatízalo una vez al mes:

```bash
sudo tee /etc/cron.monthly/docker-prune > /dev/null <<'EOF'
#!/bin/sh
docker image prune -af --filter "until=720h"
docker builder prune -af --filter "until=720h"
EOF
sudo chmod +x /etc/cron.monthly/docker-prune
```

Los logs de la app no crecen sin límite: `docker-compose.yml` los limita a 3 archivos de
10 MB. Los de nginx los rota `logrotate`, que Ubuntu ya trae configurado.

---

## 9. Cuando algo falla

### El contenedor no arranca

```bash
docker compose logs --tail 80 web
```

Casi siempre: `.env` no existe, o el puerto 3000 ya lo ocupa otra cosa
(`sudo ss -tulpn | grep 3000`).

### El build muere sin mensaje claro (`Killed`, exit 137)

Se quedó sin memoria. Dos salidas:

**a) Añadir swap** (lo más simple):

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**b) Construir en otra máquina** y transferir la imagen:

```bash
# en una máquina con más RAM
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://EL-DOMINIO -t hackwithdsc-web:latest .
docker save hackwithdsc-web:latest | gzip > web.tar.gz
scp web.tar.gz usuario@la-mv:/tmp/

# en la MV
gunzip -c /tmp/web.tar.gz | docker load
cd /opt/hackwithdsc && docker compose up -d --no-build
```

### El build falla descargando tipografías

Next descarga Google Fonts **en tiempo de compilación**. Si la MV no tiene salida a
internet o hay un proxy corporativo en medio, el build falla ahí.

Salidas: dar salida HTTPS a la MV durante el build, o usar la opción (b) de arriba y
construir fuera.

### nginx responde 502 Bad Gateway

nginx está vivo pero no alcanza al contenedor.

```bash
curl http://127.0.0.1:3000/api/health     # ¿responde la app?
docker compose ps                          # ¿está corriendo y healthy?
```

Si la app responde y nginx da 502, revisa que el `proxy_pass` apunte a
`http://127.0.0.1:3000`. Con SELinux (poco común en Ubuntu) haría falta
`setsebool -P httpd_can_network_connect 1`.

### El sitio carga pero sin estilos, o con imágenes roflas

Suele ser caché del navegador tras un despliegue. Prueba con Ctrl+F5 o en incógnito. Si
persiste, revisa el `error.log` de nginx: puede que alguien haya añadido una regla de
`location` que intercepta `/_next/`.

### El preview al compartir por WhatsApp sale sin imagen

`NEXT_PUBLIC_SITE_URL` está mal, o se cambió sin reconstruir. Comprueba qué quedó
incrustado:

```bash
curl -s https://EL-DOMINIO/ | grep -o 'og:image[^>]*'
```

Debe mostrar la URL absoluta a `/og.jpg` (y la de `/sponsors`, a `/og-sponsors.jpg`).
WhatsApp además cachea los previews de forma agresiva: puede tardar en actualizarse aunque
ya esté bien. Si hay que corregir la imagen, lo único fiable para romper ese caché es
renombrar el archivo.

### Quiero saber si el problema es la app o nginx

Una sola pregunta lo decide:

```bash
curl -I http://127.0.0.1:3000/api/health
```

- Responde 200 → la app está bien, el problema es nginx/TLS/DNS.
- No responde → el problema es el contenedor.

---

## 10. Seguridad

Lo que ya está resuelto en la configuración del repo:

- El contenedor corre como usuario **no root** (`nextjs`, uid 1001).
- El puerto de la app está atado a **localhost**: no es alcanzable desde internet.
- No se expone la cabecera `X-Powered-By`.
- No hay secretos dentro de la imagen: `.env` se monta al contenedor en ejecución, y
  `.dockerignore` excluye `.env`, `internals/` y todo el material interno.
- Los logs están acotados para que no llenen el disco.
- Límite de peticiones por IP en nginx.
- Cabeceras de seguridad (HSTS, `nosniff`, `X-Frame-Options`) en el bloque de 443.

Lo que hay que mantener tú:

```bash
# Parches del sistema, con regularidad
sudo apt update && sudo apt upgrade -y

# Actualizaciones de seguridad automáticas (recomendado)
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

Y lo básico de SSH: acceso por clave, no por contraseña; `PermitRootLogin no`.

> La app **no recibe datos de nadie**: no hay formularios, ni login, ni base de datos. El
> formulario de patrocinio es un Google Form externo, y la cuenta de servicio de Sheets es
> de solo lectura. La superficie de ataque es esencialmente nginx y el sistema operativo.
>
> Lo que sí hay que cuidar, en cuanto se configuren las credenciales de Google: `.env`
> pasa a ser material sensible — permisos `600` y dueño el usuario del despliegue — y
> `REVALIDATE_SECRET` es lo único que protege `/api/revalidate`. Si el enlace con el
> secreto se filtra, se cambia la variable y se reinicia.

---

## 11. Lista de verificación del primer despliegue

- [ ] Docker y `docker compose` v2 instalados; el usuario está en el grupo `docker`
- [ ] Repositorio clonado en `/opt/hackwithdsc`
- [ ] `.env` creado con el `NEXT_PUBLIC_SITE_URL` real
- [ ] `docker compose up -d --build` termina y `docker compose ps` dice `healthy`
- [ ] `curl http://127.0.0.1:3000/api/health` responde `{"status":"ok"}`
- [ ] DNS del dominio apunta a la IP de la MV
- [ ] nginx instalado, `nginx -t` pasa, sitio `default` deshabilitado
- [ ] El sitio responde por HTTP en el dominio
- [ ] Certbot emitió el certificado y la redirección a HTTPS está activa
- [ ] `sudo certbot renew --dry-run` pasa
- [ ] `ufw` activo: solo SSH, 80 y 443
- [ ] Desde fuera, el puerto 3000 está cerrado (`nmap -p 3000 LA-IP`)
- [ ] Limpieza mensual de Docker programada
- [ ] `./deploy/actualizar.sh` probado al menos una vez
