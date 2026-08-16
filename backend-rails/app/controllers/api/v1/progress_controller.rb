# Registro y consulta del progreso e insignias del jugador.
# Responsable: Jorge del Campo
# RF-05 Registrar progreso e insignias del jugador
module Api
  module V1
    class ProgressController < ApplicationController
      # POST /api/v1/progress — resultado de un nivel terminado.
      def create
        player = Player.find(progress_params[:player_id])
        level = find_level!(progress_params[:level_code])

        awarded = player.register_level_result(
          level: level,
          score: progress_params[:score],
          missions_completed: progress_params[:missions_completed],
          completed: progress_params[:completed],
          badge_keys: Array(progress_params[:badges])
        )

        render json: {
          message: "progreso_registrado",
          insignias_otorgadas: awarded.map(&:key),
          perfil: player.reload.as_detail
        }, status: 201
      end

      # GET /api/v1/progress/:player_id
      def show
        render json: Player.find(params[:player_id]).as_detail
      end

      private

      def progress_params
        params.require(:player_id)
        params.require(:level_code)
        params.permit(:player_id, :level_code, :score, :missions_completed,
                      :completed, badges: [])
      end
    end
  end
end
