# Progreso del jugador por nivel: puntaje, exploración y estado.
# Responsable: Jorge del Campo
class CreateLevelProgresses < ActiveRecord::Migration[7.1]
  def change
    create_table :level_progresses do |t|
      t.references :profile, null: false, foreign_key: true
      t.string   :level_code, null: false
      t.integer  :score, null: false, default: 0
      t.decimal  :exploration_pct, precision: 5, scale: 2, null: false, default: 0
      t.boolean  :completed, null: false, default: false
      t.integer  :missions_completed, null: false, default: 0
      t.datetime :completed_at
      t.timestamps
    end

    add_index :level_progresses, %i[profile_id level_code], unique: true
  end
end
