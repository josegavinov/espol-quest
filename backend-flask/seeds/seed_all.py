"""Carga los datos de demostración del Servicio Principal de Juego.

Uso:  python -m seeds.seed_all
"""
from app import create_app
from app.extensions import db
from app.models import Player
from seeds.seed_levels import seed_levels
from seeds.seed_missions import seed_missions

PLAYERS = [
    {"nickname": "kevin_g", "email": "kagalvez@espol.edu.ec", "facultad": "FIEC"},
    {"nickname": "jose_g", "email": "jgavino@espol.edu.ec", "facultad": "FIEC"},
    {"nickname": "jorge_dc", "email": "jdelcampo@espol.edu.ec", "facultad": "FCNM"},
    {"nickname": "novato01", "email": "novato01@espol.edu.ec", "facultad": "FIMCP"},
]


def seed_players():
    created = 0
    for data in PLAYERS:
        if Player.query.filter_by(email=data["email"]).first():
            continue
        db.session.add(Player(**data))
        created += 1
    db.session.commit()
    return created


def main():
    app = create_app()
    with app.app_context():
        players = seed_players()
        levels = seed_levels()
        missions = seed_missions()
        print(f"Jugadores creados : {players}")
        print(f"Niveles creados   : {levels}")
        print(f"Misiones creadas  : {missions}")
        print("Seed completado.")


if __name__ == "__main__":
    main()
