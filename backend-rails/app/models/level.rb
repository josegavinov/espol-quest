# Nivel de plataformas que representa una zona del campus.
# RF-01 escenario y fisicas, RF-02 selector de niveles.
class Level < ApplicationRecord
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

  # Payload liviano del selector de niveles (RF-02).
  def as_summary
    {
      code: code,
      name: name,
      zone: zone,
      world: world,
      order: order_index,
      difficulty: difficulty,
      required_score: required_score,
      description: description,
      checkpoints_count: checkpoints.size
    }
  end

  # Payload completo que consume el motor Phaser para armar la escena (RF-01).
  def as_scene
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
      platforms: platforms.map(&:as_json_public),
      checkpoints: checkpoints.map(&:as_json_public)
    }
  end
end
