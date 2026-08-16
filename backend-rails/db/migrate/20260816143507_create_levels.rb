# Niveles de plataformas, sus cuerpos colisionables y sus puntos de interes.
# Migrado desde el servicio Flask (RF-01, RF-02 - Kevin Galvez).
class CreateLevels < ActiveRecord::Migration[7.1]
  def change
    create_table :levels do |t|
      t.string  :code, null: false
      t.string  :name, null: false
      t.string  :zone, null: false                       # FIEC, Biblioteca, Bienestar...
      t.string  :world, null: false                      # agrupacion en el selector
      t.integer :order_index, null: false, default: 1
      t.text    :description, null: false, default: ""
      t.string  :difficulty, null: false, default: "facil"
      t.integer :required_score, null: false, default: 0
      t.boolean :active, null: false, default: true

      # Parametros que el motor Phaser necesita para armar la escena.
      t.integer :width, null: false, default: 2400
      t.integer :height, null: false, default: 720
      t.integer :gravity_y, null: false, default: 900
      t.integer :spawn_x, null: false, default: 64
      t.integer :spawn_y, null: false, default: 520
      t.string  :background_key, null: false, default: "campus_day"

      t.timestamps
    end

    add_index :levels, :code, unique: true

    create_table :platforms do |t|
      t.references :level, null: false, foreign_key: true
      t.integer :x, null: false
      t.integer :y, null: false
      t.integer :width, null: false
      t.integer :height, null: false, default: 32
      t.string  :kind, null: false, default: "solid"     # solid | moving | hazard
      t.string  :texture_key, null: false, default: "tile_concreto"
      t.timestamps
    end

    create_table :checkpoints do |t|
      t.references :level, null: false, foreign_key: true
      t.string  :code, null: false
      t.string  :name, null: false
      t.integer :x, null: false
      t.integer :y, null: false
      t.string  :kind, null: false, default: "info"      # info | mission | goal
      t.text    :info_text, null: false, default: ""
      t.integer :order_index, null: false, default: 1
      t.timestamps
    end

    add_index :checkpoints, :code, unique: true
  end
end
