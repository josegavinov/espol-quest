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
   │ Frontend (Phaser.js + React) │ ─REST→ │ backend-rails               │
   │ PWA sobre Canvas HTML5       │  JSON  │ Ruby on Rails 7.1 (API)     │
   │ pendiente: Avance 2          │ ←──────│ niveles, misiones, progreso,│
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

## Puesta en marcha

Requisitos: **Ruby 3.2** (`ruby -v`) y **PostgreSQL 15**.

### Base de datos

La forma más rápida, igual en los tres sistemas operativos, es un contenedor:

```bash
docker run -d --name espol-quest-db \
  -e POSTGRES_USER=espol -e POSTGRES_PASSWORD=espol \
  -e POSTGRES_DB=espol_quest_development \
  -p 5432:5432 postgres:15
```

Para apagarlo: `docker stop espol-quest-db` · para borrarlo: `docker rm -f espol-quest-db`.

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

Comprobación: <http://127.0.0.1:3000/api/v1/health>

## Probar los endpoints

Con el servidor levantado, en otra terminal:

```bash
./scripts/pruebas_kevin.sh      # RF-01 y RF-02
./scripts/pruebas_jose.sh       # RF-03 y RF-04
./scripts/pruebas_jorge.sh      # RF-05 y RF-06
```

Cada script imprime la petición, la respuesta JSON y, al final, los códigos HTTP
de las validaciones (400, 404, 422). En Windows se ejecutan desde **Git Bash**.

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

- Código y base de datos en inglés; claves del JSON de la API en español.
- Los controladores solo traducen HTTP; la lógica de negocio vive en los modelos.
- Un dato se escribe en un solo lugar: las insignias, las facultades y la
  identidad del jugador tienen una única fuente de verdad.
- Los comentarios explican el *por qué*, no repiten lo que dice el código.

## Pendiente para el Avance 2

- Frontend Phaser.js + React (TypeScript) como PWA sobre Canvas HTML5.
- CMS de administración de trivias.
- Autenticación (JWT) y pruebas automatizadas (minitest).
