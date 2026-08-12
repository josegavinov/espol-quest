"""Datos semilla de misiones y trivias por nivel.

Responsable: José Gaviño
"""
from app.extensions import db
from app.models import Level, Mission, Question

MISSIONS = [
    {
        "code": "M-FIEC-01",
        "level_code": "FIEC-01",
        "checkpoint_code": "FIEC-01-CP2",
        "title": "¿Qué se estudia en FIEC?",
        "description": "Responde la trivia del Laboratorio de Redes para avanzar.",
        "kind": "trivia",
        "badge_key": "insignia_fiec",
        "order_index": 1,
        "questions": [
            {
                "statement": "¿Qué significan las siglas FIEC?",
                "options": [
                    "Facultad de Ingeniería en Electricidad y Computación",
                    "Facultad de Investigación en Energía y Ciencias",
                    "Facultad de Ingeniería Electrónica y Civil",
                    "Facultad de Informática, Electricidad y Comunicación",
                ],
                "correct_option": 0,
                "points": 10,
                "feedback_ok": "¡Correcto! FIEC agrupa las carreras de electricidad, "
                               "electrónica, telemática y computación.",
                "feedback_fail": "Incorrecto. FIEC es la Facultad de Ingeniería en "
                                 "Electricidad y Computación.",
                "order_index": 1,
            },
            {
                "statement": "¿En qué zona del campus Gustavo Galindo se ubica FIEC?",
                "options": ["Zona Sur", "Zona Norte", "Fuera del campus", "Zona Peñas"],
                "correct_option": 1,
                "points": 10,
                "feedback_ok": "¡Bien! FIEC está en la zona norte del campus Prosperina.",
                "feedback_fail": "No es correcto. FIEC se ubica en la zona norte.",
                "order_index": 2,
            },
        ],
    },
    {
        "code": "M-BIB-01",
        "level_code": "BIB-01",
        "checkpoint_code": "BIB-01-CP1",
        "title": "Normativa de la Biblioteca Central",
        "description": "Demuestra que conoces las reglas de préstamo de libros.",
        "kind": "trivia",
        "badge_key": "insignia_lector",
        "order_index": 1,
        "questions": [
            {
                "statement": "¿Cuántos libros puede prestarse un estudiante a la vez?",
                "options": ["1", "3", "5", "Ilimitados"],
                "correct_option": 1,
                "points": 15,
                "feedback_ok": "¡Correcto! Son hasta 3 libros por estudiante.",
                "feedback_fail": "Incorrecto. El límite es de 3 libros por estudiante.",
                "order_index": 1,
            },
            {
                "statement": "¿Cómo se reserva una sala de estudio grupal?",
                "options": [
                    "Presencialmente en el counter",
                    "Por correo al decano",
                    "En línea desde el sistema de la biblioteca",
                    "No se pueden reservar",
                ],
                "correct_option": 2,
                "points": 15,
                "feedback_ok": "¡Exacto! La reserva es en línea.",
                "feedback_fail": "Incorrecto. Las salas se reservan en línea.",
                "order_index": 2,
            },
        ],
    },
    {
        "code": "M-BE-01",
        "level_code": "BE-01",
        "checkpoint_code": "BE-01-CP1",
        "title": "Servicios de Bienestar Estudiantil",
        "description": "Identifica los apoyos que ofrece Bienestar Estudiantil.",
        "kind": "trivia",
        "badge_key": "insignia_bienestar",
        "order_index": 1,
        "questions": [
            {
                "statement": "¿Qué servicio NO ofrece Bienestar Estudiantil?",
                "options": [
                    "Becas socioeconómicas",
                    "Atención psicológica",
                    "Venta de libros de texto",
                    "Consejería estudiantil",
                ],
                "correct_option": 2,
                "points": 20,
                "feedback_ok": "¡Correcto! La venta de libros no es un servicio de Bienestar.",
                "feedback_fail": "Incorrecto. Bienestar sí ofrece becas, atención "
                                 "psicológica y consejería.",
                "order_index": 1,
            },
        ],
    },
]


def seed_missions():
    created = 0
    for raw in MISSIONS:
        if Mission.query.filter_by(code=raw["code"]).first():
            continue
        data = dict(raw)
        level_code = data.pop("level_code")
        questions = data.pop("questions")
        level = Level.query.filter_by(code=level_code).first()
        if level is None:
            raise RuntimeError(
                f"El nivel {level_code} no existe: ejecuta primero el seed de niveles."
            )
        mission = Mission(level_id=level.id, **data)
        mission.questions = [Question(**q) for q in questions]
        db.session.add(mission)
        created += 1
    db.session.commit()
    return created
