# Punto de interes dentro del nivel; al alcanzarlo puede disparar una mision.
class Checkpoint < ApplicationRecord
  KINDS = %w[info mission goal].freeze

  belongs_to :level
  has_one :mission, dependent: :nullify

  validates :code, :name, presence: true
  validates :code, uniqueness: true
  validates :kind, inclusion: { in: KINDS }

  def as_detail
    {
      code: code,
      name: name,
      position: { x: x, y: y },
      kind: kind,
      info_text: info_text,
      order: order_index
    }
  end
end
