# Progreso de un jugador en un nivel concreto.
# Responsable: Jorge del Campo
class LevelProgress < ApplicationRecord
  belongs_to :profile

  validates :level_code, presence: true,
                         uniqueness: { scope: :profile_id, message: "ya registrado para este perfil" }
  validates :score, numericality: { greater_than_or_equal_to: 0 }
  validates :exploration_pct, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 100 }

  def as_json_public
    {
      level_code: level_code,
      puntaje: score,
      exploracion_pct: exploration_pct.to_f,
      misiones_completadas: missions_completed,
      completado: completed,
      completado_el: completed_at
    }
  end
end
