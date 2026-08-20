# ESPOL Quest

Videojuego de plataformas 2D para la exploración y orientación en el campus
Gustavo Galindo. Proyecto de la materia **Lenguajes de Programación** (ESPOL).

## Integrantes y responsabilidades

| Integrante | Requerimientos funcionales |
|---|---|
| Kevin Gálvez | RF-01 Gestionar escenario y físicas 2D · RF-02 Consultar selector de niveles |
| José Gaviño | RF-03 Registrar respuestas de misiones · RF-04 Consultar misiones y trivias |
| Jorge del Campo | RF-05 Registrar progreso e insignias · RF-06 Consultar tabla de clasificación |

## Arquitectura

```
   ┌──────────────────────────────┐        ┌─────────────────────────────┐
   │ frontend                     │ ─REST→ │ backend-rails               │
   │ React + TypeScript + Phaser  │  JSON  │ Ruby on Rails 7.1 (API)     │
   │ PWA sobre Canvas HTML5 :5173 │ ←──────│ niveles, misiones, progreso,│
   └──────────────────────────────┘        │ insignias y ranking · :3000 │
                                           └─────────────────────────────┘
```

| | backend-rails |
|---|---|
| Lenguaje | Ruby 3.2 |
| Framework | Rails 7.1 (API mode) |
| ORM | Active Record |
| Base de datos | PostgreSQL 15 |
| Puerto | 3000 |

> **Cambio respecto al Avance 1.** Atendiendo la observación del docente sobre el
> lenguaje de programación evaluable, el backend se consolidó en Ruby: el
> servicio en Flask se eliminó y sus requerimientos se reimplementaron en Rails.
> La arquitectura pasa de dos servicios a una API REST única desacoplada del
> frontend, con una sola base de datos y un solo dueño de la identidad del jugador.

## Requisitos · herramientas y versiones

Estas son las versiones con las que el proyecto fue desarrollado y probado. Las
más antiguas dentro del mismo rango mayor también funcionan.

| Herramienta | Versión requerida | Cómo verificarla | Para qué |
|---|---|---|---|
| Ruby | 3.2.x (probado en 3.2.11) | `ruby -v` | backend |
| Bundler | 4.0.9 (el que fija `Gemfile.lock`) | `bundle -v` | gemas del backend |
| PostgreSQL | 15 | `psql --version` o el contenedor `postgres:15` | base de datos |
| Node.js | 20.19+ o 22.12+ (probado en 26.5.0) | `node -v` | frontend |
| npm | el que viene con Node (probado en 11.17.0) | `npm -v` | paquetes del frontend |
| Docker | opcional, 24 o superior | `docker -v` | levantar PostgreSQL sin instalarlo |
| curl | 8.x | `curl --version` | scripts de prueba del backend |
| python3 | 3.8 o superior | `python3 -V` | formatea el JSON en los scripts de prueba |
| Navegador | Chrome, Edge o Firefox actualizado | — | Canvas HTML5 y PWA |

El archivo `backend-rails/.ruby-version` fija `ruby-3.2.11`; si usan `rbenv` o
`asdf` la versión se selecciona sola al entrar a la carpeta. El piso de Node lo
imponen Vite 8, Oxlint y `@vitejs/plugin-react`, que declaran
`^20.19.0 || >=22.12.0`: con Node 20.11 el `npm install` falla.

### Librerías y paquetes

**Backend** (`backend-rails/Gemfile`, versiones exactas en `Gemfile.lock`):

| Gema | Versión | Uso |
|---|---|---|
| `rails` | ~> 7.1.5 (bloqueada en 7.1.6) | framework en modo API |
| `pg` | ~> 1.5 (1.6.3) | driver de PostgreSQL |
| `puma` | >= 5.0 (8.0.2) | servidor HTTP |
| `rack-cors` | 3.0.0 | permite el origen `http://localhost:5173` |
| `debug` | 1.11.1 | solo en desarrollo y pruebas |
| `tzinfo-data` | — | solo en Windows y JRuby |

**Frontend** (`frontend/package.json`, versiones exactas en `package-lock.json`):

