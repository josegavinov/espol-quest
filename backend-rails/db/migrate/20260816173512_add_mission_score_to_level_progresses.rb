# Separa el puntaje que el jugador gana respondiendo trivias del que gana al
# terminar el nivel. Antes las respuestas correctas sumaban puntos que nunca
# llegaban a la tabla de clasificacion.
#
# Cada columna tiene un solo escritor: mission_score se deriva de las respuestas
# de las misiones, score lo envia el juego al terminar el nivel. El puntaje del
# nivel es la suma de ambas.
class AddMissionScoreToLevelProgresses < ActiveRecord::Migration[7.1]
  def change
    add_column :level_progresses, :mission_score, :integer, null: false, default: 0
  end
end
