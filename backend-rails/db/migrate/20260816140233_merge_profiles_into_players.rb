# Fusiona el perfil de Rails con el jugador que vivia en el servicio Flask.
# Antes la misma persona existia dos veces: players (Flask) y profiles (Rails),
# unidos por un external_player_id que nada garantizaba. Ahora hay un solo dueno
# de la identidad y las demas tablas apuntan a el con una llave foranea real.
class MergeProfilesIntoPlayers < ActiveRecord::Migration[7.1]
  def change
    rename_table :profiles, :players

    remove_index  :players, :external_player_id
    remove_column :players, :external_player_id, :integer, null: false

    add_column :players, :email, :string
    add_index  :players, :email, unique: true
    add_index  :players, :nickname, unique: true

    # Contador desnormalizado: evita una consulta COUNT por fila del ranking.
    add_column :players, :badges_count, :integer, null: false, default: 0

    rename_table  :profile_badges, :player_badges
    rename_column :player_badges, :profile_id, :player_id

    rename_column :level_progresses, :profile_id, :player_id
  end
end
