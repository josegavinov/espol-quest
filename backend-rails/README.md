# ESPOL Quest — Backend

API REST en Ruby on Rails 7.1 (modo API) que sirve todo el juego: niveles y
físicas del escenario 2D, misiones y trivias, progreso e insignias del jugador y
tabla de clasificación.

## Levantar el servicio

```bash
bundle install
bin/rails db:migrate
bin/rails db:seed
bin/rails server -p 3000     # http://127.0.0.1:3000
```

Comprobación: <http://127.0.0.1:3000/api/v1/health>

## Estructura

| Carpeta | Contenido |
|---|---|
| `app/models/` | `Player`, `Level`, `Platform`, `Checkpoint`, `LevelProgress`, `Mission`, `Question`, `MissionAnswer`, `Badge`, `PlayerBadge` |
| `app/controllers/api/v1/` | un controlador por recurso; solo traducen HTTP, la lógica vive en los modelos |
| `db/migrate/` | migraciones versionadas |
| `db/seeds.rb` | fuente única de insignias, jugadores, niveles y misiones de demostración |

La lista de endpoints está en el [README del repositorio](../README.md).

## Convenciones

- Código y base de datos en inglés; claves del JSON de la API en español.
- Los recursos públicos se identifican por su código (`FIEC-01`, `M-BIB-01`), no
  por el id de la base de datos.
- Los controladores no contienen lógica de negocio: la reciben los modelos.
