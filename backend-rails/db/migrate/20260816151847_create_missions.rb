# Motor de misiones y trivias.
# Migrado desde el servicio Flask (RF-03, RF-04 - Jose Gavino).
#
# La insignia de la mision deja de ser un texto suelto ("insignia_fiec" escrito
# a mano en dos servicios) y pasa a ser una llave foranea al catalogo de
# insignias: si alguien renombra una, la base de datos lo impide.
class CreateMissions < ActiveRecord::Migration[7.1]
  def change
    create_table :missions do |t|
      t.string     :code, null: false
      t.references :level, null: false, foreign_key: true
      t.references :checkpoint, foreign_key: true
      t.references :badge, foreign_key: true
      t.string     :title, null: false
      t.text       :description, null: false, default: ""
      t.string     :kind, null: false, default: "trivia"   # trivia | exploracion
      t.integer    :order_index, null: false, default: 1
      t.boolean    :active, null: false, default: true
      t.timestamps
    end

    add_index :missions, :code, unique: true

    create_table :questions do |t|
      t.references :mission, null: false, foreign_key: true
      t.text    :statement, null: false
      t.json    :options, null: false, default: []
      t.integer :correct_option, null: false
      t.integer :points, null: false, default: 10
      t.text    :feedback_ok, null: false, default: "¡Correcto!"
      t.text    :feedback_fail, null: false, default: "Respuesta incorrecta."
      t.integer :order_index, null: false, default: 1
      t.timestamps
    end

    create_table :mission_answers do |t|
      t.references :player, null: false, foreign_key: true
      t.references :mission, null: false, foreign_key: true
      t.references :question, null: false, foreign_key: true
      t.integer  :selected_option, null: false
      t.boolean  :correct, null: false, default: false
      t.integer  :points_awarded, null: false, default: 0
      t.integer  :attempt, null: false, default: 1
      t.datetime :answered_at, null: false
      t.timestamps
    end

    add_index :mission_answers, %i[player_id question_id]
  end
end
