class PlayerBadge < ApplicationRecord
  belongs_to :player, counter_cache: :badges_count
  belongs_to :badge

  validates :badge_id, uniqueness: { scope: :player_id }
end
