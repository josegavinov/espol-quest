# Insignias obtenidas por cada perfil.
# Responsable: Jorge del Campo
class CreateProfileBadges < ActiveRecord::Migration[7.1]
  def change
    create_table :profile_badges do |t|
      t.references :profile, null: false, foreign_key: true
      t.references :badge, null: false, foreign_key: true
      t.datetime :awarded_at, null: false
      t.timestamps
    end

    add_index :profile_badges, %i[profile_id badge_id], unique: true
  end
end
