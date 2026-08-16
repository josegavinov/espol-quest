# Alta y consulta de jugadores.
module Api
  module V1
    class PlayersController < ApplicationController
      # GET /api/v1/players
      def index
        players = Player.order(:id)
        render json: { count: players.size, players: players.map(&:as_summary) }
      end

      # POST /api/v1/players
      def create
        player = Player.create!(player_params.merge(facultad: params[:facultad].to_s.upcase))
        render json: { message: "jugador_registrado", player: player.as_summary }, status: 201
      end

      # GET /api/v1/players/:id/answers — historial de respuestas del jugador.
      def answers
        player = Player.find(params[:id])
        answers = player.mission_answers.includes(:mission).order(answered_at: :desc)

        render json: {
          player: player.as_summary,
          puntaje_total: answers.sum(:points_awarded),
          count: answers.size,
          answers: answers.map(&:as_detail)
        }
      end

      private

      def player_params
        params.require(:nickname)
        params.require(:facultad)
        params.permit(:nickname, :email, :facultad)
      end
    end
  end
end
