# Cuerpo con el que colisiona el avatar: piso, plataforma movil u obstaculo.
class Platform < ApplicationRecord
  KINDS = %w[solid moving hazard].freeze

  belongs_to :level

  validates :kind, inclusion: { in: KINDS }

  def as_json_public
    {
      id: id,
      x: x,
      y: y,
      width: width,
      height: height,
      kind: kind,
      texture_key: texture_key
    }
  end
end