| Paquete | Versión | Uso |
|---|---|---|
| `react` · `react-dom` | 19.2.8 | interfaz |
| `phaser` | 4.2.1 | motor 2D sobre Canvas HTML5 |
| `typescript` | 6.0.x | tipado |
| `vite` | 8.2.x | servidor de desarrollo y build |
| `@vitejs/plugin-react` | 6.0.x | integración React |
| `vite-plugin-pwa` | 1.3.0 | service worker y manifiesto de la PWA |
| `tailwindcss` · `postcss` · `autoprefixer` | 3.4.19 · 8.5.26 · 10.5.4 | estilos |
| `oxlint` | 1.7x | linter |

## Puesta en marcha

### 1. Backend · Base de datos

La forma más rápida, igual en los tres sistemas operativos, es un contenedor:

```bash
docker run -d --name espol-quest-db \
  -e POSTGRES_USER=espol -e POSTGRES_PASSWORD=espol \
  -e POSTGRES_DB=espol_quest_development \
  -p 5432:5432 postgres:15
```

Para apagarlo: `docker stop espol-quest-db` · para borrarlo: `docker rm -f espol-quest-db`.

Si el puerto 5432 ya está ocupado por otro PostgreSQL, publiquen el contenedor en
otro puerto (`-p 5433:5432`) y levanten el backend con `POSTGRES_PORT=5433`.

Si prefieren instalarlo nativo (`brew install postgresql@15`, el instalador de
Windows o `pacman -S postgresql`), creen el usuario y la contraseña `espol`.
Cualquier valor se puede cambiar con las variables `POSTGRES_HOST`,
`POSTGRES_PORT`, `POSTGRES_USER` y `POSTGRES_PASSWORD`.

<details>
<summary>Instalar Ruby 3.2</summary>

**macOS**
```bash
brew install ruby@3.2
export PATH="/opt/homebrew/opt/ruby@3.2/bin:$PATH"
```

**Linux**
```bash
git clone https://github.com/rbenv/rbenv.git ~/.rbenv
git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'eval "$(~/.rbenv/bin/rbenv init - bash)"' >> ~/.bashrc && source ~/.bashrc
rbenv install 3.2.11 && rbenv global 3.2.11
```

**Windows**: Ruby+Devkit 3.2.x (x64) desde <https://rubyinstaller.org/downloads/>,
aceptando `ridk install` (opción 3). Los comandos se ejecutan en **Git Bash**.
</details>

```bash
cd backend-rails
bundle install
bin/rails db:create
bin/rails db:migrate
bin/rails db:seed
bin/rails server -p 3000     # http://127.0.0.1:3000
```

Si `bundle install` reclama la versión de Bundler, instalen la que fija el lock:
`gem install bundler -v 4.0.9`.

Comprobación: <http://127.0.0.1:3000/api/v1/health>

### 2. Frontend

```bash
cd frontend
cp .env.example .env          # solo la primera vez
npm install
npm run dev                   # http://localhost:5173
```

El backend debe estar levantado: el frontend lo consume en el puerto 3000, y el
origen `http://localhost:5173` ya está permitido por CORS. Para apuntar a otra
dirección, cambien `VITE_API_URL` en el `.env`.

Estructura, pensada para que los tres trabajemos en paralelo sin conflictos:

| Carpeta | Contenido | Responsable |
|---|---|---|
| `src/api/` | cliente HTTP y tipos del contrato | compartido |
| `src/features/login/` | inicio y registro del jugador | compartido |
| `src/motor/`, `src/features/game/`, `src/features/levels/` | escena Phaser, partida y selector de niveles | Kevin Gálvez |
| `src/features/missions/` | catálogo de misiones y trivia | José Gaviño |
| `src/features/profile/`, `src/features/ranking/` | perfil y tabla de clasificación | Jorge del Campo |
| `src/features/admin/` | CMS de contenido | José Gaviño / Kevin Gálvez |

Nadie usa `fetch` directamente: todo pasa por `src/api/client.ts`, así la URL
base, el manejo de errores y los tipos viven en un solo lugar.

## Cómo probar el proyecto

### A. Probar el backend

Los scripts son **stateful**: escriben progreso y respuestas. Para obtener la
misma salida que se describe aquí, arranquen desde datos limpios:

