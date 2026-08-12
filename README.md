# ESPOL Quest — Avance 1 (Backend)

Videojuego de plataformas 2D para la exploración y orientación en el campus Gustavo Galindo.
Proyecto de la materia **Lenguajes de Programación** (ESPOL).

## Integrantes y responsabilidades

| Integrante | Requerimientos funcionales | Servicio |
|---|---|---|
| Kevin Gálvez | RF-01 Gestionar escenario y físicas 2D · RF-02 Consultar selector de niveles | Flask (Python) |
| José Gaviño | RF-03 Registrar respuestas de misiones · RF-04 Consultar misiones y trivias | Flask (Python) |
| Jorge del Campo | RF-05 Registrar progreso e insignias · RF-06 Consultar tabla de clasificación | Rails (Ruby) |

> Texto de la sección de Implementación del documento de la propuesta:
> [`docs/implementacion-backend.md`](docs/implementacion-backend.md).

## Arquitectura

Dos microservicios independientes que se comunican por HTTP/JSON:

```
                 ┌─────────────────────────────┐
                 │  Frontend (Phaser.js/React) │   ← pendiente (Avance 2)
                 └──────────┬──────────┬───────┘
                            │          │
        REST/JSON           │          │           REST/JSON
              ┌─────────────▼──┐    ┌──▼────────────────────┐
              │ backend-flask  │    │ backend-rails         │
              │ Servicio de    │    │ Servicio de Admin.    │
              │ Juego :5001    │───▶│ y Ranking :3000       │
              │ niveles,       │    │ perfiles, progreso,   │
              │ misiones       │    │ insignias, ranking    │
              └────────────────┘    └───────────────────────┘
```

| | backend-flask | backend-rails |
|---|---|---|
| Lenguaje | Python 3 | Ruby 3.2 |
| Framework | Flask 3.1 (API REST) | Rails 7.1 (API mode) |
| ORM | SQLAlchemy 2.0 | Active Record |
| Puerto | 5001 | 3000 |
| BD (Avance 1) | SQLite | SQLite |
| BD (objetivo) | PostgreSQL 15 | PostgreSQL 15 |

> El Avance 1 corre sobre SQLite para que cualquier integrante levante su servicio sin
> instalar un motor de base de datos. Ambos servicios ya leen la variable `DATABASE_URL`,
> por lo que la migración a PostgreSQL 15 no requiere cambios de código.

---

## Puesta en marcha

### 1. Clonar el repositorio

```bash
git clone <URL-DEL-REPO>
cd proyecto2do
```

### 2. Servicio de Juego — Flask (Kevin y José)

Requisito: **Python 3.11 o superior** (`python3 --version`).

Instalación de Python, si hace falta:

| SO | Comando |
|---|---|
| macOS | `brew install python@3.12` |
| Linux (Ubuntu/Debian) | `sudo apt update && sudo apt install -y python3 python3-venv python3-pip` |
| Windows | Instalar desde <https://www.python.org/downloads/> marcando **"Add python.exe to PATH"** |

**macOS y Linux**

```bash
cd backend-flask
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

python -m seeds.seed_all           # crea las tablas y carga datos de demostración
python run.py                      # queda escuchando en http://127.0.0.1:5001
```

**Windows (PowerShell o CMD)**

```powershell
cd backend-flask
py -3 -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

python -m seeds.seed_all
python run.py
```

Comprobación rápida en el navegador: <http://127.0.0.1:5001/api/v1/health>

> En macOS el puerto 5000 lo ocupa AirPlay Receiver; por eso el servicio usa el 5001.
> Para cambiarlo: `PORT=5002 python run.py` (en Windows: `set PORT=5002` y luego `python run.py`).

### 3. Servicio de Administración y Ranking — Rails (Jorge)

Requisito: **Ruby 3.2** (`ruby -v`).

Instalación de Ruby 3.2, si hace falta:

**macOS**

```bash
brew install ruby@3.2
export PATH="/opt/homebrew/opt/ruby@3.2/bin:/opt/homebrew/lib/ruby/gems/3.2.0/bin:$PATH"
# agregar esa línea a ~/.zshrc para no repetirla en cada terminal
```

**Linux (Ubuntu/Debian)**

```bash
sudo apt update
sudo apt install -y build-essential rbenv libssl-dev libyaml-dev zlib1g-dev libffi-dev libsqlite3-dev
git clone https://github.com/rbenv/ruby-build.git "$(rbenv root)"/plugins/ruby-build
echo 'eval "$(rbenv init - bash)"' >> ~/.bashrc && source ~/.bashrc
rbenv install 3.2.8 && rbenv global 3.2.8
```

**Windows**

Instalar **Ruby+Devkit 3.2.x (x64)** desde <https://rubyinstaller.org/downloads/> y, al
finalizar, aceptar la ejecución de `ridk install` (opción 3). Los comandos siguientes se
ejecutan en **Git Bash**.

Luego, en cualquier sistema:

```bash
cd backend-rails
bundle install
bin/rails db:migrate
bin/rails db:seed
bin/rails server -p 3000           # queda escuchando en http://127.0.0.1:3000
```

Si `bundle install` reclama por la plataforma, agregar la propia y reintentar:

