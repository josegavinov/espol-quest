# Nivel de plataformas que representa una zona del campus.
# RF-01 escenario y fisicas, RF-02 selector de niveles.
class Level < ApplicationRecord
  belongs_to :badge, optional: true
  has_many :platforms, dependent: :destroy
  has_many :checkpoints, -> { order(:order_index) }, dependent: :destroy
  has_many :missions, dependent: :destroy
  has_many :level_progresses, dependent: :destroy

  validates :code, :name, :zone, :world, presence: true
  validates :code, uniqueness: true

  scope :active, -> { where(active: true).order(:order_index) }

  def checkpoint_codes
    checkpoints.map(&:code)
  end

  # Un nivel se desbloquea con el puntaje acumulado del jugador.
  def unlocked_for?(player)
    player.total_score >= required_score
  end

  # Payload liviano del selector de niveles (RF-02). Sin jugador se devuelve el
  # catalogo completo como desbloqueado: es el catalogo, no la partida de nadie.
  def as_summary(player = nil)
    {
      code: code,
      name: name,
      zone: zone,
      world: world,
      order: order_index,
      difficulty: difficulty,
      required_score: required_score,
      insignia: badge&.key,
      desbloqueado: player.nil? || unlocked_for?(player),
      description: description,
      checkpoints_count: checkpoints.size
    }
  end

  # Vista del CMS con todos los campos editables del nivel.
  def as_admin
    {
      code: code,
      name: name,
      zone: zone,
      world: world,
      order_index: order_index,
      description: description,
      difficulty: difficulty,
      required_score: required_score,
      active: active,
      width: width,
      height: height,
      gravity_y: gravity_y,
      spawn_x: spawn_x,
      spawn_y: spawn_y,
      background_key: background_key,
      badge_key: badge&.key,
      checkpoints_count: checkpoints.size
    }
  end

  # Payload completo que consume el motor Phaser para armar la escena (RF-01).
  def as_detail
    {
      code: code,
      name: name,
      zone: zone,
      world: world,
      difficulty: difficulty,
      bounds: { width: width, height: height },
      physics: { gravity_y: gravity_y },
      spawn: { x: spawn_x, y: spawn_y },
      background_key: background_key,
      platforms: platforms.map(&:as_detail),
      checkpoints: checkpoints.map(&:as_detail)
    }
  end
end
