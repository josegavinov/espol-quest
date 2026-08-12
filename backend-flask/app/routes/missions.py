"""Endpoints del motor de misiones y trivias.

Responsable: José Gaviño
RF-03 Registrar respuestas de misiones -> POST /missions/<code>/answers
RF-04 Consultar misiones y trivias     -> GET /levels/<code>/missions, GET /missions/<code>
"""
from flask import Blueprint, jsonify, request
from sqlalchemy import func

from app.extensions import db
from app.models import Level, Mission, MissionAnswer, Player, Question

bp = Blueprint("missions", __name__, url_prefix="/api/v1")


@bp.get("/levels/<string:code>/missions")
def list_level_missions(code):
    """RF-04 (lectura): catálogo de misiones asignadas a un nivel/facultad."""
    level = Level.query.filter_by(code=code.upper()).first()
    if level is None:
        return jsonify({"error": "nivel_no_encontrado", "code": code}), 404

    query = Mission.query.filter_by(level_id=level.id, is_active=True)
    kind = request.args.get("tipo")
    if kind:
        query = query.filter(Mission.kind == kind)

    missions = query.order_by(Mission.order_index).all()

    # Estado por jugador: cuántas misiones ya resolvió correctamente.
    player_id = request.args.get("player_id", type=int)
    solved = set()
    if player_id:
        rows = (
            db.session.query(MissionAnswer.mission_id)
            .filter(MissionAnswer.player_id == player_id, MissionAnswer.is_correct.is_(True))
            .distinct()
            .all()
        )
        solved = {r[0] for r in rows}

    payload = []
    for mission in missions:
        item = mission.to_summary()
        item["estado"] = "resuelta" if mission.id in solved else "pendiente"
        payload.append(item)

    return jsonify({
        "level_code": level.code,
        "level_name": level.name,
        "count": len(payload),
        "player_id": player_id,
        "missions": payload,
    })


@bp.get("/missions/<string:code>")
def get_mission(code):
    """RF-04 (lectura): detalle de la misión con sus preguntas."""
    mission = Mission.query.filter_by(code=code.upper()).first()
    if mission is None:
        return jsonify({"error": "mision_no_encontrada", "code": code}), 404
    return jsonify(mission.to_detail())


@bp.post("/missions/<string:code>/answers")
def register_answer(code):
    """RF-03 (escritura): valida la respuesta del jugador y otorga puntaje."""
    mission = Mission.query.filter_by(code=code.upper()).first()
    if mission is None:
        return jsonify({"error": "mision_no_encontrada", "code": code}), 404

    payload = request.get_json(silent=True) or {}
    missing = [f for f in ("player_id", "question_id", "selected_option") if payload.get(f) is None]
    if missing:
        return jsonify({"error": "campos_requeridos", "detalle": missing}), 400

    player = db.session.get(Player, payload["player_id"])
    if player is None:
        return jsonify({"error": "jugador_no_encontrado", "player_id": payload["player_id"]}), 404

    question = db.session.get(Question, payload["question_id"])
    if question is None or question.mission_id != mission.id:
        return jsonify({"error": "pregunta_no_pertenece_a_la_mision"}), 422

    selected = payload["selected_option"]
    if not isinstance(selected, int) or not 0 <= selected < len(question.options):
        return jsonify({
            "error": "opcion_invalida",
            "opciones_validas": list(range(len(question.options))),
        }), 422

    previous = (
        MissionAnswer.query
        .filter_by(player_id=player.id, question_id=question.id)
        .order_by(MissionAnswer.attempt.desc())
        .first()
    )
    # El puntaje se otorga una sola vez por pregunta: los reintentos valen 0.
    already_scored = previous is not None and previous.is_correct
    is_correct = selected == question.correct_option
    points = question.points if (is_correct and not already_scored) else 0

    answer = MissionAnswer(
        player_id=player.id,
        mission_id=mission.id,
        question_id=question.id,
        selected_option=selected,
        is_correct=is_correct,
        points_awarded=points,
        attempt=(previous.attempt + 1) if previous else 1,
    )
    db.session.add(answer)
    db.session.commit()

    mission_points = (
        db.session.query(func.coalesce(func.sum(MissionAnswer.points_awarded), 0))
        .filter_by(player_id=player.id, mission_id=mission.id)
        .scalar()
    )
    correct_count = (
        db.session.query(func.count(func.distinct(MissionAnswer.question_id)))
        .filter_by(player_id=player.id, mission_id=mission.id, is_correct=True)
        .scalar()
    )
    completed = correct_count == len(mission.questions)

    return jsonify({
        "message": "respuesta_registrada",
        "answer": answer.to_dict(),
        "feedback": question.feedback_ok if is_correct else question.feedback_fail,
        "ya_puntuada": already_scored,
        "resumen_mision": {
            "mission_code": mission.code,
            "puntaje_obtenido": int(mission_points),
            "puntaje_maximo": mission.max_points,
            "preguntas_correctas": int(correct_count),
            "preguntas_totales": len(mission.questions),
            "completada": completed,
            "insignia_desbloqueada": mission.badge_key if completed else None,
        },
    }), 201


@bp.get("/players/<int:player_id>/answers")
def player_answers(player_id):
    """Historial de respuestas del jugador (lectura de apoyo para el perfil)."""
    player = db.session.get(Player, player_id)
    if player is None:
        return jsonify({"error": "jugador_no_encontrado", "player_id": player_id}), 404

    answers = (
        MissionAnswer.query
        .filter_by(player_id=player_id)
        .order_by(MissionAnswer.answered_at.desc())
        .all()
    )
    total = sum(a.points_awarded for a in answers)
    return jsonify({
        "player": player.to_dict(),
        "puntaje_total": total,
        "count": len(answers),
        "answers": [a.to_dict() for a in answers],
    })
