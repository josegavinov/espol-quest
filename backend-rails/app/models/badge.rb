# Insignia otorgable al completar misiones o niveles.
# Responsable: Jorge del Campo
class Badge < ApplicationRecord
  has_many :profile_badges, dependent: :destroy
  has_many :profiles, through: :profile_badges

  validates :key, presence: true, uniqueness: true
  validates :name, presence: true

  def as_json_public
    { key: key, nombre: name, descripcion: description, icono: icon }
  end
end
