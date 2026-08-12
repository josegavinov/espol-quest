# Texto para pegar en el documento de la propuesta (después del Prototipo)

> **Instrucciones de uso:**
> 1. En el Google Doc, después del punto 9 (Prototipo de Baja Fidelidad), **borre las dos
>    líneas vacías que ya existen**: `10. Implementación` y `11.Backend`. Si no las borra,
>    quedarán dos títulos “10. Implementación” duplicados y un “11.Backend” huérfano.
> 2. En su lugar pegue el contenido de abajo, desde “10. Implementación” hasta antes de
>    “11. Referencias”.
> 3. Cambie el título de la sección de Referencias de “10. Referencias” a
>    **“11. Referencias”** (hoy el documento tiene dos secciones numeradas “10”).
> 4. Inserte las capturas de cada integrante donde se indica y reemplace el enlace del
>    repositorio de GitHub.

---

## 10. Implementación

### 10.1 Backend

Para el Avance 1 se implementaron los dos servicios backend descritos en la sección de
Arquitectura, cada uno con las operaciones de lectura y escritura correspondientes a los
requerimientos funcionales asignados a cada integrante.

**Servicio Principal de Juego — Python 3 / Flask 3.1 / SQLAlchemy 2.0 (puerto 5001).**
Expone la API REST que consumirá el motor de plataformas 2D. Kevin Gálvez desarrolló el
módulo de escenarios: los modelos `Level`, `Platform`, `Checkpoint` y `LevelState`, la
lectura del selector de niveles (`GET /api/v1/levels`), la lectura del escenario completo
con sus parámetros de física, spawn, plataformas y puntos de interés
(`GET /api/v1/levels/<code>`) y la escritura del estado de la partida
(`POST /api/v1/levels/<code>/state`), que valida los checkpoints recibidos, los acumula sin
duplicados y calcula el porcentaje de exploración del nivel. José Gaviño desarrolló el motor
de misiones: los modelos `Mission`, `Question` y `MissionAnswer`, la lectura del catálogo de
misiones por nivel con su estado por jugador (`GET /api/v1/levels/<code>/missions`), el
detalle de la misión con sus preguntas sin exponer la respuesta correcta
(`GET /api/v1/missions/<code>`) y el registro de respuestas
(`POST /api/v1/missions/<code>/answers`), que valida que la pregunta pertenezca a la misión,
verifica la opción seleccionada, otorga el puntaje una única vez por pregunta, devuelve
retroalimentación inmediata y reporta si la misión quedó completada junto con la insignia
desbloqueada.

**Servicio de Administración y Ranking — Ruby 3.2 / Rails 7.1 en modo API / Active Record
(puerto 3000).** Jorge del Campo desarrolló el módulo de perfiles y gamificación: los
modelos `Profile`, `LevelProgress`, `Badge` y `ProfileBadge` con sus migraciones, la
escritura del progreso e insignias del jugador (`POST /api/v1/progress`), que crea o
actualiza el perfil, conserva el mejor intento por nivel, otorga las insignias sin
duplicarlas y recalcula el puntaje total y los niveles superados dentro de una transacción,
y la lectura de la tabla de clasificación (`GET /api/v1/ranking`), que devuelve el ranking
global o filtrado por facultad con las posiciones ya calculadas.

Ambos servicios responden en formato JSON, aplican validaciones de entrada y devuelven los
códigos de estado HTTP correspondientes (200, 201, 400, 404, 422). El avance se ejecuta
sobre SQLite para facilitar la puesta en marcha en las máquinas de los tres integrantes;
ambos servicios leen la variable de entorno `DATABASE_URL`, por lo que la migración a
PostgreSQL 15 —el motor definido en la arquitectura— no requerirá cambios de código.

**Tabla de implementaciones**

