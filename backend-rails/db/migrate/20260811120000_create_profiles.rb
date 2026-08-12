# Perfil de progreso del jugador dentro del Servicio de Administración y Ranking.
# Responsable: Jorge del Campo
class CreateProfiles < ActiveRecord::Migration[7.1]
  def change
    create_table :profiles do |t|
      t.integer :external_player_id, null: false   # id del jugador en el servicio Flask
      t.string  :nickname, null: false
      t.string  :facultad, null: false
      t.integer :total_score, null: false, default: 0
      t.integer :levels_completed, null: false, default: 0
      t.timestamps
    end

    add_index :profiles, :external_player_id, unique: true
    add_index :profiles, :facultad
  end
end
