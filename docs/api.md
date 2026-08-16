# Contrato de la API — ESPOL Quest

Base: `http://127.0.0.1:3000/api/v1`. Todas las respuestas son JSON.

Este documento es el acuerdo entre el backend y el frontend: mientras no cambie,
las tres partes del Avance 2 se pueden desarrollar en paralelo.

## Convenciones

- Los recursos se identifican por su **código** (`FIEC-01`, `M-BIB-01`), no por id.
- El jugador se identifica por `player_id` (el id de `players`).
- Códigos de estado: `200` lectura, `201` escritura, `400` falta un campo
  obligatorio, `404` recurso inexistente, `422` dato inválido.
- Errores: `{ "error": "<clave>", "detalle": <texto o lista> }`.

## RF-01 · Escenario y físicas 2D — Kevin Gálvez

### `GET /levels/:code`
Escena completa que consume Phaser.

```json
{
  "code": "FIEC-01", "name": "Bloque FIEC: Laboratorios",
  "zone": "FIEC", "world": "Zona Norte", "difficulty": "facil",
  "bounds": { "width": 2400, "height": 720 },
  "physics": { "gravity_y": 900 },
  "spawn": { "x": 64, "y": 520 },
  "background_key": "fiec_day",
  "platforms": [
    { "id": 1, "x": 0, "y": 660, "width": 900, "height": 40,
      "kind": "solid", "texture_key": "tile_concreto" }
  ],
  "checkpoints": [
    { "code": "FIEC-01-CP1", "name": "Entrada del Bloque A",
      "position": { "x": 260, "y": 600 }, "kind": "info",
      "info_text": "...", "order": 1 }
  ]
}
```

`platforms[].kind`: `solid` | `moving` | `hazard`.
`checkpoints[].kind`: `info` | `mission` | `goal`.

### `POST /levels/:code/state` → 201
Guarda la partida. Los checkpoints se acumulan sin duplicar; `exploracion_pct`
se deriva de ellos.

```json
{ "player_id": 2, "avatar": { "x": 1180, "y": 600 }, "lives": 3,
  "elapsed_seconds": 42, "checkpoints_reached": ["FIEC-01-CP1"] }
```

Respuesta: `{ "message": "estado_guardado", "state": { ...ver abajo... } }`

### `GET /levels/:code/state?player_id=` → 200
```json
{ "level_code": "FIEC-01", "puntaje": 30,
  "puntaje_misiones": 20, "puntaje_nivel": 10, "exploracion_pct": 66.67,
  "checkpoints_alcanzados": ["FIEC-01-CP1", "FIEC-01-CP2"],
  "misiones_completadas": 1, "avatar": { "x": 1180, "y": 600 },
  "vidas": 3, "segundos_jugados": 42,
  "completado": false, "completado_el": null }
```

## RF-02 · Selector de niveles — Kevin Gálvez

### `GET /levels?zona=&mundo=&player_id=`
```json
{ "count": 3, "filters": { "zona": null, "mundo": null }, "player_id": 2,
  "levels": [ { "code": "FIEC-01", "name": "...", "zone": "FIEC",
                "world": "Zona Norte", "order": 1, "difficulty": "facil",
                "required_score": 0, "desbloqueado": true, "description": "...",
                "checkpoints_count": 3 } ] }
```

## RF-04 · Catálogo de misiones — José Gaviño

### `GET /levels/:code/missions?player_id=&tipo=`
```json
{ "level_code": "FIEC-01", "level_name": "...", "count": 1, "player_id": 2,
  "missions": [ { "code": "M-FIEC-01", "title": "...", "description": "...",
                  "kind": "trivia", "checkpoint_code": "FIEC-01-CP2",
                  "questions_count": 2, "max_points": 20,
                  "insignia": "insignia_fiec", "order": 1,
                  "estado": "pendiente" } ] }
```
`estado`: `pendiente` | `resuelta` | `desconocido` (si no se envía `player_id`).
`desbloqueado` compara el puntaje total del jugador con `required_score`; sin
`player_id` el catálogo se devuelve completo como desbloqueado.

### `GET /missions/:code`
Igual que la fila anterior más `level_code` y `questions`. **Nunca** incluye la
opción correcta.

```json
{ "questions": [ { "id": 1, "statement": "¿Qué significan las siglas FIEC?",
                   "options": ["...", "...", "...", "..."],
                   "points": 10, "order": 1 } ] }
```

