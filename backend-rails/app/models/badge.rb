# Insignia otorgable al completar misiones o niveles.
# Es el catalogo unico: las misiones apuntan aqui con una llave foranea.
class Badge < ApplicationRecord
  has_many :player_badges, dependent: :destroy
  has_many :players, through: :player_badges
  has_many :missions, dependent: :nullify

  validates :key, presence: true, uniqueness: true
  validates :name, presence: true

  def as_json_public
    { key: key, nombre: name, descripcion: description, icono: icon }
  end
end
