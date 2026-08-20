# ESPOL Quest

Videojuego de plataformas 2D para la exploración y orientación en el campus
Gustavo Galindo. Proyecto de Lenguajes de Programación (ESPOL).

Kevin Gálvez, José Gaviño y Jorge del Campo.

```
frontend/       React + TypeScript + Phaser    puerto 5173
backend-rails/  Ruby on Rails (API)            puerto 3000
```

## Requisitos

- Ruby 3.2
- PostgreSQL 15
- Node 20.19 o superior
- Docker (opcional, para levantar PostgreSQL)
- curl y python3 (los usan los scripts de prueba)

## Base de datos

```bash
docker run -d --name espol-quest-db \
  -e POSTGRES_USER=espol -e POSTGRES_PASSWORD=espol \
  -e POSTGRES_DB=espol_quest_development \
  -p 5432:5432 postgres:15
```

Si prefieren instalar PostgreSQL nativo, creen el usuario y contraseña `espol`.

## Backend

```bash
cd backend-rails
bundle install
bin/rails db:create
bin/rails db:migrate
bin/rails db:seed
bin/rails server -p 3000
```

Para comprobar que responde: <http://127.0.0.1:3000/api/v1/health>

## Frontend

En otra terminal, con el backend levantado:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Abrir <http://localhost:5173>.

Otros comandos: `npm run lint`, `npm run build` y `npm run preview` (sirve la
versión construida para probar la PWA).

## Probar los endpoints

Con el backend corriendo, en otra terminal:

```bash
./scripts/pruebas_kevin.sh
./scripts/pruebas_jose.sh
./scripts/pruebas_jorge.sh
```

Cada script imprime la petición, la respuesta JSON y los códigos de las
validaciones. En Windows se ejecutan desde Git Bash.

## Endpoints · `http://127.0.0.1:3000/api/v1`

```
GET  /health
GET  /levels                      GET  /levels/:code
POST /levels/:code/state          GET  /levels/:code/state
GET  /levels/:code/missions       GET  /missions/:code
POST /missions/:code/answers      GET  /players/:id/answers
POST /progress                    GET  /progress/:player_id
GET  /ranking                     GET  /badges
GET  /players                     POST /players
     /admin/*                     (CMS de misiones, preguntas y niveles)
```

## Versiones

Frontend: Phaser 4.2, React 19.2, TypeScript 6.0, Vite 8.2, Tailwind 3.4,
vite-plugin-pwa 1.3.

Backend: Rails 7.1.6, pg 1.6, puma 8.0, rack-cors 3.0.

Las versiones exactas están en `frontend/package-lock.json` y
`backend-rails/Gemfile.lock`. `npm install` y `bundle install` las resuelven.