## RF-03 · Registro de respuestas — José Gaviño

### `POST /missions/:code/answers` → 201
```json
{ "player_id": 2, "question_id": 1, "selected_option": 0 }
```
```json
{ "message": "respuesta_registrada",
  "answer": { "id": 1, "player_id": 2, "mission_code": "M-FIEC-01",
              "question_id": 1, "selected_option": 0, "correcta": true,
              "puntaje_otorgado": 10, "intento": 1, "respondida_el": "..." },
  "feedback": "¡Correcto! ...",
  "insignias_otorgadas": ["insignia_fiec"],
  "resumen_mision": { "mission_code": "M-FIEC-01", "puntaje_obtenido": 10,
                      "puntaje_maximo": 20, "preguntas_correctas": 1,
                      "preguntas_totales": 2, "completada": false,
                      "insignia": "insignia_fiec" } }
```
El puntaje se otorga **una sola vez por pregunta**: los reintentos se registran
con `puntaje_otorgado: 0`. Al completar la misión el backend **otorga la insignia
por su cuenta** y suma los puntos al progreso del nivel, así que aparecen en el
ranking sin necesidad de un `POST /progress`.

### `GET /players/:id/answers`
Historial completo del jugador con su puntaje acumulado.

## RF-05 · Progreso e insignias — Jorge del Campo

### `POST /progress` → 201
```json
{ "player_id": 2, "level_code": "FIEC-01", "score": 20,
  "completed": true,
  "badges": ["insignia_fiec", "insignia_novato"] }
```
```json
{ "message": "progreso_registrado",
  "insignias_otorgadas": ["insignia_fiec"],
  "perfil": { ...igual que GET /progress/:player_id... } }
```
El puntaje **nunca baja**: se conserva el mejor intento. `insignias_otorgadas`
lista solo las nuevas; las repetidas y las que no existen no aparecen.
`missions_completed` no se recibe: se deriva de las respuestas de trivia.

El puntaje de un nivel es `puntaje_nivel` (lo que envía este endpoint) más
`puntaje_misiones` (lo que el jugador ganó en las trivias). Cada uno lo escribe
un solo camino.

### `GET /progress/:player_id`
```json
{ "player_id": 2, "nickname": "jose_g", "email": "...", "facultad": "FIEC",
  "puntaje_total": 50, "niveles_superados": 2,
  "exploracion_promedio_pct": 83.34,
  "niveles": [ { ...estado del nivel... } ],
  "insignias": [ { "key": "insignia_fiec", "nombre": "Explorador FIEC",
                   "descripcion": "...", "icono": "chip",
                   "obtenida_el": "..." } ] }
```

## RF-06 · Tabla de clasificación — Jorge del Campo

### `GET /ranking?facultad=FIEC&limit=10`
```json
{ "alcance": "facultad:FIEC", "total_jugadores": 2, "mostrados": 2,
  "tabla": [ { "player_id": 2, "nickname": "jose_g", "facultad": "FIEC",
               "puntaje_total": 50, "niveles_superados": 2,
               "insignias": 3, "posicion": 1 } ] }
```
Orden: puntaje total, luego niveles superados, luego nickname.
`limit` por defecto 10, máximo 100.

## Base

| Método | Endpoint | Notas |
|---|---|---|
| GET | `/health` | estado del servicio, versión de Rails y Ruby |
| GET | `/badges` | catálogo de insignias |
| GET | `/players` | lista de jugadores |
| POST | `/players` | `{ nickname, email, facultad }` → 201 |

Facultades válidas: `FIEC` `FCNM` `FICT` `FIMCP` `FCSH` `FADCOM` `FIMCBOR` `FCV`.

## Errores comunes

| Situación | Código | `error` |
|---|---|---|
| Falta un campo obligatorio | 400 | `campos_requeridos` |
| Recurso inexistente | 404 | `recurso_no_encontrado` |
| Validación del modelo | 422 | `datos_invalidos` |
| Un número llegó con basura (`"abc"`) | 422 | `valor_numerico_invalido` |
| Checkpoint que no existe en el nivel | 422 | `checkpoints_invalidos` |
| Opción fuera de rango | 422 | `opcion_invalida` |
| La pregunta no pertenece a la misión | 422 | `pregunta_no_pertenece_a_la_mision` |
