"""Modelos del motor de misiones y trivias.

Responsable: José Gaviño
RF-03 Registrar respuestas de misiones en nivel
RF-04 Consultar misiones y trivias disponibles
"""
from datetime import datetime, timezone

from app.extensions import db


class Mission(db.Model):
    """Misión asociada a un nivel; se dispara al alcanzar un checkpoint."""

    __tablename__ = "missions"

    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(30), nullable=False, unique=True)
    level_id = db.Column(db.Integer, db.ForeignKey("levels.id"), nullable=False)
    checkpoint_code = db.Column(db.String(30), nullable=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False, default="")
    kind = db.Column(db.String(15), nullable=False, default="trivia")  # trivia|exploracion
    badge_key = db.Column(db.String(40), nullable=True)
    order_index = db.Column(db.Integer, nullable=False, default=1)
    is_active = db.Column(db.Boolean, nullable=False, default=True)

    level = db.relationship("Level")
    questions = db.relationship(
        "Question", back_populates="mission", cascade="all, delete-orphan",
        order_by="Question.order_index",
    )

    @property
    def max_points(self):
        return sum(q.points for q in self.questions)

    def to_summary(self):
        """Catálogo de misiones del nivel (RF-04)."""
        return {
            "code": self.code,
            "title": self.title,
            "description": self.description,
            "kind": self.kind,
            "checkpoint_code": self.checkpoint_code,
            "questions_count": len(self.questions),
            "max_points": self.max_points,
            "badge_key": self.badge_key,
            "order": self.order_index,
        }

    def to_detail(self):
        """Detalle con preguntas; nunca expone cuál es la opción correcta."""
        data = self.to_summary()
        data["level_code"] = self.level.code if self.level else None
        data["questions"] = [q.to_dict() for q in self.questions]
        return data


class Question(db.Model):
    """Pregunta de trivia con opciones múltiples."""

    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    mission_id = db.Column(db.Integer, db.ForeignKey("missions.id"), nullable=False)
    statement = db.Column(db.Text, nullable=False)
    options = db.Column(db.JSON, nullable=False, default=list)
    correct_option = db.Column(db.Integer, nullable=False)
    points = db.Column(db.Integer, nullable=False, default=10)
    feedback_ok = db.Column(db.Text, nullable=False, default="¡Correcto!")
    feedback_fail = db.Column(db.Text, nullable=False, default="Respuesta incorrecta.")
    order_index = db.Column(db.Integer, nullable=False, default=1)

    mission = db.relationship("Mission", back_populates="questions")

    def to_dict(self):
        return {
            "id": self.id,
            "statement": self.statement,
            "options": self.options,
            "points": self.points,
            "order": self.order_index,
        }


class MissionAnswer(db.Model):
    """Respuesta enviada por el jugador; guarda validación y puntaje otorgado."""

    __tablename__ = "mission_answers"

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey("players.id"), nullable=False)
    mission_id = db.Column(db.Integer, db.ForeignKey("missions.id"), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey("questions.id"), nullable=False)
    selected_option = db.Column(db.Integer, nullable=False)
    is_correct = db.Column(db.Boolean, nullable=False, default=False)
    points_awarded = db.Column(db.Integer, nullable=False, default=0)
    attempt = db.Column(db.Integer, nullable=False, default=1)
    answered_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )

    player = db.relationship("Player")
    mission = db.relationship("Mission")
    question = db.relationship("Question")

    def to_dict(self):
        return {
            "id": self.id,
            "player_id": self.player_id,
            "mission_code": self.mission.code if self.mission else None,
            "question_id": self.question_id,
            "selected_option": self.selected_option,
            "is_correct": self.is_correct,
            "points_awarded": self.points_awarded,
            "attempt": self.attempt,
            "answered_at": self.answered_at.isoformat() if self.answered_at else None,
        }