```bash
cd backend-rails
bin/rails db:reset      # db:drop + db:create + db:schema:load + db:seed
bin/rails server -p 3000
```

El seed deja 4 insignias, 4 jugadores, 3 niveles, 3 misiones, 5 preguntas y 4
progresos de demostración. Los `player_id` 1 a 4 son `kevin_g`, `jose_g`,
`jorge_dc` y `novato01`.

**1. Servicio arriba.** En otra terminal:

```bash
curl http://127.0.0.1:3000/api/v1/health
# {"service":"espol-quest-api","status":"ok","database":"postgresql",
#  "rails":"7.1.6","ruby":"3.2.11", ...}
```

**2. Pruebas por integrante.** Cada script recorre los endpoints de sus RF e
imprime la petición, la respuesta JSON y, al final, los códigos HTTP de las
validaciones. En Windows se ejecutan desde **Git Bash**.

```bash
./scripts/pruebas_kevin.sh      # RF-01 escenario y físicas · RF-02 selector
./scripts/pruebas_jose.sh       # RF-03 respuestas · RF-04 misiones y trivias
./scripts/pruebas_jorge.sh      # RF-05 progreso e insignias · RF-06 ranking
```

Se dan por correctos cuando cada bloque devuelve JSON y la sección final imprime
exactamente los códigos esperados:

| Script | Validaciones esperadas |
|---|---|
| `pruebas_kevin.sh` | nivel inexistente `404` · checkpoint inválido `422` · sin `player_id` `400` |
| `pruebas_jose.sh` | misión inexistente `404` · opción fuera de rango `422` · pregunta de otra misión `422` · jugador inexistente `404` · campos faltantes `400` |
| `pruebas_jorge.sh` | falta `level_code` `400` · facultad inválida `422` · jugador inexistente `404` |

Ambas variables se pueden sobreescribir: `BASE=http://otra:3000/api/v1
./scripts/pruebas_jose.sh`, y `PLAYER=3 ./scripts/pruebas_jose.sh`.

**3. Pruebas manuales con `curl`.** Hay ejemplos listos en la sección
«Endpoints» más abajo.

### B. Probar el frontend

El frontend no tiene pruebas automatizadas; se valida con las verificaciones
estáticas del proyecto más un recorrido funcional en el navegador.

**1. Verificaciones automáticas.** Desde `frontend/`:

```bash
npm run lint     # oxlint: sin salida = sin hallazgos
npm run build    # tsc -b + vite build: compila tipos y genera dist/
npm run preview  # sirve dist/ para probar la PWA ya construida
```

`npm run build` debe terminar en `✓ built` y generar `dist/` con el service
worker (`sw.js`) y el `manifest.webmanifest` de la PWA. El aviso de *chunk*
mayor a 500 kB es esperado: lo produce el bundle de Phaser.

**2. Recorrido funcional.** Con el backend en el puerto 3000 y `npm run dev`
corriendo, abran <http://localhost:5173> y sigan este guion, que toca los seis
requerimientos:

| Paso | Qué hacer | Qué debe verse | RF |
|---|---|---|---|
| 1 | Entrar con un jugador del seed (`kevin_g`) o registrar uno nuevo con nickname y facultad | El menú principal con el nickname y el puntaje | — |
| 2 | Abrir el mapa del campus | Los 3 niveles; `BIB-01` y `BE-01` bloqueados si el puntaje no alcanza el `required_score` | RF-02 |
| 3 | Jugar `FIEC-01` | El escenario en Canvas: mover con ◀ ▶ o A/D, saltar con ↑, W o espacio, interactuar con E o Enter (en móvil, los controles táctiles) | RF-01 |
| 4 | Llegar a un checkpoint de tipo misión e interactuar | Se abre la trivia con sus preguntas | RF-04 |
| 5 | Responder correctamente y también fallar a propósito | Retroalimentación inmediata; el puntaje sube una sola vez por pregunta | RF-03 |
| 6 | Terminar el nivel y salir | El HUD y la cabecera muestran el puntaje actualizado; el siguiente nivel se desbloquea | RF-05 |
| 7 | Abrir Perfil | Niveles superados, porcentaje de exploración e insignias obtenidas | RF-05 |
| 8 | Abrir Ranking, filtrar por facultad | La tabla ordenada por puntaje con la posición calculada | RF-06 |
| 9 | Abrir Admin y crear o editar una misión o un nivel | El cambio se refleja al volver al mapa o a la trivia | CMS |

