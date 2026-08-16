# Jugador: identidad, progreso acumulado e insignias.
# Es el unico dueno de la identidad del jugador en todo el sistema.
class Player < ApplicationRecord
  FACULTADES = %w[FIEC FCNM FICT FIMCP FCSH FADCOM FIMCBOR FCV].freeze

  has_many :level_progresses, dependent: :destroy
  has_many :player_badges, dependent: :destroy
  has_many :badges, through: :player_badges
  has_many :mission_answers, dependent: :destroy

  validates :nickname, presence: true, uniqueness: true
  validates :email, uniqueness: true, allow_nil: true
  validates :facultad, presence: true, inclusion: { in: FACULTADES }

  # RF-05 (escritura). Registra el resultado de un nivel y devuelve las
  # insignias que se otorgaron en esta llamada; las que el jugador ya tenia y
  # las que no existen en el catalogo simplemente no aparecen en la lista.
  def register_level_result(level:, score: 0, missions_completed: 0,
                            completed: false, badge_keys: [])
    awarded = []

    transaction do
      progress = level_progresses.find_or_initialize_by(level: level)
      progress.keep_best(score: score, missions_completed: missions_completed,
                         completed: completed)
      progress.save!
      awarded = award(badge_keys)
      recalculate_totals!
    end

    awarded
  end

  # Otorga las insignias indicadas que el jugador aun no tenga.
  def award(badge_keys)
    nuevas = Badge.where(key: badge_keys).where.not(id: badge_ids).to_a
    nuevas.each { |badge| player_badges.create!(badge: badge, awarded_at: Time.current) }
    nuevas
  end

  def recalculate_totals!
    update!(
      total_score: level_progresses.sum(:score),
      levels_completed: level_progresses.where(completed: true).count
    )
  end

  # Promedio de exploracion sobre los niveles jugados. Precarga los checkpoints
  # porque cada nivel los necesita para calcular su porcentaje.
  def exploration_pct
    jugados = progress_with_checkpoints
    return 0.0 if jugados.empty?

    (jugados.sum(&:exploration_pct) / jugados.size).round(2)
  end

  # Fila de la tabla de clasificacion (RF-06).
  def as_summary
    {
      player_id: id,
      nickname: nickname,
      facultad: facultad,
      puntaje_total: total_score,
      niveles_superados: levels_completed,
      insignias: badges_count
    }
  end

  # Perfil completo de progreso (RF-05 lectura).
  def as_detail
    {
      player_id: id,
      nickname: nickname,
      email: email,
      facultad: facultad,
      puntaje_total: total_score,
      niveles_superados: levels_completed,
      exploracion_promedio_pct: exploration_pct,
      niveles: progress_with_checkpoints.map(&:as_detail),
      insignias: player_badges.includes(:badge).map do |pb|
        pb.badge.as_detail.merge(obtenida_el: pb.awarded_at)
      end
    }
  end

  private

  # Sin memoizar a proposito: guardar el resultado en la instancia lo dejaria
  # obsoleto en cuanto se registre un nivel nuevo sobre el mismo objeto.
  def progress_with_checkpoints
    level_progresses.includes(level: :checkpoints).to_a
  end
end
