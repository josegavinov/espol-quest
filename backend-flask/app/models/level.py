"""Modelos del escenario 2D: niveles, plataformas, checkpoints y estado de partida.

Responsable: Kevin Gálvez
RF-01 Gestionar escenario y físicas 2D
RF-02 Consultar selector de niveles / mapa de juego
"""
from datetime import datetime, timezone

from app.extensions import db


class Level(db.Model):
    """Un nivel de plataformas que representa una zona del campus."""

    __tablename__ = "levels"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(20), nullable=False, unique=True)
    name = db.Column(db.String(80), nullable=False)
    zone = db.Column(db.String(40), nullable=False)       # FIEC, FCNM, Biblioteca...
    world = db.Column(db.String(40), nullable=False)      # agrupación en el mapa
    order_index = db.Column(db.Integer, nullable=False, default=1)
    description = db.Column(db.Text, nullable=False, default="")
    difficulty = db.Column(db.String(10), nullable=False, default="facil")
    required_score = db.Column(db.Integer, nullable=False, default=0)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    # Parámetros de físicas y renderizado del escenario
    width = db.Column(db.Integer, nullable=False, default=2400)
    height = db.Column(db.Integer, nullable=False, default=720)
    gravity_y = db.Column(db.Integer, nullable=False, default=900)
    spawn_x = db.Column(db.Integer, nullable=False, default=64)
    spawn_y = db.Column(db.Integer, nullable=False, default=520)
    background_key = db.Column(db.String(40), nullable=False, default="campus_day")

    platforms = db.relationship(
        "Platform", back_populates="level", cascade="all, delete-orphan",
        order_by="Platform.id",
    )
    checkpoints = db.relationship(
        "Checkpoint", back_populates="level", cascade="all, delete-orphan",
        order_by="Checkpoint.order_index",
    )

    def to_summary(self):
        """Payload liviano usado por el selector de niveles (RF-02)."""
        return {
            "code": self.code,
            "name": self.name,
            "zone": self.zone,
            "world": self.world,
            "order": self.order_index,
            "difficulty": self.difficulty,
            "required_score": self.required_score,
            "description": self.description,
            "checkpoints_count": len(self.checkpoints),
        }

    def to_scene(self):
        """Payload completo que consume el motor Phaser para armar el nivel (RF-01)."""
        return {
            "code": self.code,
            "name": self.name,
            "zone": self.zone,
            "world": self.world,
            "difficulty": self.difficulty,
            "bounds": {"width": self.width, "height": self.height},
            "physics": {"gravity_y": self.gravity_y},
            "spawn": {"x": self.spawn_x, "y": self.spawn_y},
            "background_key": self.background_key,
            "platforms": [p.to_dict() for p in self.platforms],
            "checkpoints": [c.to_dict() for c in self.checkpoints],
        }


class Platform(db.Model):
    """Cuerpo estático o móvil con el que colisiona el avatar."""

    __tablename__ = "platforms"

    id = db.Column(db.Integer, primary_key=True)
    level_id = db.Column(db.Integer, db.ForeignKey("levels.id"), nullable=False)
    x = db.Column(db.Integer, nullable=False)
    y = db.Column(db.Integer, nullable=False)
    width = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Integer, nullable=False, default=32)
    kind = db.Column(db.String(15), nullable=False, default="solid")  # solid|moving|hazard
    texture_key = db.Column(db.String(40), nullable=False, default="tile_concreto")

    level = db.relationship("Level", back_populates="platforms")

    def to_dict(self):
        return {
            "id": self.id,
            "x": self.x,
            "y": self.y,
            "width": self.width,
            "height": self.height,
            "kind": self.kind,
            "texture_key": self.texture_key,
        }


class Checkpoint(db.Model):
    """Punto de interés dentro del nivel; puede disparar una misión."""

    __tablename__ = "checkpoints"

    id = db.Column(db.Integer, primary_key=True)
    level_id = db.Column(db.Integer, db.ForeignKey("levels.id"), nullable=False)
    code = db.Column(db.String(30), nullable=False, unique=True)
    name = db.Column(db.String(80), nullable=False)
    x = db.Column(db.Integer, nullable=False)
    y = db.Column(db.Integer, nullable=False)
    kind = db.Column(db.String(15), nullable=False, default="info")  # info|mission|goal
    info_text = db.Column(db.Text, nullable=False, default="")
    order_index = db.Column(db.Integer, nullable=False, default=1)

    level = db.relationship("Level", back_populates="checkpoints")

    def to_dict(self):
        return {
            "code": self.code,
            "name": self.name,
            "position": {"x": self.x, "y": self.y},
            "kind": self.kind,
            "info_text": self.info_text,
            "order": self.order_index,
        }


class LevelState(db.Model):
    """Estado de la partida de un jugador dentro de un nivel (escritura de RF-01)."""

    __tablename__ = "level_states"
    __table_args__ = (
        db.UniqueConstraint("player_id", "level_id", name="uq_level_state_player_level"),
    )

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    level_id = db.Column(db.Integer, db.ForeignKey("levels.id"), nullable=False)
    avatar_x = db.Column(db.Integer, nullable=False, default=0)
    avatar_y = db.Column(db.Integer, nullable=False, default=0)
    lives = db.Column(db.Integer, nullable=False, default=3)
    elapsed_seconds = db.Column(db.Integer, nullable=False, default=0)
    checkpoints_reached = db.Column(db.JSON, nullable=False, default=list)
    status = db.Column(db.String(15), nullable=False, default="en_curso")  # en_curso|completado
    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    level = db.relationship("Level")
    player = db.relationship("Player")

    def to_dict(self):
        total = len(self.level.checkpoints) if self.level else 0
        reached = len(self.checkpoints_reached or [])
        return {
            "player_id": self.player_id,
            "level_code": self.level.code if self.level else None,
            "avatar": {"x": self.avatar_x, "y": self.avatar_y},
            "lives": self.lives,
            "elapsed_seconds": self.elapsed_seconds,
            "checkpoints_reached": self.checkpoints_reached or [],
            "exploration_pct": round(reached / total * 100, 2) if total else 0.0,
            "status": self.status,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
