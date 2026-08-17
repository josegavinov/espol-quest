# Avance de un jugador dentro de un nivel: estado de la partida y resultado.
#
# El puntaje tiene dos origenes: mission_score sale de las respuestas de trivia
# y score lo envia el juego al terminar el nivel.
class LevelProgress < ApplicationRecord
  belongs_to :player
  belongs_to :level

  validates :level_id, uniqueness: { scope: :player_id }
  validates :score, :mission_score, :lives, :elapsed_seconds,
            numericality: { greater_than_or_equal_to: 0 }

  def total_points
    score + mission_score
  end

  # El puntaje nunca baja: se conserva el mejor intento del jugador.
  def keep_best(score:, completed:)
    self.score = [self.score.to_i, score.to_i].max
    return unless ActiveModel::Type::Boolean.new.cast(completed)

    self.completed = true
    self.completed_at ||= Time.current
  end

  # Guarda la partida. Lo que no se envia conserva su valor anterior.
  def apply_state(avatar: {}, checkpoints_reached: [], lives: nil, elapsed_seconds: nil)
    reach(checkpoints_reached)
    self.avatar_x = avatar[:x] || (persisted? ? avatar_x : level.spawn_x)
    self.avatar_y = avatar[:y] || (persisted? ? avatar_y : level.spawn_y)
    self.lives = lives || self.lives
    self.elapsed_seconds = elapsed_seconds || self.elapsed_seconds
    self
  end

  def reach(codes)
    alcanzados = checkpoints_reached.to_a | Array(codes)
    self.checkpoints_reached = level.checkpoint_codes & alcanzados
  end

  # Codigos que no existen en el nivel; el controlador los rechaza con 422.
  def unknown_checkpoints(codes)
    Array(codes) - level.checkpoint_codes
  end

  # Se deriva de los checkpoints alcanzados en vez de guardarse.
  def exploration_pct
    total = level.checkpoints.size
    return 0.0 if total.zero?

    (checkpoints_reached.size * 100.0 / total).round(2)
  end

  def as_detail
    {
      level_code: level.code,
      puntaje: total_points,
      puntaje_misiones: mission_score,
      puntaje_nivel: score,
      exploracion_pct: exploration_pct,
      checkpoints_alcanzados: checkpoints_reached,
      misiones_completadas: missions_completed,
      avatar: { x: avatar_x, y: avatar_y },
      vidas: lives,
      segundos_jugados: elapsed_seconds,
      completado: completed,
      completado_el: completed_at
    }
  end
end
