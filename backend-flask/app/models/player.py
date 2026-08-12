"""Modelo de jugador (base compartida del servicio de juego)."""
from datetime import datetime, timezone

from app.extensions import db


class Player(db.Model):
    __tablename__ = "players"

    id = db.Column(db.Integer, primary_key=True)
    nickname = db.Column(db.String(40), nullable=False, unique=True)
    email = db.Column(db.String(120), nullable=False, unique=True)
    facultad = db.Column(db.String(20), nullable=False)
    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    def to_dict(self):
        return {
            "id": self.id,
            "nickname": self.nickname,
            "email": self.email,
            "facultad": self.facultad,
        }
