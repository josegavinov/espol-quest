# Escenario 2D y selector de niveles.
# Responsable: Kevin Galvez
# RF-01 Gestionar escenario y fisicas 2D
# RF-02 Consultar selector de niveles / mapa de juego
module Api
  module V1
    class LevelsController < ApplicationController
      # GET /api/v1/levels?zona=FIEC&mundo=Zona%20Norte&player_id=2
      def index
        levels = Level.active
        levels = levels.where(zone: params[:zona]) if params[:zona].present?
        levels = levels.where(world: params[:mundo]) if params[:mundo].present?
        player = Player.find_by(id: params[:player_id])

        render json: {
          count: levels.size,
          filters: { zona: params[:zona], mundo: params[:mundo] },
          player_id: player&.id,
          levels: levels.map { |level| level.as_summary(player) }
        }
      end

      # GET /api/v1/levels/:code — escena completa que arma el motor Phaser.
      def show
        render json: find_level!(params[:code]).as_detail
      end

      # POST /api/v1/levels/:code/state — guarda la partida dentro del nivel.
      def save_state
        level = find_level!(params[:code])
        player = Player.find(state_params[:player_id])
        progress = player.level_progresses.find_or_initialize_by(level: level)

        desconocidos = progress.unknown_checkpoints(state_params[:checkpoints_reached])
        if desconocidos.any?
          return render json: { error: "checkpoints_invalidos", detalle: desconocidos }, status: 422
        end

        avatar = state_params.fetch(:avatar, {})
        progress.apply_state(
          avatar: { x: integer_param(avatar[:x]), y: integer_param(avatar[:y]) },
          checkpoints_reached: state_params[:checkpoints_reached],
          lives: integer_param(state_params[:lives]),
          elapsed_seconds: integer_param(state_params[:elapsed_seconds])
        ).save!

        render json: { message: "estado_guardado", state: progress.as_detail }, status: 201
      end

      # GET /api/v1/levels/:code/state?player_id= — para reanudar la partida.
      def show_state
        level = find_level!(params[:code])
        progress = LevelProgress.find_by!(level: level, player_id: params.require(:player_id))

        render json: progress.as_detail
      end

      private

      def state_params
        params.require(:player_id)
        params.permit(:player_id, :lives, :elapsed_seconds,
                      avatar: %i[x y], checkpoints_reached: [])
      end
    end
  end
end
