"""Registro y consulta de jugadores (base compartida del servicio de juego)."""
from flask import Blueprint, jsonify, request
from sqlalchemy.exc import IntegrityError

from app.extensions import db
from app.models import Player

bp = Blueprint("players", __name__, url_prefix="/api/v1/players")

FACULTADES = {"FIEC", "FCNM", "FIMCP", "FCSH", "FIMCBOR", "FCV"}


@bp.get("")
def list_players():
    players = Player.query.order_by(Player.id).all()
    return jsonify({"count": len(players), "players": [p.to_dict() for p in players]})


@bp.post("")
def create_player():
    payload = request.get_json(silent=True) or {}
    missing = [f for f in ("nickname", "email", "facultad") if not payload.get(f)]
    if missing:
        return jsonify({"error": "campos_requeridos", "detalle": missing}), 400

    facultad = str(payload["facultad"]).upper()
    if facultad not in FACULTADES:
        return jsonify({"error": "facultad_invalida", "validas": sorted(FACULTADES)}), 422

    player = Player(
        nickname=payload["nickname"],
        email=payload["email"],
        facultad=facultad,
    )
    db.session.add(player)
    try:
        db.session.commit()
    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "nickname_o_email_ya_registrado"}), 409

    return jsonify({"message": "jugador_registrado", "player": player.to_dict()}), 201


@bp.get("/<int:player_id>")
def get_player(player_id):
    player = db.session.get(Player, player_id)
    if player is None:
        return jsonify({"error": "jugador_no_encontrado", "player_id": player_id}), 404
    return jsonify(player.to_dict())
