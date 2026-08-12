# Catálogo de insignias otorgables.
# Responsable: Jorge del Campo
class CreateBadges < ActiveRecord::Migration[7.1]
  def change
    create_table :badges do |t|
      t.string :key, null: false
      t.string :name, null: false
      t.string :description, null: false, default: ""
      t.string :icon, null: false, default: "medalla"
      t.timestamps
    end

    add_index :badges, :key, unique: true
  end
end
