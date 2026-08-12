# Relación perfil-insignia con la fecha de obtención.
# Responsable: Jorge del Campo
class ProfileBadge < ApplicationRecord
  belongs_to :profile
  belongs_to :badge

  validates :badge_id, uniqueness: { scope: :profile_id }
end