```bash
bundle lock --add-platform x86_64-linux      # Linux
bundle lock --add-platform x86_64-darwin     # Mac Intel
bundle lock --add-platform x64-mingw-ucrt    # Windows
```

Comprobación rápida en el navegador: <http://127.0.0.1:3000/api/v1/health>

### 4. Probar los endpoints (para las capturas del avance)

Con el servicio correspondiente levantado, en otra terminal:

```bash
chmod +x scripts/*.sh           # solo la primera vez, en macOS y Linux

./scripts/pruebas_kevin.sh      # RF-01 y RF-02  (requiere Flask arriba)
./scripts/pruebas_jose.sh       # RF-03 y RF-04  (requiere Flask arriba)
./scripts/pruebas_jorge.sh      # RF-05 y RF-06  (requiere Rails arriba)
```

En **Windows** los scripts se ejecutan desde **Git Bash** (vienen instalados con Git for
Windows); en PowerShell no funcionan. Alternativa en Windows: usar Postman o pegar las URLs
`GET` en el navegador.

Cada script imprime la petición, la respuesta JSON y los códigos HTTP de las validaciones.
También se puede probar con Postman o pegando las URLs de tipo `GET` en el navegador.

---

## Endpoints implementados

### backend-flask · `http://127.0.0.1:5001/api/v1`

| Método | Endpoint | RF | Responsable |
|---|---|---|---|
| GET | `/health` | — | base |
| GET | `/levels` | RF-02 (lectura) | Kevin Gálvez |
| GET | `/levels/<code>` | RF-01 (lectura) | Kevin Gálvez |
| POST | `/levels/<code>/state` | RF-01 (escritura) | Kevin Gálvez |
| GET | `/levels/<code>/state?player_id=` | RF-01 (lectura) | Kevin Gálvez |
| GET | `/levels/<code>/missions` | RF-04 (lectura) | José Gaviño |
| GET | `/missions/<code>` | RF-04 (lectura) | José Gaviño |
| POST | `/missions/<code>/answers` | RF-03 (escritura) | José Gaviño |
| GET | `/players/<id>/answers` | RF-03 (lectura) | José Gaviño |
| GET/POST | `/players` | — | base |

### backend-rails · `http://127.0.0.1:3000/api/v1`

| Método | Endpoint | RF | Responsable |
|---|---|---|---|
| GET | `/health` | — | Jorge del Campo |
| POST | `/progress` | RF-05 (escritura) | Jorge del Campo |
| GET | `/progress/<player_id>` | RF-05 (lectura) | Jorge del Campo |
| GET | `/ranking?facultad=&limit=` | RF-06 (lectura) | Jorge del Campo |
| GET | `/badges` | — | Jorge del Campo |

### Ejemplos de uso

```bash
# Kevin — escenario del nivel FIEC-01
curl http://127.0.0.1:5001/api/v1/levels/FIEC-01

# José — registrar la respuesta de una trivia
curl -X POST http://127.0.0.1:5001/api/v1/missions/M-FIEC-01/answers \
  -H 'Content-Type: application/json' \
  -d '{"player_id":2,"question_id":1,"selected_option":0}'

# Jorge — registrar progreso y consultar el ranking de FIEC
curl -X POST http://127.0.0.1:3000/api/v1/progress \
  -H 'Content-Type: application/json' \
  -d '{"player_id":2,"nickname":"jose_g","facultad":"FIEC","level_code":"FIEC-01",
       "score":20,"exploration_pct":100,"completed":true,"badges":["insignia_fiec"]}'

curl "http://127.0.0.1:3000/api/v1/ranking?facultad=FIEC"
```

---

## Estructura del repositorio

```
proyecto2do/
├── backend-flask/              Servicio Principal de Juego (Python + Flask)
│   ├── app/
│   │   ├── models/
│   │   │   ├── level.py        niveles, plataformas, checkpoints, estado  (Kevin)
│   │   │   ├── mission.py      misiones, preguntas, respuestas            (José)
│   │   │   └── player.py       jugadores                                 (base)
│   │   ├── routes/
│   │   │   ├── levels.py       RF-01 y RF-02                             (Kevin)
│   │   │   ├── missions.py     RF-03 y RF-04                             (José)
│   │   │   └── players.py      registro de jugadores                     (base)
│   │   ├── __init__.py         application factory
│   │   └── config.py
│   ├── seeds/                  datos de demostración
│   ├── requirements.txt
│   └── run.py
├── backend-rails/              Servicio de Administración y Ranking      (Jorge)
│   ├── app/models/             Profile, LevelProgress, Badge, ProfileBadge
│   ├── app/controllers/api/v1/ progress, ranking, badges, health
│   ├── db/migrate/             migraciones
│   └── db/seeds.rb
├── docs/                       propuesta y capturas del avance
└── scripts/                    scripts de prueba por integrante
```

## Pendiente para el Avance 2

- Frontend Phaser.js/React que consuma ambas APIs.
- Migración de ambos servicios a PostgreSQL 15 y unificación de la identidad del jugador.
- Autenticación (JWT) y CMS de administración de trivias.
- Sincronización automática Flask → Rails al completar un nivel.
- Pruebas automatizadas (pytest / minitest) y despliegue.