**3. Probar la PWA.** Sobre `npm run preview` (o el build servido), el navegador
ofrece «Instalar aplicación»; una vez instalada, la interfaz sigue abriendo con
el service worker registrado. En pantallas verticales aparece el aviso para
rotar el dispositivo.

**4. Comprobar el enlace con el backend.** Si una pantalla queda vacía, revisen
la pestaña *Red* del navegador: las peticiones deben ir a `VITE_API_URL`
(`http://127.0.0.1:3000/api/v1`) y responder 200. Un error de CORS significa que
el frontend no está corriendo en `http://localhost:5173`.

## Endpoints · `http://127.0.0.1:3000/api/v1`

| Método | Endpoint | RF | Responsable |
|---|---|---|---|
| GET | `/health` | — | base |
| GET | `/levels?zona=&mundo=&player_id=` | RF-02 | Kevin Gálvez |
| GET | `/levels/<code>` | RF-01 | Kevin Gálvez |
| POST | `/levels/<code>/state` | RF-01 | Kevin Gálvez |
| GET | `/levels/<code>/state?player_id=` | RF-01 | Kevin Gálvez |
| GET | `/levels/<code>/missions?player_id=` | RF-04 | José Gaviño |
| GET | `/missions/<code>` | RF-04 | José Gaviño |
| POST | `/missions/<code>/answers` | RF-03 | José Gaviño |
| GET | `/players/<id>/answers` | RF-03 | José Gaviño |
| POST | `/progress` | RF-05 | Jorge del Campo |
| GET | `/progress/<player_id>` | RF-05 | Jorge del Campo |
| GET | `/ranking?facultad=&limit=` | RF-06 | Jorge del Campo |
| GET | `/badges` | — | Jorge del Campo |
| GET/POST | `/players` | — | base |

CMS de contenido, bajo `/admin`:

| Método | Endpoint | Responsable |
|---|---|---|
| GET/POST | `/admin/missions` · PATCH/DELETE `/admin/missions/<code>` | José Gaviño |
| GET/POST | `/admin/missions/<code>/questions` · PATCH/DELETE `/admin/questions/<id>` | José Gaviño |
| GET/POST | `/admin/levels` · PATCH/DELETE `/admin/levels/<code>` | Kevin Gálvez |
| GET/POST | `/admin/levels/<code>/checkpoints` · PATCH/DELETE `/admin/checkpoints/<code>` | Kevin Gálvez |

Códigos de estado: `200` lectura, `201` escritura, `400` falta un campo
obligatorio, `404` recurso inexistente, `422` dato inválido. Los errores
responden `{ "error": "<clave>", "detalle": <texto o lista> }`.

### Ejemplos

```bash
# Kevin — escenario del nivel FIEC-01
curl http://127.0.0.1:3000/api/v1/levels/FIEC-01

# José — registrar la respuesta de una trivia
curl -X POST http://127.0.0.1:3000/api/v1/missions/M-FIEC-01/answers \
  -H 'Content-Type: application/json' \
  -d '{"player_id":2,"question_id":1,"selected_option":0}'

# Jorge — registrar progreso y consultar el ranking de FIEC
curl -X POST http://127.0.0.1:3000/api/v1/progress \
  -H 'Content-Type: application/json' \
  -d '{"player_id":2,"level_code":"FIEC-01","score":20,"completed":true,
       "badges":["insignia_fiec"]}'

curl "http://127.0.0.1:3000/api/v1/ranking?facultad=FIEC"
```

## Convenciones de código

- Nombres públicos (archivos, componentes, tipos, props) en inglés; variables
  locales y comentarios en español; claves del JSON de la API en español.
- Los controladores solo traducen HTTP; la lógica de negocio vive en los modelos.
- Un dato se escribe en un solo lugar: las insignias, las facultades y la
  identidad del jugador tienen una única fuente de verdad.
- Los comentarios explican el *por qué*, no repiten lo que dice el código.
