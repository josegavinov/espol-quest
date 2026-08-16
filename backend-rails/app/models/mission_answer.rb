# Respuesta enviada por el jugador, con su validacion y el puntaje otorgado.
class MissionAnswer < ApplicationRecord
  belongs_to :player
  belongs_to :mission
  belongs_to :question

  def as_json_public
    {
      id: id,
      player_id: player_id,
      mission_code: mission.code,
      question_id: question_id,
      selected_option: selected_option,
      correcta: correct,
      puntaje_otorgado: points_awarded,
      intento: attempt,
      respondida_el: answered_at
    }
  end
end
