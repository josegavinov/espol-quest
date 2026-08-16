# Une el avance del jugador en un nivel en una sola fila.
#
# Antes ese avance vivia partido en dos tablas de dos servicios distintos:
# level_states (Flask: posicion del avatar, vidas, checkpoints alcanzados) y
# level_progresses (Rails: puntaje, insignias, nivel superado). Ambas estaban
# indexadas por el mismo par jugador-nivel y cada una calculaba el porcentaje de
# exploracion a su manera.
#
# Ahora es una sola tabla y el porcentaje de exploracion ya no se guarda: se
# deriva de los checkpoints alcanzados sobre el total del nivel, asi no puede
# quedar desincronizado.
class UnifyLevelProgressState < ActiveRecord::Migration[7.1]
  def change
    remove_index  :level_progresses, %i[player_id level_code]
    remove_column :level_progresses, :level_code, :string, null: false
    remove_column :level_progresses, :exploration_pct, :decimal,
                  precision: 5, scale: 2, null: false, default: 0

    add_reference :level_progresses, :level, null: false, foreign_key: true

    # Estado de la partida dentro del nivel (venia de level_states en Flask).
    add_column :level_progresses, :avatar_x, :integer, null: false, default: 0
    add_column :level_progresses, :avatar_y, :integer, null: false, default: 0
    add_column :level_progresses, :lives, :integer, null: false, default: 3
    add_column :level_progresses, :elapsed_seconds, :integer, null: false, default: 0
    add_column :level_progresses, :checkpoints_reached, :json, null: false, default: []

    add_index :level_progresses, %i[player_id level_id], unique: true
  end
end