| Implementación | Responsable | Estado |
|---|---|---|
| RF-01 · Escenario y físicas 2D — API de niveles: `GET /api/v1/levels/<code>` (lectura del escenario, plataformas, checkpoints y parámetros de física) | Kevin Gálvez | Hecho |
| RF-01 · Escenario y físicas 2D — persistencia del estado de partida: `POST/GET /api/v1/levels/<code>/state` | Kevin Gálvez | Hecho |
| RF-02 · Selector de niveles / mapa de juego: `GET /api/v1/levels` con filtros por zona y mundo | Kevin Gálvez | Hecho |
| RF-04 · Consultar misiones y trivias: `GET /api/v1/levels/<code>/missions` y `GET /api/v1/missions/<code>` | José Gaviño | Hecho |
| RF-03 · Registrar respuestas de misiones: `POST /api/v1/missions/<code>/answers` con validación, puntaje y retroalimentación | José Gaviño | Hecho |
| RF-03 · Historial de respuestas del jugador: `GET /api/v1/players/<id>/answers` | José Gaviño | Hecho |
| RF-05 · Registrar progreso e insignias: `POST /api/v1/progress` y `GET /api/v1/progress/<player_id>` | Jorge del Campo | Hecho |
| RF-06 · Tabla de clasificación: `GET /api/v1/ranking` global y por facultad | Jorge del Campo | Hecho |
| Registro de jugadores y modelo base del servicio de juego: `POST/GET /api/v1/players` | José Gaviño | Hecho |
| Catálogo de insignias: `GET /api/v1/badges` | Jorge del Campo | Hecho |
| Datos semilla de niveles, checkpoints, misiones e insignias | Kevin Gálvez / José Gaviño / Jorge del Campo | Hecho |
| Frontend del motor 2D en Phaser.js (renderizado, movimiento del avatar y colisiones en el navegador) | Kevin Gálvez | Pendiente |
| Interfaz de misiones y trivias en React.js | José Gaviño | Pendiente |
| Pantalla de perfil de progreso y ranking en React.js | Jorge del Campo | Pendiente |
| Migración de ambos servicios a PostgreSQL 15 y unificación de la identidad del jugador entre servicios | Kevin Gálvez / Jorge del Campo | Pendiente |
| Sincronización automática Flask → Rails al completar un nivel | José Gaviño | Pendiente |
| Autenticación de jugadores con JWT | Jorge del Campo | Pendiente |
| Panel de administración (CMS) de trivias y preguntas | José Gaviño | Pendiente |
| Pruebas automatizadas (pytest / minitest) y despliegue de los servicios | Kevin Gálvez / José Gaviño / Jorge del Campo | Pendiente |

**Capturas del backend en funcionamiento**

*(Inserte aquí las capturas. Cada integrante debe incluir al menos una captura propia,
tomada en su máquina, con su terminal o Postman.)*

- Figura 1. Kevin Gálvez — `GET /api/v1/levels` y `GET /api/v1/levels/FIEC-01`: selector de
  niveles y escenario 2D con plataformas y checkpoints.
- Figura 2. Kevin Gálvez — `POST /api/v1/levels/FIEC-01/state`: guardado del estado de la
  partida con el porcentaje de exploración calculado.
- Figura 3. José Gaviño — `GET /api/v1/levels/FIEC-01/missions` y `GET /api/v1/missions/M-FIEC-01`:
  catálogo de misiones y detalle de la trivia.
- Figura 4. José Gaviño — `POST /api/v1/missions/M-FIEC-01/answers`: validación de la
  respuesta, puntaje otorgado, retroalimentación e insignia desbloqueada.
- Figura 5. Jorge del Campo — `POST /api/v1/progress`: registro del progreso e insignias del
  jugador en el servicio Rails.
- Figura 6. Jorge del Campo — `GET /api/v1/ranking` y `GET /api/v1/ranking?facultad=FIEC`:
  tabla de clasificación global y filtrada por facultad.

**Repositorio del proyecto**

Código fuente del Avance 1: `https://github.com/<usuario-u-organizacion>/espol-quest`

*(Reemplace la URL por el enlace real del repositorio una vez creado.)*

---

## 11. Referencias

*(La sección de Referencias del documento actual está numerada como “10”; cámbiela a “11”
para mantener la secuencia. Su contenido no cambia.)*
