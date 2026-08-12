# Perfil de progreso de un jugador.
# Responsable: Jorge del Campo
class Profile < ApplicationRecord
  FACULTADES = %w[FIEC FCNM FIMCP FCSH FIMCBOR FCV].freeze

  has_many :level_progresses, dependent: :destroy
  has_many :profile_badges, dependent: :destroy
  has_many :badges, through: :profile_badges

  validates :external_player_id, presence: true, uniqueness: true
  validates :nickname, presence: true
  validates :facultad, presence: true, inclusion: { in: FACULTADES }

  # Recalcula el puntaje acumulado y los niveles superados a partir del progreso.
  def recalculate_totals!
    update!(
      total_score: level_progresses.sum(:score),
      levels_completed: level_progresses.where(completed: true).count
    )
  end

  def exploration_pct
    return 0.0 if level_progresses.empty?

    (level_progresses.average(:exploration_pct) || 0).to_f.round(2)
  end

  def as_summary
    {
      player_id: external_player_id,
      nickname: nickname,
      facultad: facultad,
      puntaje_total: total_score,
      niveles_superados: levels_completed,
      insignias: badges.count
    }
  end

  def as_detail
    {
      player_id: external_player_id,
      nickname: nickname,
      facultad: facultad,
      puntaje_total: total_score,
      niveles_superados: levels_completed,
      exploracion_promedio_pct: exploration_pct,
      niveles: level_progresses.order(:level_code).map(&:as_json_public),
      insignias: profile_badges.includes(:badge).map do |pb|
        pb.badge.as_json_public.merge(obtenida_el: pb.awarded_at)
      end
    }
  end
end
