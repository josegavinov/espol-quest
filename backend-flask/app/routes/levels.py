"""Endpoints del escenario 2D y del selector de niveles.

Responsable: Kevin Gálvez
RF-01 Gestionar escenario y físicas 2D  -> GET /levels/<code>  +  POST /levels/<code>/state
RF-02 Consultar selector de niveles     -> GET /levels
"""
from flask import Blueprint, jsonify, request

from app.extensions import db
from app.models import Level, LevelState, Player

bp = Blueprint("levels", __name__, url_prefix="/api/v1/levels")


@bp.get("")
def list_levels():
    """RF-02 (lectura): mapa de juego con los niveles disponibles."""
    query = Level.query.filter_by(is_active=True)

    zone = request.args.get("zona")
    if zone:
        query = query.filter(Level.zone.ilike(zone))

    world = request.args.get("mundo")
    if world:
        query = query.filter(Level.world.ilike(world))

    levels = query.order_by(Level.order_index).all()
    return jsonify({
        "count": len(levels),
        "filters": {"zona": zone, "mundo": world},
        "levels": [lv.to_summary() for lv in levels],
    })


@bp.get("/<string:code>")
def get_level_scene(code):
    """RF-01 (lectura): escenario completo que arma el motor de plataformas."""
    level = Level.query.filter_by(code=code.upper()).first()
    if level is None:
        return jsonify({"error": "nivel_no_encontrado", "code": code}), 404
    return jsonify(level.to_scene())


@bp.post("/<string:code>/state")
def save_level_state(code):
    """RF-01 (escritura): guarda posición del avatar y checkpoints alcanzados."""
    level = Level.query.filter_by(code=code.upper()).first()
    if level is None:
        return jsonify({"error": "nivel_no_encontrado", "code": code}), 404

    payload = request.get_json(silent=True) or {}
    player_id = payload.get("player_id")
    if not player_id:
        return jsonify({"error": "player_id_requerido"}), 400

    player = db.session.get(Player, player_id)
    if player is None:
        return jsonify({"error": "jugador_no_encontrado", "player_id": player_id}), 404

    avatar = payload.get("avatar") or {}
    reached = payload.get("checkpoints_reached", [])
    if not isinstance(reached, list):
        return jsonify({"error": "checkpoints_reached_debe_ser_lista"}), 400

    valid_codes = {c.code for c in level.checkpoints}
    invalid = [c for c in reached if c not in valid_codes]
    if invalid:
        return jsonify({"error": "checkpoints_invalidos", "detalle": invalid}), 422

    state = LevelState.query.filter_by(player_id=player_id, level_id=level.id).first()
    if state is None:
        state = LevelState(player_id=player_id, level_id=level.id)
        db.session.add(state)

    state.avatar_x = int(avatar.get("x", level.spawn_x))
    state.avatar_y = int(avatar.get("y", level.spawn_y))
    state.lives = int(payload.get("lives", state.lives or 3))
    state.elapsed_seconds = int(payload.get("elapsed_seconds", state.elapsed_seconds or 0))
    # Se acumulan los checkpoints sin duplicar, respetando el orden del nivel.
    merged = set(state.checkpoints_reached or []) | set(reached)
    state.checkpoints_reached = [c.code for c in level.checkpoints if c.code in merged]
    state.status = "completado" if len(state.checkpoints_reached) == len(valid_codes) else "en_curso"

    db.session.commit()
    return jsonify({"message": "estado_guardado", "state": state.to_dict()}), 201


@bp.get("/<string:code>/state")
def get_level_state(code):
    """Lectura del estado guardado para reanudar la partida."""
    level = Level.query.filter_by(code=code.upper()).first()
    if level is None:
        return jsonify({"error": "nivel_no_encontrado", "code": code}), 404

    player_id = request.args.get("player_id", type=int)
    if not player_id:
        return jsonify({"error": "player_id_requerido"}), 400

    state = LevelState.query.filter_by(player_id=player_id, level_id=level.id).first()
    if state is None:
        return jsonify({"error": "sin_estado_guardado", "level_code": level.code}), 404
    return jsonify(state.to_dict())
