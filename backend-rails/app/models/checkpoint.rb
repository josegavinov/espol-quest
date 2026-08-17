# Punto de interes dentro del nivel; al alcanzarlo puede disparar una mision.
class Checkpoint < ApplicationRecord
  KINDS = %w[info mission goal].freeze

  belongs_to :level
  has_one :mission, dependent: :nullify

  validates :code, :name, presence: true
  validates :code, uniqueness: true
  validates :kind, inclusion: { in: KINDS }

  # Vista del CMS: mismos datos, pero planos para editarlos en un formulario.
  def as_admin
    {
      code: code,
      level_code: level.code,
      name: name,
      x: x,
      y: y,
      kind: kind,
      info_text: info_text,
      order_index: order_index
    }
  end

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
