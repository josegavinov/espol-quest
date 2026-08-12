"""Datos semilla de niveles, plataformas y checkpoints del campus.

Responsable: Kevin Gálvez
"""
from app.extensions import db
from app.models import Checkpoint, Level, Platform

LEVELS = [
    {
        "code": "FIEC-01",
        "name": "Bloque FIEC: Laboratorios",
        "zone": "FIEC",
        "world": "Zona Norte",
        "order_index": 1,
        "difficulty": "facil",
        "required_score": 0,
        "description": "Recorre los laboratorios de la Facultad de Ingeniería en "
                       "Electricidad y Computación y ubica sus servicios.",
        "width": 2400, "height": 720, "gravity_y": 900,
        "spawn_x": 64, "spawn_y": 520, "background_key": "fiec_day",
        "platforms": [
            {"x": 0, "y": 660, "width": 900, "height": 40, "kind": "solid"},
            {"x": 980, "y": 660, "width": 700, "height": 40, "kind": "solid"},
            {"x": 1760, "y": 660, "width": 640, "height": 40, "kind": "solid"},
            {"x": 420, "y": 520, "width": 180, "height": 24, "kind": "solid",
             "texture_key": "tile_metal"},
            {"x": 760, "y": 430, "width": 160, "height": 24, "kind": "moving",
             "texture_key": "tile_metal"},
            {"x": 1320, "y": 500, "width": 200, "height": 24, "kind": "solid"},
            {"x": 900, "y": 690, "width": 80, "height": 10, "kind": "hazard",
             "texture_key": "tile_agua"},
        ],
        "checkpoints": [
            {"code": "FIEC-01-CP1", "name": "Entrada del Bloque A", "x": 260, "y": 600,
             "kind": "info", "order_index": 1,
             "info_text": "El Bloque A concentra las aulas de primer año de FIEC."},
            {"code": "FIEC-01-CP2", "name": "Laboratorio de Redes", "x": 1180, "y": 600,
             "kind": "mission", "order_index": 2,
             "info_text": "Aquí se dictan las prácticas de Redes de Datos."},
            {"code": "FIEC-01-CP3", "name": "Secretaría FIEC", "x": 2080, "y": 600,
             "kind": "goal", "order_index": 3,
             "info_text": "Trámites académicos: registro, cambios de paralelo y retiros."},
        ],
    },
    {
        "code": "BIB-01",
        "name": "Biblioteca Central",
        "zone": "Biblioteca",
        "world": "Zona Central",
        "order_index": 2,
        "difficulty": "media",
        "required_score": 30,
        "description": "Explora la Biblioteca Central, sus salas de estudio y el "
                       "servicio de préstamo de libros.",
        "width": 2000, "height": 720, "gravity_y": 900,
        "spawn_x": 80, "spawn_y": 540, "background_key": "biblioteca_day",
        "platforms": [
            {"x": 0, "y": 660, "width": 1200, "height": 40, "kind": "solid"},
            {"x": 1300, "y": 660, "width": 700, "height": 40, "kind": "solid"},
            {"x": 380, "y": 540, "width": 220, "height": 24, "kind": "solid"},
            {"x": 820, "y": 440, "width": 200, "height": 24, "kind": "solid"},
            {"x": 1200, "y": 690, "width": 100, "height": 10, "kind": "hazard"},
        ],
        "checkpoints": [
            {"code": "BIB-01-CP1", "name": "Counter de préstamos", "x": 300, "y": 600,
             "kind": "mission", "order_index": 1,
             "info_text": "Se prestan hasta 3 libros por estudiante durante 7 días."},
            {"code": "BIB-01-CP2", "name": "Sala de estudio grupal", "x": 1520, "y": 600,
             "kind": "goal", "order_index": 2,
             "info_text": "Las salas grupales se reservan en línea desde el sistema."},
        ],
    },
    {
        "code": "BE-01",
        "name": "Bienestar Estudiantil",
        "zone": "Bienestar Estudiantil",
        "world": "Zona Central",
        "order_index": 3,
        "difficulty": "media",
        "required_score": 60,
        "description": "Ubica las oficinas de Bienestar Estudiantil y conoce los "
                       "servicios de becas y apoyo psicológico.",
        "width": 1800, "height": 720, "gravity_y": 900,
        "spawn_x": 64, "spawn_y": 540, "background_key": "bienestar_day",
        "platforms": [
            {"x": 0, "y": 660, "width": 1800, "height": 40, "kind": "solid"},
            {"x": 500, "y": 520, "width": 200, "height": 24, "kind": "solid"},
            {"x": 1000, "y": 430, "width": 180, "height": 24, "kind": "moving"},
        ],
        "checkpoints": [
            {"code": "BE-01-CP1", "name": "Oficina de Becas", "x": 640, "y": 600,
             "kind": "mission", "order_index": 1,
             "info_text": "Las becas socioeconómicas se solicitan al inicio de cada término."},
            {"code": "BE-01-CP2", "name": "Consejería estudiantil", "x": 1450, "y": 600,
             "kind": "goal", "order_index": 2,
             "info_text": "Atención psicológica gratuita con cita previa."},
        ],
    },
]


def seed_levels():
    created = 0
    for raw in LEVELS:
        if Level.query.filter_by(code=raw["code"]).first():
            continue
        data = dict(raw)
        platforms = data.pop("platforms")
        checkpoints = data.pop("checkpoints")
        level = Level(**data)
        level.platforms = [Platform(**p) for p in platforms]
        level.checkpoints = [Checkpoint(**c) for c in checkpoints]
        db.session.add(level)
        created += 1
    db.session.commit()
    return created
