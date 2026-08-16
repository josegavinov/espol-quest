# Motor de misiones y trivias.
# Responsable: Jose Gavino
# RF-03 Registrar respuestas de misiones en nivel
# RF-04 Consultar misiones y trivias disponibles
module Api
  module V1
    class MissionsController < ApplicationController
      # GET /api/v1/levels/:code/missions?player_id=&tipo=
      def index
        level = find_level!(params[:code])
        missions = level.missions.active
        missions = missions.where(kind: params[:tipo]) if params[:tipo].present?
        player = Player.find_by(id: params[:player_id])

        render json: {
          level_code: level.code,
          level_name: level.name,
          count: missions.size,
          player_id: player&.id,
          missions: missions.map { |mission| mission_row(mission, player) }
        }
      end

      # GET /api/v1/missions/:code — detalle con preguntas, sin la respuesta correcta.
      def show
        render json: find_mission!(params[:code]).as_detail
      end

      # POST /api/v1/missions/:code/answers — valida la respuesta y otorga puntaje.
      def create_answer
        mission = find_mission!(params[:code])
        player = Player.find(answer_params[:player_id])
        question = mission.questions.find_by(id: answer_params[:question_id])
        seleccion = answer_params[:selected_option].to_i

        if question.nil?
          return render json: { error: "pregunta_no_pertenece_a_la_mision" }, status: 422
        end
        unless question.valid_option?(seleccion)
          return render json: { error: "opcion_invalida",
                                opciones_validas: (0...question.options.size).to_a }, status: 422
        end

        answer = mission.register_answer(player: player, question: question,
                                         selected_option: seleccion)

        render json: {
          message: "respuesta_registrada",
          answer: answer.as_detail,
          feedback: question.feedback_for(answer.correct),
          resumen_mision: mission.summary_for(player)
        }, status: 201
      end

      private

      def answer_params
        params.require(:player_id)
        params.require(:question_id)
        params.require(:selected_option)
        params.permit(:player_id, :question_id, :selected_option)
      end

      def mission_row(mission, player)
        estado = if player.nil?
                   "desconocido"
                 else
                   mission.solved_by?(player) ? "resuelta" : "pendiente"
                 end

        mission.as_summary.merge(estado: estado)
      end
    end
  end
end
